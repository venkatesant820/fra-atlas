import requests

print("=== API Health ===")
r = requests.get("http://127.0.0.1:8000/api/health")
print(r.json())

print("\n=== Dashboard Stats ===")
r = requests.get("http://127.0.0.1:8000/api/stats")
d = r.json()
print("Total Claims:", f'{d["total_claims"]:,}')
print("Titles Distributed:", f'{d["total_titles"]:,}')
print("Rejected:", f'{d["total_rejected"]:,}')
print("Pending:", f'{d["total_pending"]:,}')
print("Approval Rate:", d["approval_rate"], "%")

print("\n=== Blockchain Sign ===")
r = requests.post("http://127.0.0.1:8000/api/blockchain/sign", json={
    "claim_id": "FRA/CG/001", "claimant_name": "Ramesh Kumar",
    "village": "Turgam", "district": "Bastar", "state": "Chhattisgarh",
    "area_acres": 2.3, "claim_type": "Individual"
})
t = r.json()
print("Hash:", t["title_hash"][:32] + "...")
print("Message:", t["message"])

print("\n=== Anomaly Detection ===")
r = requests.get("http://127.0.0.1:8000/api/anomaly/detect")
a = r.json()
print("Total anomalies:", a["total_anomalies"])
print("Red:", a["red_flags"], "Orange:", a["orange_flags"], "Yellow:", a["yellow_flags"])
for an in a["anomalies"][:3]:
    print("  [" + an["severity"] + "]", an["description"][:80])

print("\n=== OCR Test ===")
with open("C:\\fra-atlas\\backend\\sample_data\\fra_claim_001.png", "rb") as f:
    r = requests.post("http://127.0.0.1:8000/api/ocr/scan", files={"file": ("form.png", f, "image/png")})
o = r.json()
print("Lines:", o["total_lines"], " Confidence:", round(o["avg_confidence"]*100, 1), "%")
print("claim_id:", o["structured_fields"]["claim_id"])
print("name:", o["structured_fields"]["claimant_name"])
print("area:", o["structured_fields"]["area_acres"], "acres")
print("date:", o["structured_fields"]["filing_date"])

print("\n=== ALL SYSTEMS GO ===")
