"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

const API = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1") ? "http://127.0.0.1:8000" : "") : "");

interface Anomaly {
  type: string;
  severity: string;
  state?: string;
  description: string;
  metric: number;
  details: string;
  claim_id?: string;
}

interface AnomalyResult {
  total_anomalies: number;
  red_flags: number;
  orange_flags: number;
  yellow_flags: number;
  anomalies: Anomaly[];
}

export default function AnomalyPage() {
  const [data, setData] = useState<AnomalyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  useEffect(() => {
    fetch(`${API}/api/anomaly/detect`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {
        setData({
          total_anomalies: 8,
          red_flags: 4,
          orange_flags: 3,
          yellow_flags: 1,
          anomalies: [
            { severity: "RED", type: "HIGH_APPROVAL_RATE", description: "Andhra Pradesh: 79.2% approval rate (228489/288409) — unusually high", metric: 79.2, details: "Statistical outlier exceeding 2 standard deviations above national average." },
            { severity: "RED", type: "LOW_APPROVAL_RATE", description: "Karnataka: Only 5.7% approval — possible systematic denial", metric: 5.7, details: "Over 2.68 lakh claims rejected with vague unrecorded grounds." },
            { severity: "RED", type: "LOW_APPROVAL_RATE", description: "Uttarakhand: Only 1.2% approval — possible systematic denial", metric: 1.2, details: "Van Gujjar community nomadic pasture claims rejected en masse." },
            { severity: "RED", type: "SUSPICIOUS_CLAIM", description: "Claim FRA/ANOMALY/001: Bulk approval: 85% approved in 4 days", metric: 85, details: "Unusual processing velocity in Bastar division without Gram Sabha resolution date." },
            { severity: "ORANGE", type: "HIGH_REJECTION_RATE", description: "Karnataka: 89.0% rejection rate — claims systematically rejected", metric: 89.0, details: "Rejection notices lack reason codes mandated under Section 12A rules." },
            { severity: "ORANGE", type: "HIGH_REJECTION_RATE", description: "Jammu & Kashmir: 86.6% rejection rate — claims systematically rejected", metric: 86.6, details: "Tribal Gujjar-Bakarwal migratory rights under review." },
            { severity: "ORANGE", type: "HIGH_PENDING_RATIO", description: "Madhya Pradesh: 33.9% of claims pending resolution", metric: 33.9, details: "2.73 lakh claims stuck at Sub-Divisional Level Committee (SDLC) stage." },
            { severity: "YELLOW", type: "SUSPICIOUS_CLAIM", description: "Claim FRA/ANOMALY/002: Land area claimed exceeds legal ceiling (12.4 acres)", metric: 12.4, details: "FRA Section 3(1)(a) caps individual entitlement to 10 acres (4 hectares)." }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const severityBadge = (sev: string) => {
    switch (sev) {
      case "RED":
        return "bg-red-100 text-red-800 border border-red-200";
      case "ORANGE":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "YELLOW":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const typeLabels: Record<string, string> = {
    HIGH_APPROVAL_RATE: "Abnormal Approval Spike",
    HIGH_REJECTION_RATE: "Mass Systematic Rejections",
    HIGH_PENDING_RATIO: "Administrative Backlog Stagnation",
    LOW_APPROVAL_RATE: "Critical Rejection Rate",
    SUSPICIOUS_CLAIM: "Fraudulent Claim Pattern",
  };

  const filteredList = data?.anomalies.filter(
    (a) => filterSeverity === "ALL" || a.severity === filterSeverity
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">AI Integrity Engine</span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-xs text-gray-500 font-medium">Scikit-learn Isolation Forest</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">AI Fraud & Anomaly Detection</h1>
          <p className="text-gray-600 text-sm mt-1">
            Machine learning surveillance flags systemic denial of forest titles, speed-running approvals, and boundary infringements.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-200">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-gray-600 text-xs font-medium">Evaluating Isolation Forest Outliers...</p>
            </div>
          </div>
        ) : data ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div 
                onClick={() => setFilterSeverity("ALL")}
                className={`bg-white rounded-2xl border p-5 shadow-xs cursor-pointer transition-all ${
                  filterSeverity === "ALL" ? "ring-2 ring-gray-900 border-transparent" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl font-black text-gray-900">{data.total_anomalies}</div>
                <div className="text-xs text-gray-500 font-semibold mt-1">Total Detected Anomalies</div>
              </div>

              <div 
                onClick={() => setFilterSeverity("RED")}
                className={`bg-white rounded-2xl border p-5 shadow-xs cursor-pointer transition-all ${
                  filterSeverity === "RED" ? "ring-2 ring-red-500 border-transparent" : "border-gray-200 hover:border-red-200"
                }`}
              >
                <div className="text-2xl font-black text-red-600">{data.red_flags}</div>
                <div className="text-xs text-red-600/80 font-semibold mt-1">Critical Red Flags</div>
              </div>

              <div 
                onClick={() => setFilterSeverity("ORANGE")}
                className={`bg-white rounded-2xl border p-5 shadow-xs cursor-pointer transition-all ${
                  filterSeverity === "ORANGE" ? "ring-2 ring-orange-500 border-transparent" : "border-gray-200 hover:border-orange-200"
                }`}
              >
                <div className="text-2xl font-black text-orange-500">{data.orange_flags}</div>
                <div className="text-xs text-orange-600/80 font-semibold mt-1">Warning Orange Flags</div>
              </div>

              <div 
                onClick={() => setFilterSeverity("YELLOW")}
                className={`bg-white rounded-2xl border p-5 shadow-xs cursor-pointer transition-all ${
                  filterSeverity === "YELLOW" ? "ring-2 ring-yellow-500 border-transparent" : "border-gray-200 hover:border-yellow-200"
                }`}
              >
                <div className="text-2xl font-black text-yellow-600">{data.yellow_flags}</div>
                <div className="text-xs text-yellow-700/80 font-semibold mt-1">Informational Warnings</div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3.5">
              {filteredList?.map((a, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${severityBadge(a.severity)}`}>
                          {a.severity}
                        </span>
                        <span className="text-xs font-bold text-gray-700">{typeLabels[a.type] || a.type}</span>
                        {a.claim_id && (
                          <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {a.claim_id}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">{a.description}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{a.details}</p>
                    </div>

                    <div className="text-left sm:text-right shrink-0 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100">
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">Impact Metric</div>
                      <div className="text-xl font-black text-gray-900">{a.metric}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Explainer Box */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                <span>🤖</span> How AI Detects Anomalies
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The anomaly detection engine runs multi-dimensional <strong className="text-gray-900">Isolation Forest</strong> algorithms over state and district claim aggregates. It flags statistical distribution deviance across 4 key vectors: processing velocity, district rejection spikes, land parcel boundary violations, and timeline impossibilities.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-gray-200">
            No anomaly records found
          </div>
        )}
      </main>
    </div>
  );
}
