import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "fra_atlas.db")

STATE_DATA = [
    {"state": "Andhra Pradesh", "claims_received": 288409, "titles_distributed": 228489, "rejected": 58395, "pending": 1525, "individual_claims": 285115, "community_claims": 3294, "individual_titles": 226667, "community_titles": 1822},
    {"state": "Assam", "claims_received": 216644, "titles_distributed": 87436, "rejected": 16379, "pending": 112829, "individual_claims": 208062, "community_claims": 8582, "individual_titles": 84861, "community_titles": 2575},
    {"state": "Bihar", "claims_received": 4696, "titles_distributed": 191, "rejected": 4496, "pending": 9, "individual_claims": 4696, "community_claims": 0, "individual_titles": 191, "community_titles": 0},
    {"state": "Chhattisgarh", "claims_received": 947479, "titles_distributed": 534068, "rejected": 406787, "pending": 6624, "individual_claims": 890220, "community_claims": 57259, "individual_titles": 481432, "community_titles": 52636},
    {"state": "Goa", "claims_received": 10377, "titles_distributed": 1270, "rejected": 1901, "pending": 7206, "individual_claims": 9978, "community_claims": 399, "individual_titles": 1250, "community_titles": 20},
    {"state": "Gujarat", "claims_received": 190242, "titles_distributed": 103524, "rejected": 2331, "pending": 84387, "individual_claims": 183055, "community_claims": 7187, "individual_titles": 98732, "community_titles": 4792},
    {"state": "Himachal Pradesh", "claims_received": 6968, "titles_distributed": 1098, "rejected": 56, "pending": 5814, "individual_claims": 6100, "community_claims": 868, "individual_titles": 942, "community_titles": 156},
    {"state": "Jharkhand", "claims_received": 110756, "titles_distributed": 61970, "rejected": 28107, "pending": 20679, "individual_claims": 107032, "community_claims": 3724, "individual_titles": 59866, "community_titles": 2104},
    {"state": "Karnataka", "claims_received": 295176, "titles_distributed": 16700, "rejected": 262626, "pending": 15850, "individual_claims": 289236, "community_claims": 5940, "individual_titles": 15355, "community_titles": 1345},
    {"state": "Kerala", "claims_received": 45598, "titles_distributed": 29807, "rejected": 13216, "pending": 2575, "individual_claims": 44580, "community_claims": 1018, "individual_titles": 29523, "community_titles": 284},
    {"state": "Madhya Pradesh", "claims_received": 807405, "titles_distributed": 289461, "rejected": 244487, "pending": 273457, "individual_claims": 766430, "community_claims": 40975, "individual_titles": 260707, "community_titles": 28754},
    {"state": "Maharashtra", "claims_received": 409156, "titles_distributed": 208335, "rejected": 172631, "pending": 28190, "individual_claims": 397897, "community_claims": 11259, "individual_titles": 199667, "community_titles": 8668},
    {"state": "Odisha", "claims_received": 769977, "titles_distributed": 473936, "rejected": 146345, "pending": 149696, "individual_claims": 733158, "community_claims": 36819, "individual_titles": 464504, "community_titles": 9432},
    {"state": "Rajasthan", "claims_received": 118375, "titles_distributed": 51766, "rejected": 65921, "pending": 688, "individual_claims": 113162, "community_claims": 5213, "individual_titles": 49215, "community_titles": 2551},
    {"state": "Tamil Nadu", "claims_received": 34667, "titles_distributed": 16508, "rejected": 12711, "pending": 5448, "individual_claims": 33119, "community_claims": 1548, "individual_titles": 15442, "community_titles": 1066},
    {"state": "Telangana", "claims_received": 655249, "titles_distributed": 231456, "rejected": 94426, "pending": 329367, "individual_claims": 651822, "community_claims": 3427, "individual_titles": 230735, "community_titles": 721},
    {"state": "Tripura", "claims_received": 201122, "titles_distributed": 131680, "rejected": 68472, "pending": 970, "individual_claims": 201055, "community_claims": 67, "individual_titles": 131615, "community_titles": 65},
    {"state": "Uttar Pradesh", "claims_received": 94166, "titles_distributed": 23430, "rejected": 70736, "pending": 0, "individual_claims": 92972, "community_claims": 1194, "individual_titles": 22537, "community_titles": 893},
    {"state": "Uttarakhand", "claims_received": 6928, "titles_distributed": 84, "rejected": 6698, "pending": 146, "individual_claims": 3809, "community_claims": 3119, "individual_titles": 83, "community_titles": 1},
    {"state": "West Bengal", "claims_received": 142081, "titles_distributed": 45130, "rejected": 96587, "pending": 364, "individual_claims": 131962, "community_claims": 10119, "individual_titles": 44444, "community_titles": 686},
    {"state": "Jammu & Kashmir", "claims_received": 46090, "titles_distributed": 6020, "rejected": 39924, "pending": 146, "individual_claims": 33233, "community_claims": 12857, "individual_titles": 429, "community_titles": 5591},
]

SAMPLE_CLAIMS = [
    {"claim_id": "FRA/CG/001", "claimant_name": "Ramesh Kumar", "village": "Turgam", "district": "Bastar", "state": "Chhattisgarh", "area_acres": 2.3, "claim_type": "Individual", "filing_date": "2019-03-15", "status": "Approved", "approval_date": "2019-06-20", "forest_type": "Dense Forest"},
    {"claim_id": "FRA/CG/002", "claimant_name": "Sita Bai", "village": "Kondagaon", "district": "Kondagaon", "state": "Chhattisgarh", "area_acres": 1.8, "claim_type": "Individual", "filing_date": "2019-05-10", "status": "Approved", "approval_date": "2019-08-15", "forest_type": "Moderate Forest"},
    {"claim_id": "FRA/CG/003", "claimant_name": "Lakshmi Devi", "village": "Jagdalpur", "district": "Bastar", "state": "Chhattisgarh", "area_acres": 3.1, "claim_type": "Individual", "filing_date": "2020-01-20", "status": "Rejected", "approval_date": None, "forest_type": "Dense Forest", "rejection_reason": "Claimed land not occupied before 13th December 2005"},
    {"claim_id": "FRA/MP/001", "claimant_name": "Ram Prasad", "village": "Mandla", "district": "Mandla", "state": "Madhya Pradesh", "area_acres": 4.5, "claim_type": "Individual", "filing_date": "2018-11-05", "status": "Approved", "approval_date": "2019-02-28", "forest_type": "Sal Forest"},
    {"claim_id": "FRA/MP/002", "claimant_name": "Geeta Bai", "village": "Dindori", "district": "Dindori", "state": "Madhya Pradesh", "area_acres": 1.2, "claim_type": "Individual", "filing_date": "2019-07-12", "status": "Pending", "approval_date": None, "forest_type": "Mixed Forest"},
    {"claim_id": "FRA/OD/001", "claimant_name": "Birsa Munda", "village": "Koraput", "district": "Koraput", "state": "Odisha", "area_acres": 5.0, "claim_type": "Community", "filing_date": "2018-06-01", "status": "Approved", "approval_date": "2019-01-15", "forest_type": "Tropical Forest"},
    {"claim_id": "FRA/OD/002", "claimant_name": "Laxmi Mazhi", "village": "Rayagada", "district": "Rayagada", "state": "Odisha", "area_acres": 2.7, "claim_type": "Individual", "filing_date": "2019-09-20", "status": "Approved", "approval_date": "2020-03-10", "forest_type": "Dry Deciduous"},
    {"claim_id": "FRA/JH/001", "claimant_name": "Mangal Singh", "village": "Khunti", "district": "Khunti", "state": "Jharkhand", "area_acres": 3.4, "claim_type": "Individual", "filing_date": "2019-02-28", "status": "Rejected", "approval_date": None, "forest_type": "Pencil Sal Wood", "rejection_reason": "Duplicate claim filed on same land"},
    {"claim_id": "FRA/KA/001", "claimant_name": "Venkatesh", "village": "Coorg", "district": "Kodagu", "state": "Karnataka", "area_acres": 1.5, "claim_type": "Individual", "filing_date": "2020-04-10", "status": "Pending", "approval_date": None, "forest_type": "Evergreen Forest"},
    {"claim_id": "FRA/MH/001", "claimant_name": "Suresh Thakur", "village": "Gadchiroli", "district": "Gadchiroli", "state": "Maharashtra", "area_acres": 6.2, "claim_type": "Community", "filing_date": "2018-08-15", "status": "Approved", "approval_date": "2019-05-20", "forest_type": "Teak Forest"},
    {"claim_id": "FRA/TR/001", "claimant_name": "Jhuma Rani", "village": "Tripura Tribal", "district": "Dhalai", "state": "Tripura", "area_acres": 2.0, "claim_type": "Individual", "filing_date": "2019-12-01", "status": "Approved", "approval_date": "2020-06-15", "forest_type": "Bamboo Forest"},
    {"claim_id": "FRA/CG/004", "claimant_name": "Bheema Naik", "village": "Narayanpur", "district": "Narayanpur", "state": "Chhattisgarh", "area_acres": 7.8, "claim_type": "Community", "filing_date": "2017-09-10", "status": "Approved", "approval_date": "2017-12-05", "forest_type": "Dense Forest"},
    {"claim_id": "FRA/ANOMALY/001", "claimant_name": "Suspicious Bulk", "village": "Unknown", "district": "Sample District", "state": "Karnataka", "area_acres": 50.0, "claim_type": "Community", "filing_date": "2021-01-01", "status": "Approved", "approval_date": "2021-01-05", "forest_type": "Unknown", "rejection_reason": None, "anomaly_flag": "Bulk approval: 85% approved in 4 days"},
]

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS state_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state TEXT UNIQUE,
        claims_received INTEGER,
        titles_distributed INTEGER,
        rejected INTEGER,
        pending INTEGER,
        individual_claims INTEGER,
        community_claims INTEGER,
        individual_titles INTEGER,
        community_titles INTEGER
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        claim_id TEXT UNIQUE,
        claimant_name TEXT,
        village TEXT,
        district TEXT,
        state TEXT,
        area_acres REAL,
        claim_type TEXT,
        filing_date TEXT,
        status TEXT,
        approval_date TEXT,
        forest_type TEXT,
        rejection_reason TEXT,
        anomaly_flag TEXT
    )''')

    c.execute("SELECT COUNT(*) FROM state_stats")
    if c.fetchone()[0] == 0:
        for s in STATE_DATA:
            c.execute('''INSERT INTO state_stats (state, claims_received, titles_distributed, rejected, pending,
                individual_claims, community_claims, individual_titles, community_titles)
                VALUES (?,?,?,?,?,?,?,?,?)''',
                (s["state"], s["claims_received"], s["titles_distributed"], s["rejected"], s["pending"],
                 s["individual_claims"], s["community_claims"], s["individual_titles"], s["community_titles"]))

    c.execute("SELECT COUNT(*) FROM claims")
    if c.fetchone()[0] == 0:
        for cl in SAMPLE_CLAIMS:
            c.execute('''INSERT INTO claims (claim_id, claimant_name, village, district, state, area_acres,
                claim_type, filing_date, status, approval_date, forest_type, rejection_reason, anomaly_flag)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)''',
                (cl["claim_id"], cl["claimant_name"], cl["village"], cl["district"], cl["state"], cl["area_acres"],
                 cl["claim_type"], cl["filing_date"], cl["status"], cl.get("approval_date"), cl["forest_type"],
                 cl.get("rejection_reason"), cl.get("anomaly_flag")))

    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

if __name__ == "__main__":
    init_db()
    print("Database initialized at", DB_PATH)
