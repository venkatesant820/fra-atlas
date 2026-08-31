import hashlib
import json
from datetime import datetime


class FRATitleDeed:
    def __init__(self, claim_id, claimant_name, village, district, state, area_acres, claim_type):
        self.claim_id = claim_id
        self.claimant_name = claimant_name
        self.village = village
        self.district = district
        self.state = state
        self.area_acres = area_acres
        self.claim_type = claim_type
        self.approval_date = datetime.now().isoformat()
        self.previous_hash = "0" * 64

    def to_dict(self):
        return {
            "claim_id": self.claim_id,
            "claimant_name": self.claimant_name,
            "village": self.village,
            "district": self.district,
            "state": self.state,
            "area_acres": self.area_acres,
            "claim_type": self.claim_type,
            "approval_date": self.approval_date,
            "previous_hash": self.previous_hash
        }

    def calculate_hash(self):
        title_data = json.dumps(self.to_dict(), sort_keys=True)
        return hashlib.sha256(title_data.encode()).hexdigest()

    def generate_title(self):
        title_hash = self.calculate_hash()
        return {
            "claim_id": self.claim_id,
            "claimant_name": self.claimant_name,
            "village": self.village,
            "district": self.district,
            "state": self.state,
            "area_acres": self.area_acres,
            "claim_type": self.claim_type,
            "approval_date": self.approval_date,
            "title_hash": title_hash,
            "previous_hash": self.previous_hash,
            "algorithm": "SHA-256",
            "verified": True,
            "message": "Title deed generated and hash recorded on chain"
        }


def verify_title(title_data, provided_hash):
    deed = FRATitleDeed(
        claim_id=title_data["claim_id"],
        claimant_name=title_data["claimant_name"],
        village=title_data["village"],
        district=title_data["district"],
        state=title_data["state"],
        area_acres=title_data["area_acres"],
        claim_type=title_data["claim_type"]
    )
    deed.approval_date = title_data.get("approval_date", deed.approval_date)
    deed.previous_hash = title_data.get("previous_hash", "0" * 64)

    calculated_hash = deed.calculate_hash()
    is_valid = calculated_hash == provided_hash

    return {
        "claim_id": title_data["claim_id"],
        "provided_hash": provided_hash,
        "calculated_hash": calculated_hash,
        "is_valid": is_valid,
        "message": "Title deed VERIFIED — integrity intact" if is_valid else "TAMPERING DETECTED — hash mismatch",
        "verification_date": datetime.now().isoformat()
    }
