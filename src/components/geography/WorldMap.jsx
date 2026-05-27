import { memo, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import worldTopo from "../../assets/geo/world-110m.json";
import { isoFromMapName, zoomForContinent } from "../../lib/geoUtils";

const geoData = feature(worldTopo, worldTopo.objects.countries);

function WorldMapInner({
  zoomTo = "world",
  highlightedCodes = [],
  revealCode = null,
  onCountryClick,
  interactive = true,
  className = "",
}) {
  const view = zoomForContinent(zoomTo === "world" ? "world" : zoomTo);
  const highlightSet = useMemo(() => new Set(highlightedCodes.map((c) => c.toUpperCase())), [highlightedCodes]);
  const reveal = revealCode?.toUpperCase();

  return (
    <div className={`w-full overflow-hidden rounded-chunky border-[3px] border-ink/15 bg-[#d6eef8] ${className}`}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: view.center, scale: view.scale }}
        width={800}
        height={420}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties?.name;
              const code = isoFromMapName(name);
              const isReveal = reveal && code === reveal;
              const isHighlight = code && highlightSet.has(code);
              let fill = "#e8f4ea";
              if (isReveal) fill = "#6BCB77";
              else if (isHighlight) fill = "#FFE66D";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={
                    interactive && onCountryClick && code
                      ? () => onCountryClick(code)
                      : undefined
                  }
                  style={{
                    default: {
                      fill,
                      stroke: "#2D3047",
                      strokeWidth: 0.4,
                      outline: "none",
                      cursor: interactive && code ? "pointer" : "default",
                    },
                    hover: {
                      fill: interactive && code ? "#4ECDC4" : fill,
                      stroke: "#2D3047",
                      strokeWidth: 0.6,
                      outline: "none",
                      cursor: interactive && code ? "pointer" : "default",
                    },
                    pressed: { fill: "#FF6B35", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export const WorldMap = memo(WorldMapInner);
