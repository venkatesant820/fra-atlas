import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import shutil
import uuid

from database import init_db, get_db
from ocr_engine import extract_text_from_image
from anomaly_detector import detect_anomalies
from blockchain import FRATitleDeed, verify_title

app = FastAPI(title="FRA Atlas API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "message": "FRA Atlas API is running"}


@app.get("/api/stats")
def get_stats():
    conn = get_db()
    stats = conn.execute("""
        SELECT
            SUM(claims_received) as total_claims,
            SUM(titles_distributed) as total_titles,
            SUM(rejected) as total_rejected,
            SUM(pending) as total_pending,
            SUM(individual_claims) as total_individual,
            SUM(community_claims) as total_community
        FROM state_stats
    """).fetchone()
    conn.close()
    return {
        "total_claims": stats["total_claims"],
        "total_titles": stats["total_titles"],
        "total_rejected": stats["total_rejected"],
        "total_pending": stats["total_pending"],
        "total_individual": stats["total_individual"],
        "total_community": stats["total_community"],
        "approval_rate": round((stats["total_titles"] / stats["total_claims"]) * 100, 1) if stats["total_claims"] else 0,
        "rejection_rate": round((stats["total_rejected"] / stats["total_claims"]) * 100, 1) if stats["total_claims"] else 0,
    }


@app.get("/api/states")
def get_states():
    conn = get_db()
    rows = conn.execute("SELECT * FROM state_stats ORDER BY claims_received DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/states/{state_name}")
def get_state(state_name: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM state_stats WHERE state = ?", (state_name,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="State not found")
    return dict(row)


@app.get("/api/claims")
def get_claims(status: Optional[str] = None, state: Optional[str] = None):
    conn = get_db()
    query = "SELECT * FROM claims WHERE 1=1"
    params = []
    if status:
        query += " AND status = ?"
        params.append(status)
    if state:
        query += " AND state = ?"
        params.append(state)
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/api/claims/{claim_id}")
def get_claim(claim_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM claims WHERE claim_id = ?", (claim_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Claim not found")
    return dict(row)


@app.post("/api/ocr/scan")
async def scan_document(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in (".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif", ".webp"):
        raise HTTPException(status_code=400, detail="Unsupported file format. Use PNG, JPG, BMP, or TIFF.")

    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = extract_text_from_image(filepath)
        return {
            "filename": file.filename,
            "saved_as": filename,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


@app.get("/api/anomaly/detect")
def run_anomaly_detection():
    return detect_anomalies()


@app.post("/api/blockchain/sign")
def sign_title(data: dict):
    required = ["claim_id", "claimant_name", "village", "district", "state", "area_acres", "claim_type"]
    missing = [f for f in required if f not in data]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    deed = FRATitleDeed(
        claim_id=data["claim_id"],
        claimant_name=data["claimant_name"],
        village=data["village"],
        district=data["district"],
        state=data["state"],
        area_acres=data["area_acres"],
        claim_type=data["claim_type"]
    )
    return deed.generate_title()


@app.post("/api/blockchain/verify")
def verify_deed(data: dict):
    required = ["claim_id", "claimant_name", "village", "district", "state", "area_acres", "claim_type", "title_hash"]
    missing = [f for f in required if f not in data]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    title_data = {k: v for k, v in data.items() if k != "title_hash"}
    return verify_title(title_data, data["title_hash"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
