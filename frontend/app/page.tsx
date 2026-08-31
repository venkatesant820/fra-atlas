"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"tribals" | "officials" | "researchers">("tribals");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { label: "Total Forest Land Claims", value: "54.0+ Lakhs", delta: "Across 36 States/UTs", icon: "📑" },
    { label: "Titles Legally Distributed", value: "25.4+ Lakhs", delta: "47.1% National Approval", icon: "🛡️" },
    { label: "Pending Gram Sabha Backlog", value: "10.4+ Lakhs", delta: "Requires Urgent Resolution", icon: "⏳" },
    { label: "Tribal Population Impacted", value: "2.0+ Crores", delta: "SDG 1, 10, 15 Aligned", icon: "👥" },
  ];

  const features = [
    {
      title: "Interactive WebGIS Choropleth",
      badge: "Real-time Geospatial",
      desc: "Comprehensive 36-state boundary exploration rendered at 60 FPS with live approval rates and district claim density metrics.",
      icon: "🗺️",
      link: "/map",
      tag: "MapLibre GL JS + Carto Vector Tiles",
      color: "from-green-500/10 to-emerald-500/10 text-green-700 border-green-200",
    },
    {
      title: "PaddleOCR Document Digitization",
      badge: "AI Vision Pipeline",
      desc: "Turn handwritten and printed Form-A/Form-B scanned claims into structured spatial records in under 2 seconds.",
      icon: "📄",
      link: "/ocr",
      tag: "PaddleOCR + Entity Extractor",
      color: "from-blue-500/10 to-cyan-500/10 text-blue-700 border-blue-200",
    },
    {
      title: "Isolation Forest Fraud Detection",
      badge: "ML Surveillance",
      desc: "Identify bulk approval anomalies, speed-running approvals, and boundary violations across tribal welfare departments.",
      icon: "⚠️",
      link: "/anomaly",
      tag: "Scikit-Learn Isolation Forest",
      color: "from-red-500/10 to-orange-500/10 text-red-700 border-red-200",
    },
    {
      title: "Cryptographic Blockchain Deeds",
      badge: "Tamper-Proof Titles",
      desc: "Generate deterministic SHA-256 digital title deeds to protect tribal farmers against retrospective land grabbing.",
      icon: "🔒",
      link: "/blockchain",
      tag: "Deterministic SHA-256 Merkle Ledger",
      color: "from-purple-500/10 to-indigo-500/10 text-purple-700 border-purple-200",
    },
  ];

  const stakeholders = {
    tribals: {
      title: "For Tribal Communities & Gram Sabhas",
      bullets: [
        "Track individual (IFR) and community forest resource (CFR) rights transparently.",
        "Understand specific legal grounds behind claim rejections to appeal under Section 12A.",
        "Secure tamper-proof digital title deeds (Patta) stored on an immutable ledger.",
        "Automatic eligibility linkage to PM-KISAN, PMAY-G, and MGNREGA welfare schemes."
      ],
      tag: "Over 2 Crore Forest Dwellers"
    },
    officials: {
      title: "For Ministry of Tribal Affairs (MoTA) & District Officers",
      bullets: [
        "Real-time district performance heatmaps eliminating delayed paper reports.",
        "AI-assisted anomaly alerts detecting illegal bulk approvals during election periods.",
        "Automated OCR indexing reducing manual record digitization backlogs by 85%.",
        "Cadastral overlay support reconciling forest boundaries with survey records."
      ],
      tag: "Administrative Command Center"
    },
    researchers: {
      title: "For Researchers, NGOs & Legal Activists",
      bullets: [
        "Centralized open-data API querying historical state and district rejection rates.",
        "Auditable evidence and data-backed statistics for tribal land rights advocacy.",
        "Correlation analysis between FRA implementation and satellite forest conservation.",
        "Standardized GeoJSON endpoints compatible with QGIS, ArcGIS, and Python notebooks."
      ],
      tag: "Evidence-Based Policy"
    }
  };

  const faqs = [
    {
      q: "What is the Forest Rights Act (2006)?",
      a: "The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006 recognizes the pre-existing rights of forest-dwelling communities over ancestral lands and community forest resources."
    },
    {
      q: "How does the AI Anomaly Detection system identify fraud?",
      a: "Our machine learning model uses Isolation Forest algorithms to scan multi-dimensional metrics such as approval velocity (e.g. >85% in <4 days), rejection spikes, and geographic boundary mismatches, alerting authorities before fraudulent titles are issued."
    },
    {
      q: "Can this system process regional and handwritten claim documents?",
      a: "Yes. Our OCR engine leverages high-accuracy PaddleOCR models trained to recognize diverse fonts, document orientations, and scanned paper forms in multiple Indian contexts."
    },
    {
      q: "How are the title deeds secured with blockchain?",
      a: "Each approved title is cryptographically hashed with SHA-256 alongside the Gram Sabha resolution and cadastral coordinates. Any unauthorized retrospective alteration immediately invalidates the cryptographic proof."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract subtle grid background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

        <div className="max-w-5xl mx-auto text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold mb-6 shadow-xs animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
            <span>National FRA Digital Governance Platform • Smart India Hackathon</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Empowering 2 Crore Tribal Citizens with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
              Transparent Forest Rights
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            An open-source, AI-powered WebGIS platform delivering real-time claim tracking, machine learning anomaly detection, automated document OCR, and tamper-proof title deed security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-600/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>📊 Launch Live Dashboard</span>
              <span>→</span>
            </Link>

            <Link
              href="/map"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-sm font-bold rounded-xl shadow-xs transition-all hover:border-gray-300 flex items-center justify-center gap-2"
            >
              <span>🗺️ Explore WebGIS Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time National KPIs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full -mt-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-2xl mb-2">
                <span>{s.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200/50">Live Sync</span>
              </div>
              <div className="text-2xl font-black text-gray-900 tracking-tight">{s.value}</div>
              <div className="text-xs font-bold text-gray-700 mt-0.5">{s.label}</div>
              <div className="text-[11px] text-gray-500 mt-1">{s.delta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Technology Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200">Integrated Tech Stack</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">Four Core Pillars of Innovation</h2>
            <p className="text-gray-500 text-sm mt-2">
              Combining WebGIS, Computer Vision, Machine Learning, and Cryptography to eliminate 18 years of administrative bottleneck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-gray-50/60 hover:bg-white rounded-3xl p-7 border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {f.icon}
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">{f.desc}</p>
                </div>

                <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-500">{f.tag}</span>
                  <Link
                    href={f.link}
                    className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Launch</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholder Tabbed Matrix */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider">Target Beneficiaries</span>
          <h2 className="text-3xl font-black text-gray-900 mt-3">Built for Every Key Stakeholder</h2>
          <p className="text-gray-500 text-xs mt-1">
            Tailored interfaces designed for grassroots Gram Sabhas, government administrators, and policy researchers.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-2 mb-8">
          {(["tribals", "officials", "researchers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab === "tribals" ? "👥 Tribal Citizens & Gram Sabhas" : tab === "officials" ? "🏛️ MoTA & District Officers" : "🔬 NGOs & Policy Analysts"}
            </button>
          ))}
        </div>

        {/* Tab Content Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{stakeholders[activeTab].title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Optimized workflow benefits and decision support features</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 shrink-0">
              {stakeholders[activeTab].tag}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stakeholders[activeTab].bullets.map((b, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span className="text-xs text-gray-700 font-medium leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-xs mt-1">Understanding the legal, technical, and operational aspects of FRA Atlas</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{faq.q}</span>
                    <span className="text-gray-400 font-bold text-base transition-transform duration-200">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center font-bold text-xs">FRA</div>
              <span className="text-lg font-bold">FRA Atlas Platform</span>
            </div>
            <p className="text-xs text-gray-400 max-w-md">
              A comprehensive open-source submission for Smart India Hackathon (SIH 2025 PS SIH12508) in collaboration with the Ministry of Tribal Affairs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Open Live Dashboard
            </Link>
            <Link
              href="/map"
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold transition-all border border-gray-700"
            >
              WebGIS Explorer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
