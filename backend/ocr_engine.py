import os
import re
from paddleocr import PaddleOCR

_ocr_instance = None

def get_ocr():
    global _ocr_instance
    if _ocr_instance is None:
        _ocr_instance = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
    return _ocr_instance

def extract_text_from_image(image_path):
    ocr = get_ocr()
    result = ocr.ocr(image_path, cls=True)

    all_lines = []
    full_text = ""

    if result:
        for item in result:
            if item:
                for line in item:
                    text = line[1][0]
                    confidence = line[1][1]
                    bbox = line[0]
                    all_lines.append({
                        "text": text,
                        "confidence": round(confidence, 4),
                        "bbox": bbox
                    })
                    full_text += text + "\n"

    structured = parse_fra_fields(full_text)

    return {
        "raw_text": full_text.strip(),
        "lines": all_lines,
        "structured_fields": structured,
        "total_lines": len(all_lines),
        "avg_confidence": round(
            sum(l["confidence"] for l in all_lines) / len(all_lines), 4
        ) if all_lines else 0
    }

def parse_fra_fields(text):
    fields = {
        "claimant_name": None,
        "village": None,
        "district": None,
        "state": None,
        "area_acres": None,
        "claim_type": None,
        "filing_date": None,
        "claim_id": None,
    }

    patterns = {
        "claim_id": r"(?:Claim\s*(?:No|Number|ID|#)\s*[:.\-]?\s*)([A-Z]{2,4}[/\-][A-Z]{2}[/\-]\d{2,4})",
        "claimant_name": r"(?:Claimant\s*(?:Name)?|Applicant|Name\s*of\s*(?:Claimant|Applicant))\s*[:.\-]?\s*([A-Za-z\s\.]+?)(?:\s*\n|\s+Father|\s+Mother|\s+Husband|\s*$)",
        "village": r"(?:Village|Gram\s*Panchayat|Hamlet)\s*[:.\-]?\s*([A-Za-z\s]+?)(?:\s*\n|\s*$)",
        "district": r"(?:District|Dist)\s*[:.\-]?\s*([A-Za-z\s]+?)(?:\s*\n|\s+State|\s*$)",
        "state": r"(?:State|Union\s*Territory)\s*[:.\-]?\s*([A-Za-z\s]+?)(?:\s*\n|\s+Type|\s*$)",
        "area_acres": r"(?:Area|Land\s*Area|Extent)\s*(?:\(in\s*acres\))?\s*[:.\-]?\s*(\d+\.?\d*)",
        "claim_type": r"(?:Claim\s*Type|Type\s*of\s*(?:Right|Claim)|Rights\s*Claimed)\s*[:.\-]?\s*(Individual|Community|CFR|IFR|Individual\s+Forest\s+Rights|Community\s+Forest)",
        "filing_date": r"(?:Date\s*of\s*(?:Filing|Application|Submission)|Filed\s*on)\s*[:.\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})",
    }

    for field, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if match:
            value = match.group(1).strip()
            if field == "area_acres":
                try:
                    value = float(value)
                except ValueError:
                    value = None
            elif field in ("claimant_name", "village", "district", "state"):
                value = value.strip().rstrip(",.:;")
            fields[field] = value

    return fields
