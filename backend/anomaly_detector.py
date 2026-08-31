import sqlite3
from database import get_db

def detect_anomalies():
    conn = get_db()
    stats = conn.execute("SELECT * FROM state_stats").fetchall()
    claims = conn.execute("SELECT * FROM claims").fetchall()
    conn.close()

    anomalies = []

    for row in stats:
        state = row["state"]
        received = row["claims_received"]
        distributed = row["titles_distributed"]
        rejected = row["rejected"]
        pending = row["pending"]

        if received == 0:
            continue

        approval_rate = (distributed / received) * 100
        rejection_rate = (rejected / received) * 100

        if approval_rate > 75 and received > 50000:
            anomalies.append({
                "type": "HIGH_APPROVAL_RATE",
                "severity": "RED",
                "state": state,
                "description": f"{state}: {approval_rate:.1f}% approval rate ({distributed}/{received}) — unusually high",
                "metric": round(approval_rate, 1),
                "details": f"Claims received: {received:,}, Titles distributed: {distributed:,}"
            })

        if rejection_rate > 80 and received > 10000:
            anomalies.append({
                "type": "HIGH_REJECTION_RATE",
                "severity": "ORANGE",
                "state": state,
                "description": f"{state}: {rejection_rate:.1f}% rejection rate — claims systematically rejected",
                "metric": round(rejection_rate, 1),
                "details": f"Claims received: {received:,}, Rejected: {rejected:,}"
            })

        if pending > received * 0.5 and received > 5000:
            anomalies.append({
                "type": "HIGH_PENDING_RATIO",
                "severity": "YELLOW",
                "state": state,
                "description": f"{state}: {pending:,} claims pending ({(pending/received)*100:.1f}%) — severe backlog",
                "metric": round((pending / received) * 100, 1),
                "details": f"Claims received: {received:,}, Pending: {pending:,}"
            })

        if approval_rate < 10 and received > 5000:
            anomalies.append({
                "type": "LOW_APPROVAL_RATE",
                "severity": "RED",
                "state": state,
                "description": f"{state}: Only {approval_rate:.1f}% approval — possible systematic denial",
                "metric": round(approval_rate, 1),
                "details": f"Claims received: {received:,}, Titles distributed: {distributed:,}"
            })

    for row in claims:
        if row["anomaly_flag"]:
            anomalies.append({
                "type": "SUSPICIOUS_CLAIM",
                "severity": "RED",
                "state": row["state"],
                "claim_id": row["claim_id"],
                "description": f"Claim {row['claim_id']}: {row['anomaly_flag']}",
                "metric": 0,
                "details": f"Claimant: {row['claimant_name']}, Village: {row['village']}, District: {row['district']}"
            })

    anomalies.sort(key=lambda x: {"RED": 0, "ORANGE": 1, "YELLOW": 2}.get(x["severity"], 3))

    return {
        "total_anomalies": len(anomalies),
        "red_flags": len([a for a in anomalies if a["severity"] == "RED"]),
        "orange_flags": len([a for a in anomalies if a["severity"] == "ORANGE"]),
        "yellow_flags": len([a for a in anomalies if a["severity"] == "YELLOW"]),
        "anomalies": anomalies
    }
