# FRA Atlas — AI-Powered Forest Rights Act WebGIS Platform

## One-Line Pitch
> "FRA Atlas is an AI-powered, blockchain-secured, WebGIS platform that helps 2 crore tribal people track their forest rights claims, detect fraud, and access government welfare — built entirely with free tools."

---

## Problem Statement

The **Forest Rights Act (2006)** gives tribal communities legal rights to forest land. But after **18+ years**:

- **40+ lakh claims** filed across India
- Only **~20 lakh resolved**
- **20 lakh+ claims rejected or pending**
- **No centralized digital tracking** exists
- Government has **no real-time view** of FRA implementation
- Tribal people **don't know why** their claims are rejected

Ministry of Tribal Affairs specifically asked for this in **SIH 2025 (PS SIH12508)**.

---

## Who Benefits

| Stakeholder | How They Benefit |
|-------------|-----------------|
| **Tribal Communities** (~2 crore people) | Track claim status, understand rejections, access welfare schemes |
| **Gram Sabhas** (~2.5 lakh councils) | Village-level claim tracking, prioritize follow-ups |
| **Government Officials** | District heatmaps, fraud detection, performance metrics |
| **NGOs & Activists** | Data for advocacy, proof of government failures |
| **Researchers** | Centralized data for analysis, policy recommendations |

---

## SDG Alignment

| SDG | Goal | Connection |
|-----|------|------------|
| **SDG 1** | No Poverty | FRA gives land rights → income security |
| **SDG 10** | Reduced Inequalities | Addresses 180 years of historical injustice |
| **SDG 15** | Life on Land | Tribal communities are best forest protectors |
| **SDG 16** | Peace, Justice & Strong Institutions | Transparent, trackable governance |

---

## Features (8 Core Features)

### 1. Real-Time Data Scraping
- Scrape live FRA data from `forestrights.nic.in` and `data.gov.in`
- State-wise and district-wise claim statistics
- Year-wise trends
- **Tools:** Python requests + BeautifulSoup

### 2. Interactive India Map
- Click any district → see FRA statistics popup
- Heatmap layer (claim density)
- Rejection rate overlay
- Pending claims overlay
- **Tools:** MapLibre GL JS + GeoJSON

### 3. Working OCR Demo
- Upload scanned FRA claim form → extract data automatically
- Extract: claimant name, village, district, land area, claim type, date
- **Tools:** PaddleOCR (Python)

### 4. AI Anomaly Detection
- Detect suspicious patterns in FRA data
- Bulk approval fraud (approved >80% in <7 days)
- Geographic mismatch (claimed land outside forest)
- Duplicate claims (same person, multiple districts)
- **Tools:** Scikit-learn (Isolation Forest)

### 5. Blockchain Title Deeds
- Generate tamper-proof digital FRA titles
- Hash the document → store on chain
- Any tampering → hash mismatch → invalid
- **Tools:** Python hashlib (no crypto wallet needed)

### 6. Voice Interface in Tribal Languages
- Speak in Hindi/Gondi/Bhili → system responds
- "मेरा दावा का स्थिति क्या है?" → "आपका दावा मंजूर हो गया है"
- **Tools:** Web Speech API (browser) + Bhashini API

### 7. Satellite Forest Cover Overlay
- Show actual forest cover vs claimed land
- Forest Survey of India data
- NDVI vegetation index
- **Tools:** Sentinel-2 data / pre-computed FSI data

### 8. Beneficiary Scheme Matcher
- After FRA approval → auto-match to government schemes
- PM-KISAN, PMAY, MGNREGA, KCC eligibility
- **Tools:** Rule-based matching engine

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│  Next.js + React + Tailwind + MapLibre          │
│  ├── / (Dashboard)                              │
│  ├── /map (Interactive India Map)               │
│  ├── /ocr (Upload & Scan FRA Documents)         │
│  ├── /anomaly (AI Fraud Detection)              │
│  ├── /blockchain (Title Deed Verification)      │
│  └── /api-docs (API Documentation)              │
└──────────────────┬──────────────────────────────┘
                   │ API calls
┌──────────────────▼──────────────────────────────┐
│                   BACKEND                       │
│  FastAPI (Python)                               │
│  ├── /api/scrape (Real-time data scraping)      │
│  ├── /api/ocr (PaddleOCR processing)            │
│  ├── /api/anomaly (AI anomaly detection)        │
│  ├── /api/blockchain (Title deed hashing)       │
│  ├── /api/voice (Tribal language voice)         │
│  └── /api/satellite (Forest cover data)         │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│                   DATA LAYER                     │
│  ├── SQLite (local dev) / PostgreSQL (prod)      │
│  ├── forestrights.nic.in (scraped data)          │
│  ├── data.gov.in (FRA statistics)                │
│  ├── Sentinel-2 (satellite imagery)              │
│  └── Government FRA documents (OCR testing)      │
└─────────────────────────────────────────────────┘
```

---

## Tech Stack (All Free)

| Component | Tool | Cost | License |
|-----------|------|------|---------|
| Frontend | Next.js + React | FREE | MIT |
| Styling | Tailwind CSS | FREE | MIT |
| Map | MapLibre GL JS | FREE | BSD-3-Clause |
| Map Tiles | OpenStreetMap | FREE | ODbL |
| Backend | FastAPI (Python) | FREE | MIT |
| OCR | PaddleOCR | FREE | Apache 2.0 |
| AI/ML | Scikit-learn | FREE | BSD |
| NLP | SpaCy | FREE | MIT |
| Blockchain | Python hashlib | FREE | Built-in |
| Voice | Web Speech API | FREE | Browser API |
| Database | SQLite | FREE | Public Domain |
| Hosting (Frontend) | Vercel | FREE | 100GB/month |
| Hosting (Backend) | Railway | FREE | Free tier |
| **TOTAL** | | **₹0** | |

---

## 36-Hour Build Timeline

| Hour | Task | Deliverable |
|------|------|-------------|
| **0-4** | Project setup | Next.js + FastAPI + MapLibre running |
| **4-8** | Data scraping | FRA data in SQLite from forestrights.nic.in |
| **8-14** | Interactive map | India map with district click → stats popup |
| **14-18** | OCR integration | Upload FRA doc → extract text → show results |
| **18-22** | AI anomaly detection | Red flags on dashboard for suspicious patterns |
| **22-26** | Blockchain title deeds | Generate title → hash → verify |
| **26-30** | Voice interface | Hindi voice query → response |
| **30-33** | Satellite overlay | Forest cover layer on map |
| **33-35** | Polish & deploy | Vercel deployment, responsive design |
| **35-36** | Practice demo | Run through 2-min presentation |

---

## Project Structure

```
fra-atlas/
├── frontend/
│   ├── app/
│   │   ├── page.tsx (Dashboard)
│   │   ├── map/page.tsx (Interactive Map)
│   │   ├── ocr/page.tsx (OCR Demo)
│   │   ├── anomaly/page.tsx (AI Detection)
│   │   ├── blockchain/page.tsx (Title Deeds)
│   │   └── api-docs/page.tsx (API Docs)
│   ├── components/
│   │   ├── Map.tsx
│   │   ├── DistrictPopup.tsx
│   │   ├── OCRUploader.tsx
│   │   ├── AnomalyCard.tsx
│   │   ├── TitleDeed.tsx
│   │   └── VoiceButton.tsx
│   ├── public/
│   │   └── india-districts.geojson
│   └── package.json
├── backend/
│   ├── main.py (FastAPI app)
│   ├── scraper.py (FRA data scraper)
│   ├── ocr_engine.py (PaddleOCR)
│   ├── anomaly_detector.py (Scikit-learn)
│   ├── blockchain.py (Hash chain)
│   └── voice.py (Speech processing)
├── data/
│   ├── fra_claims.json (scraped data)
│   └── sample_documents/ (test OCR images)
├── docs/
│   └── API.md
└── fra-atlas-plan.md (this file)
```

---

## AI Anomaly Detection — Detailed

### Anomalies to Detect

| Anomaly | Detection Method | Flag |
|---------|-----------------|------|
| **Bulk approval fraud** | Approved >80% claims in <7 days | RED |
| **Geographic mismatch** | Claimed land outside forest boundary | RED |
| **Duplicate claims** | Same person filing in multiple districts | ORANGE |
| **Impossible timelines** | Claim approved before filing date | RED |
| **Revenue anomaly** | Approval rate spike near election dates | ORANGE |
| **Weekend processing** | Claims approved on government holidays | YELLOW |

### Algorithm
```python
# Isolation Forest for anomaly detection
from sklearn.ensemble import IsolationForest

# Features: approval_rate, processing_time, district_area, claim_count
model = IsolationForest(contamination=0.1)
anomalies = model.fit_predict(features)
```

---

## Blockchain Title Deeds — How It Works

### Simple Hash Chain (No Crypto Wallet Needed)

```python
import hashlib
import json
from datetime import datetime

class FRATitleDeed:
    def __init__(self, claim_id, claimant_name, village, district, area_acres):
        self.claim_id = claim_id
        self.claimant_name = claimant_name
        self.village = village
        self.district = district
        self.area_acres = area_acres
        self.approval_date = datetime.now().isoformat()
        self.previous_hash = "0" * 64  # Genesis hash
    
    def calculate_hash(self):
        title_data = json.dumps({
            "claim_id": self.claim_id,
            "claimant_name": self.claimant_name,
            "village": self.village,
            "district": self.district,
            "area_acres": self.area_acres,
            "approval_date": self.approval_date,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(title_data.encode()).hexdigest()
    
    def verify_integrity(self, stored_hash):
        return self.calculate_hash() == stored_hash
```

---

## Voice Interface — Tribal Languages

### Supported Languages

| Language | Code | Speakers |
|----------|------|----------|
| Hindi | hi | 600M+ |
| Gondi | gon | 2M+ |
| Bhili | bhb | 5M+ |
| Santhali | sat | 7M+ |
| Odia | od | 35M+ |

### Implementation
- **Web Speech API** (browser-based, works offline in Chrome)
- **Bhashini API** (government API, free for developers)
- Simple keyword matching for claim status queries

---

## Satellite Forest Cover

### Data Sources (Free)

| Source | Coverage | Access |
|--------|----------|--------|
| **Forest Survey of India** | India-wide | Free reports |
| **Sentinel-2** | Global, 10m resolution | Free via Copernicus |
| **Google Earth Engine** | Global | Free for research |
| **Bhuvan (ISRO)** | India | Free API |

### Implementation
- Pre-computed NDVI data from FSI reports
- Map overlay showing forest cover change
- Highlight areas where FRA claims overlap with deforestation

---

## Evaluation Rubric Scores (Target)

| Criteria | Max | Target | How to Achieve |
|----------|-----|--------|----------------|
| Content Delivery | 20 | 18 | Crisp 2-min demo, story-driven |
| Innovation & Creativity | 20 | 17 | AI anomaly + blockchain + voice = unique combo |
| Problem Relevance (SIH Theme) | 10 | 9 | Fits Smart Automation + Clean & Green |
| Feasibility | 10 | 9 | All free tools, 36 hours |
| Technical Execution | 10 | 9 | Working OCR + live map + AI detection |
| Presentation & Communication | 10 | 9 | Practice demo, impact numbers |
| Teamwork & Collaboration | 10 | 9 | Clear role division |
| SDG Impact | 10 | 9 | SDG 10 + 15 + 16 |
| **TOTAL** | **100** | **89** | **Winning score** |

---

## 2-Minute Demo Script

```
[0:00] "Forest Rights Act gives tribal people legal rights to forest land."
[0:15] "But 40 lakh claims filed. 20 lakh rejected. No one knows why."
[0:30] [SHOW MAP] "Here's India. Click any district..."
[0:40] [CLICK MP] "Madhya Pradesh — 4.5 lakh claims, 47% rejected"
[0:55] [UPLOAD DOC] "Let's upload a scanned claim form..."
[1:05] [OCR RUNS] "System extracted: Ramiah, village Turgam, 2.3 acres"
[1:15] [AI ANALYSIS] "AI says: rejection pattern matches documentation gap"
[1:25] [BLOCKCHAIN] "Here's a blockchain-secured title deed..."
[1:35] [VOICE] "Let's ask in Hindi..."
[1:45] [SCHEME MATCH] "After FRA approval, Ramiah qualifies for PM-KISAN + PMAY"
[1:55] "All built with free tools. Zero cost. For 2 crore tribal people."
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| FRA website blocks scraping | Use cached data + data.gov.in CSV |
| PaddleOCR slow on CPU | Pre-process demo images, show results instantly |
| Satellite API rate limits | Use pre-computed FSI forest cover data |
| Voice API not working | Web Speech API works offline in Chrome |
| Vercel deployment fails | Use localhost for demo |
| No real FRA documents for OCR | Create realistic mockup documents |

---

## Presentation Slide Order

1. **Title** — FRA Atlas: AI-Powered Forest Rights Platform
2. **Problem** — "40 lakh claims, 20 lakh rejected, no one knows why"
3. **Impact** — "2 crore tribal people affected"
4. **Solution** — 8 features overview
5. **Live Demo** — Map → OCR → AI → Blockchain → Voice
6. **Architecture** — Tech stack diagram
7. **SDG Alignment** — SDG 10 + 15 + 16
8. **Cost** — "₹0. All free tools."
9. **Impact Numbers** — Tribal population, claims data
10. **Team** — Who built what

---

## SIH Theme Mapping

| SIH Theme | How FRA Atlas Fits |
|-----------|-------------------|
| Smart Automation | AI-powered OCR, claim analysis, anomaly detection |
| Clean & Green Technology | Sustainable forest management by tribal communities |
| Smart Cities & Urban Governance | Governance tool for tribal areas |
| Blockchain & Cybersecurity | Blockchain-secured title deeds |
| Miscellaneous | Social justice tool |

---

## One-Line Impact Statement

> "This project helps 2 crore tribal people access their legal rights to forest land by making FRA implementation transparent, trackable, and data-driven — aligned with SDG 10 (Reduced Inequalities) and SDG 15 (Life on Land)."

---

## Ready to Build

This plan is complete. All tools are free. All data is available. The problem is real. The impact is massive.

**Total Cost: ₹0**
**Build Time: 36 hours**
**Target Score: 89/100**

Let's build.
