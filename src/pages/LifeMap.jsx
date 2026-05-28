import { useState } from "react";
import { Link } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useLifeExplorerStore } from "../store/useLifeExplorerStore";
import { useAuthStore } from "../store/useAuthStore";
import { upsertLifeExplorerItem } from "../lib/cloud/lifeExplorer";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const PIN_TYPES = [
  { id: "visited", label: "Visited", emoji: "✅" },
  { id: "dream", label: "Dream trip", emoji: "✨" },
  { id: "home", label: "Home", emoji: "🏠" },
];

export default function LifeMap() {
  const addItem = useLifeExplorerStore((s) => s.addItem);
  const pins = useLifeExplorerStore((s) => s.pins());
  const userId = useAuthStore((s) => s.user?.id);
  const [title, setTitle] = useState("");
  const [pinType, setPinType] = useState("visited");
  const [coords, setCoords] = useState([-95, 40]);

  async function savePin() {
    if (!title.trim()) return;
    const item = addItem({
      type: "map_pin",
      title,
      body: pinType,
      meta: { lat: coords[1], lng: coords[0], pinType },
    });
    if (userId) {
      await upsertLifeExplorerItem({
        userId,
        id: item.id?.startsWith("local") ? undefined : item.id,
        itemType: "map_pin",
        title,
        body: pinType,
        meta: item.meta,
      });
    }
    setTitle("");
  }

  return (
    <div className="flex flex-col gap-3">
      <Link to="/life" className="text-sm font-bold">
        ← Life Explorer
      </Link>
      <h1 className="font-display text-xl font-extrabold">My world map</h1>
      <div className="rounded-2xl overflow-hidden border-2 border-ink/10 bg-[#E1F5EE]">
        <ComposableMap projectionConfig={{ scale: 140 }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#B5E8E1"
                  stroke="#0F6E56"
                  strokeWidth={0.4}
                  style={{ default: { outline: "none" }, hover: { fill: "#7FDBCA" }, pressed: { fill: "#2A9D8F" } }}
                />
              ))
            }
          </Geographies>
          {pins.map((p) =>
            p.meta?.lat != null ? (
              <Marker key={p.id} coordinates={[p.meta.lng, p.meta.lat]}>
                <text textAnchor="middle" fontSize={16}>
                  {PIN_TYPES.find((t) => t.id === p.meta.pinType)?.emoji ?? "📍"}
                </text>
              </Marker>
            ) : null
          )}
          <Marker coordinates={coords}>
            <circle r={4} fill="#E63946" stroke="#fff" strokeWidth={1} />
          </Marker>
        </ComposableMap>
      </div>

      <div className="chunky-card p-3 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <label>
            Lat
            <input
              type="number"
              step="0.1"
              value={coords[1]}
              onChange={(e) => setCoords([coords[0], Number(e.target.value)])}
              className="w-full px-2 py-1 rounded border border-ink/15 mt-0.5"
            />
          </label>
          <label>
            Lng
            <input
              type="number"
              step="0.1"
              value={coords[0]}
              onChange={(e) => setCoords([Number(e.target.value), coords[1]])}
              className="w-full px-2 py-1 rounded border border-ink/15 mt-0.5"
            />
          </label>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Place name"
          className="px-3 py-2 rounded-chunky border-2 border-ink/15 font-bold"
        />
        <div className="flex gap-2">
          {PIN_TYPES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPinType(p.id)}
              className={`flex-1 py-2 text-xs font-bold rounded-chunky border-2 ${
                pinType === p.id ? "bg-accent border-ink/25" : "border-ink/10"
              }`}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={savePin} className="chunky-btn bg-primary text-white font-extrabold py-2">
          Drop pin
        </button>
      </div>

      <ul className="text-sm font-bold space-y-1">
        {pins.map((p) => (
          <li key={p.id}>
            {p.title} · {p.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
