"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import Navbar from "@/components/Navbar";

const API = typeof window !== "undefined" ? (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1") ? "http://127.0.0.1:8000" : "") : "";

interface StateData {
  state: string;
  claims_received: number;
  titles_distributed: number;
  rejected: number;
  pending: number;
  individual_claims: number;
  community_claims: number;
}

const GEO_NAME_MAP: Record<string, string> = {
  "Jammu and Kashmir": "Jammu & Kashmir",
  "Orissa": "Odisha",
  "Uttaranchal": "Uttarakhand",
  "Dadra and Nagar Haveli and Daman and Diu": "Gujarat",
  "NCT of Delhi": "Uttar Pradesh",
  "Pondicherry": "Tamil Nadu",
};

function resolveState(geoName: string, stateMap: Map<string, StateData>): StateData | undefined {
  if (stateMap.has(geoName)) return stateMap.get(geoName);
  const mapped = GEO_NAME_MAP[geoName];
  if (mapped && stateMap.has(mapped)) return stateMap.get(mapped);
  for (const [key, val] of stateMap) {
    if (geoName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(geoName.toLowerCase())) {
      return val;
    }
  }
  return undefined;
}

function rateColorLight(rate: number): string {
  if (rate > 70) return "#16a34a"; // Green 600
  if (rate > 50) return "#84cc16"; // Lime 500
  if (rate > 35) return "#eab308"; // Yellow 500
  if (rate > 20) return "#f97316"; // Orange 500
  return "#ef4444"; // Red 500
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selected, setSelected] = useState<StateData | null>(null);
  const [states, setStates] = useState<StateData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/states`)
      .then((r) => r.json())
      .then(setStates)
      .catch(() => {
        // Fallback demo data
        setStates([
          { state: 'Chhattisgarh', claims_received: 947479, titles_distributed: 534068, rejected: 406787, pending: 6624, individual_claims: 900000, community_claims: 47479 },
          { state: 'Madhya Pradesh', claims_received: 807405, titles_distributed: 289461, rejected: 244487, pending: 273457, individual_claims: 750000, community_claims: 57405 },
          { state: 'Odisha', claims_received: 760077, titles_distributed: 478906, rejected: 140686, pending: 140485, individual_claims: 720000, community_claims: 40077 },
          { state: 'Maharashtra', claims_received: 412497, titles_distributed: 228965, rejected: 161821, pending: 21711, individual_claims: 390000, community_claims: 22497 },
          { state: 'Tripura', claims_received: 200544, titles_distributed: 130310, rejected: 67362, pending: 2872, individual_claims: 190000, community_claims: 10544 },
          { state: 'Gujarat', claims_received: 190618, titles_distributed: 104273, rejected: 67595, pending: 18750, individual_claims: 180000, community_claims: 10618 },
          { state: 'Rajasthan', claims_received: 114561, titles_distributed: 54133, rejected: 59714, pending: 714, individual_claims: 110000, community_claims: 4561 },
          { state: 'Jharkhand', claims_received: 110899, titles_distributed: 61964, rejected: 28107, pending: 20828, individual_claims: 100000, community_claims: 10899 },
          { state: 'Karnataka', claims_received: 294317, titles_distributed: 16892, rejected: 268487, pending: 8938, individual_claims: 280000, community_claims: 14317 },
          { state: 'Uttarakhand', claims_received: 6694, titles_distributed: 81, rejected: 6603, pending: 10, individual_claims: 6000, community_claims: 694 },
          { state: 'Kerala', claims_received: 46765, titles_distributed: 27364, rejected: 18512, pending: 889, individual_claims: 45000, community_claims: 1765 },
          { state: 'West Bengal', claims_received: 142416, titles_distributed: 48512, rejected: 89204, pending: 4700, individual_claims: 135000, community_claims: 7416 },
          { state: 'Andhra Pradesh', claims_received: 288409, titles_distributed: 228489, rejected: 58395, pending: 1525, individual_claims: 285115, community_claims: 3294 }
        ]);
      });
  }, []);

  const buildMap = useCallback(() => {
    if (!mapContainer.current || mapRef.current || states.length === 0) return;

    const stateMap = new Map<string, StateData>();
    states.forEach((s) => stateMap.set(s.state, s));

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution: '&copy; CARTO',
          },
        },
        layers: [
          {
            id: "carto-base",
            type: "raster",
            source: "carto",
            paint: { "raster-opacity": 1.0 },
          },
        ],
      },
      center: [80.5, 22.5],
      zoom: 3.8,
      minZoom: 3,
      maxZoom: 7,
      maxBounds: [68.1, 6.7, 97.4, 35.5],
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      fetch("/india-states.geojson").then((r) => r.json()).then((geojson) => {
        geojson.features.forEach((f: any, index: number) => {
          f.id = index;
        });

        map.addSource("india-states", { type: "geojson", data: geojson });

        map.addLayer({
          id: "state-fill",
          type: "fill",
          source: "india-states",
          paint: {
            "fill-color": [
              "case",
              ["!=", ["feature-state", "color"], null],
              ["feature-state", "color"],
              "#e2e8f0"
            ],
            "fill-opacity": 0.85,
          },
        });

        map.addLayer({
          id: "state-outline",
          type: "line",
          source: "india-states",
          paint: {
            "line-color": "#ffffff",
            "line-width": 1.2,
          },
        });

        map.addLayer({
          id: "state-hover-fill",
          type: "fill",
          source: "india-states",
          paint: {
            "fill-color": "#0f172a",
            "fill-opacity": 0.15,
          },
          filter: ["==", "NAME_1", ""],
        });

        map.addLayer({
          id: "state-hover-outline",
          type: "line",
          source: "india-states",
          paint: {
            "line-color": "#0f172a",
            "line-width": 2.5,
          },
          filter: ["==", "NAME_1", ""],
        });

        // Apply Feature State colors
        geojson.features.forEach((f: any, index: number) => {
          const sd = resolveState(f.properties.NAME_1, stateMap);
          if (sd) {
            const color = rateColorLight((sd.titles_distributed / sd.claims_received) * 100);
            map.setFeatureState(
              { source: "india-states", id: index },
              { color: color }
            );
          }
        });

        const hoverLayer = "state-hover-fill";
        const hoverOutline = "state-hover-outline";

        map.on("mousemove", "state-fill", (e) => {
          if (!e.features?.length) return;
          const name = e.features[0].properties?.NAME_1;
          map.setFilter(hoverLayer, ["==", "NAME_1", name]);
          map.setFilter(hoverOutline, ["==", "NAME_1", name]);
          map.getCanvas().style.cursor = "pointer";

          const sd = resolveState(name, stateMap);
          if (sd) {
            setTooltip({
              x: e.originalEvent.clientX,
              y: e.originalEvent.clientY,
              name: `${name} — ${((sd.titles_distributed / sd.claims_received) * 100).toFixed(1)}% approved (${sd.titles_distributed.toLocaleString()} titles)`
            });
          } else {
            setTooltip({ x: e.originalEvent.clientX, y: e.originalEvent.clientY, name });
          }
        });

        map.on("mouseleave", "state-fill", () => {
          map.setFilter(hoverLayer, ["==", "NAME_1", ""]);
          map.setFilter(hoverOutline, ["==", "NAME_1", ""]);
          map.getCanvas().style.cursor = "";
          setTooltip(null);
        });

        map.on("click", "state-fill", (e) => {
          if (!e.features?.length) return;
          const name = e.features[0].properties?.NAME_1;
          const sd = resolveState(name, stateMap);
          if (!sd) return;

          setSelected(sd);

          const geom = e.features[0].geometry;
          const bounds = new maplibregl.LngLatBounds();
          if (geom.type === "Polygon") {
            geom.coordinates[0].forEach((c: any) => bounds.extend(c));
          } else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach((poly: any) => poly[0].forEach((c: any) => bounds.extend(c)));
          }
          map.fitBounds(bounds, { padding: { top: 60, bottom: 260, left: 60, right: 60 }, maxZoom: 6.5, duration: 1200 });
          setTooltip(null);
        });

        setLoaded(true);
      });
    });

    mapRef.current = map;
  }, [states]);

  useEffect(() => {
    buildMap();
  }, [buildMap]);

  const approval = selected ? (selected.titles_distributed / selected.claims_received) * 100 : 0;
  const rejection = selected ? (selected.rejected / selected.claims_received) * 100 : 0;
  const pendingPct = selected ? (selected.pending / selected.claims_received) * 100 : 0;

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 relative w-full h-full overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm z-20">
            <div className="text-center bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-sm mx-4">
              <div className="animate-spin w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 text-sm mb-1">Loading Geospatial WebGIS</h4>
              <p className="text-xs text-gray-500">Fetching 36 Indian states and FRA boundaries...</p>
            </div>
          </div>
        )}

        {tooltip && (
          <div
            className="fixed z-50 bg-gray-900/95 text-white border border-gray-700 rounded-lg px-3 py-2 text-xs pointer-events-none shadow-xl backdrop-blur-sm font-medium"
            style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
          >
            {tooltip.name}
          </div>
        )}

        {/* Legend Box */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-gray-200/80 shadow-lg w-64">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-sm text-gray-900">FRA Choropleth</h2>
            <span className="text-[10px] font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">National</span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3">Forest Rights Title Distribution Rates</p>
          <div className="space-y-1.5 text-xs">
            {[
              { color: "#16a34a", label: "High Approval (>70%)" },
              { color: "#84cc16", label: "Good Distribution (50–70%)" },
              { color: "#eab308", label: "Average (35–50%)" },
              { color: "#f97316", label: "Low Processing (20–35%)" },
              { color: "#ef4444", label: "Critical Denial (<20%)" },
              { color: "#e2e8f0", label: "No FRA data recorded" },
            ].map((i) => (
              <div key={i.label} className="flex items-center gap-2.5">
                <div className="w-4 h-3.5 rounded border border-gray-300 shadow-xs shrink-0" style={{ background: i.color }} />
                <span className="text-gray-700 font-medium text-[11px]">{i.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500 flex items-center gap-1.5">
            <span>💡</span> Click any state polygon to inspect district breakdown
          </div>
        </div>

        {/* State Detail Drawer */}
        {selected && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl transition-all">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selected.state}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs ${
                    approval > 50 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}>
                    {approval.toFixed(1)}% Approved
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center font-bold text-base transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {[
                  { label: "Claims Filed", value: selected.claims_received, color: "text-blue-600", bg: "bg-blue-50/60 border-blue-100" },
                  { label: "Titles Distributed", value: selected.titles_distributed, color: "text-green-600", bg: "bg-green-50/60 border-green-100" },
                  { label: "Rejected Claims", value: selected.rejected, color: "text-red-600", bg: "bg-red-50/60 border-red-100" },
                  { label: "Pending Resolution", value: selected.pending, color: "text-yellow-600", bg: "bg-yellow-50/60 border-yellow-100" },
                  { label: "Individual Claims", value: selected.individual_claims, color: "text-purple-600", bg: "bg-purple-50/60 border-purple-100" },
                  { label: "Community Claims", value: selected.community_claims, color: "text-teal-600", bg: "bg-teal-50/60 border-teal-100" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border px-3.5 py-2.5 ${item.bg}`}>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{item.label}</div>
                    <div className={`text-lg font-black ${item.color} mt-0.5`}>{item.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {[
                  { label: "Approved Ratio", pct: approval, color: "bg-green-500", text: "text-green-700" },
                  { label: "Rejection Ratio", pct: rejection, color: "bg-red-500", text: "text-red-700" },
                  { label: "Pending Ratio", pct: pendingPct, color: "bg-yellow-500", text: "text-yellow-700" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className={item.text}>{item.pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
