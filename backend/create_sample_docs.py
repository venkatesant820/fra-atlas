from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "sample_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_fra_form(filename, claim_data):
    width, height = 800, 1100
    img = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype("arial.ttf", 20)
        header_font = ImageFont.truetype("arial.ttf", 14)
        body_font = ImageFont.truetype("arial.ttf", 13)
    except:
        title_font = ImageFont.load_default()
        header_font = ImageFont.load_default()
        body_font = ImageFont.load_default()

    draw.rectangle([30, 20, width-30, 80], outline="black", width=2)
    draw.text((width//2 - 200, 30), "FOREST RIGHTS ACT, 2006", fill="black", font=title_font)
    draw.text((width//2 - 150, 55), "Individual Forest Rights Claim Form", fill="black", font=header_font)

    draw.line([(30, 95), (width-30, 95)], fill="black", width=1)

    y = 110
    fields = [
        ("Claim ID", claim_data.get("claim_id", "")),
        ("", ""),
        ("Claimant Name", claim_data.get("claimant_name", "")),
        ("", ""),
        ("Father's/Husband's Name", claim_data.get("father_name", "")),
        ("", ""),
        ("Village / Gram Panchayat", claim_data.get("village", "")),
        ("", ""),
        ("District", claim_data.get("district", "")),
        ("", ""),
        ("State", claim_data.get("state", "")),
        ("", ""),
        ("Type of Claim", claim_data.get("claim_type", "")),
        ("", ""),
        ("Land Area (in acres)", str(claim_data.get("area_acres", ""))),
        ("", ""),
        ("Date of Filing", claim_data.get("filing_date", "")),
        ("", ""),
        ("Description of Forest Land", claim_data.get("description", "")),
    ]

    for label, value in fields:
        if label == "" and value == "":
            y += 8
            continue
        draw.text((50, y), f"{label}:", fill="black", font=header_font)
        draw.line([(280, y + 18), (750, y + 18)], fill="gray", width=1)
        draw.text((285, y + 2), value, fill="black", font=body_font)
        y += 35

    draw.line([(30, y + 10), (width-30, y + 10)], fill="black", width=1)
    draw.text((50, y + 20), "Declaration: I hereby declare that the above information is true and correct.", fill="black", font=body_font)
    draw.text((50, y + 45), "Signature of Claimant: ____________________", fill="black", font=body_font)
    draw.text((450, y + 45), "Date: _______________", fill="black", font=body_font)

    draw.rectangle([30, height - 70, width-30, height - 20], outline="black", width=1)
    draw.text((50, height - 60), "For Office Use Only", fill="gray", font=header_font)
    draw.text((50, height - 40), "Received by: ________________  Status: ________________", fill="gray", font=body_font)

    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, "PNG")
    print(f"Created: {filepath}")
    return filepath


if __name__ == "__main__":
    forms = [
        {
            "filename": "fra_claim_001.png",
            "data": {
                "claim_id": "FRA/CG/001",
                "claimant_name": "Ramesh Kumar",
                "father_name": "Suresh Kumar",
                "village": "Turgam",
                "district": "Bastar",
                "state": "Chhattisgarh",
                "claim_type": "Individual Forest Rights (IFR)",
                "area_acres": "2.3",
                "filing_date": "15/03/2019",
                "description": "Self-cultivated forest land for habitation and agriculture"
            }
        },
        {
            "filename": "fra_claim_002.png",
            "data": {
                "claim_id": "FRA/MP/001",
                "claimant_name": "Ram Prasad",
                "father_name": "Shyam Lal",
                "village": "Mandla",
                "district": "Mandla",
                "state": "Madhya Pradesh",
                "claim_type": "Individual Forest Rights (IFR)",
                "area_acres": "4.5",
                "filing_date": "05/11/2018",
                "description": "Ancestral forest land used for agriculture since generations"
            }
        },
        {
            "filename": "fra_claim_003.png",
            "data": {
                "claim_id": "FRA/OD/001",
                "claimant_name": "Birsa Munda",
                "father_name": "Mangal Munda",
                "village": "Koraput",
                "district": "Koraput",
                "state": "Odisha",
                "claim_type": "Community Forest Resource Rights (CFR)",
                "area_acres": "5.0",
                "filing_date": "01/06/2018",
                "description": "Community forest resource management for sustainable use"
            }
        }
    ]

    for form in forms:
        create_fra_form(form["filename"], form["data"])

    print(f"\nAll sample forms created in {OUTPUT_DIR}")
