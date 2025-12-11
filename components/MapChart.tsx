import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { GeoJsonProperties } from '../types';
import { geoCentroid } from 'd3-geo';

// High-quality TopoJSON for Europe
const GEO_URL = "https://code.highcharts.com/mapdata/custom/europe.topo.json";

interface MapChartProps {
  onCountryClick: (geo: GeoJsonProperties) => void;
  selectedCountryName: string | null;
}

// Helper to convert country code (2 char) to flag emoji
function getFlagEmoji(countryCode: string) {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const MapChart: React.FC<MapChartProps> = ({ onCountryClick, selectedCountryName }) => {
  // Memoize projection config to prevent re-renders of the map container
  const projectionConfig = useMemo(() => ({
    rotate: [-10.0, -52.0, 0] as [number, number, number],
    scale: 800
  }), []);

  return (
    <div className="w-full h-full bg-blue-50 rounded-3xl overflow-hidden shadow-inner border border-blue-100 relative">
        <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white max-w-xs pointer-events-none select-none">
            <h3 className="font-bold text-slate-700">How to use:</h3>
            <p className="text-sm text-slate-500 mt-1">
                Click on any country to learn about it! 
                Use your mouse wheel to zoom and drag to move around.
            </p>
        </div>

      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={projectionConfig}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", backgroundColor: "#eff6ff" }}
      >
        <ZoomableGroup 
            minZoom={1} 
            maxZoom={6}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => (
                <>
                {/* Render Countries */}
                {geographies.map((geo) => {
                    const countryName = geo.properties.name || geo.properties["hc-a2"];
                    const isSelected = selectedCountryName === countryName;
                    
                    return (
                    <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => onCountryClick(geo.properties)}
                        style={{
                        default: {
                            fill: isSelected ? "#38bdf8" : "#e2e8f0",
                            stroke: "#ffffff",
                            strokeWidth: 0.5,
                            outline: "none",
                            transition: "all 250ms"
                        },
                        hover: {
                            fill: "#7dd3fc", // Sky 300
                            stroke: "#ffffff",
                            strokeWidth: 1.5,
                            outline: "none",
                            cursor: "pointer",
                            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"
                        },
                        pressed: {
                            fill: "#0284c7", // Sky 600
                            stroke: "#ffffff",
                            strokeWidth: 1,
                            outline: "none",
                        },
                        }}
                    />
                    );
                })}

                {/* Render Flags */}
                {geographies.map((geo) => {
                    const countryCode = geo.properties["hc-a2"];
                    // Skip if no code or too small to matter visually on this map scale without clustering
                    if (!countryCode) return null;
                    
                    const centroid = geoCentroid(geo);
                    const flag = getFlagEmoji(countryCode);

                    return (
                        <Marker 
                            key={`flag-${geo.rsmKey}`} 
                            coordinates={centroid} 
                            style={{ 
                                default: { pointerEvents: 'none' }, 
                                hover: { pointerEvents: 'none' }, 
                                pressed: { pointerEvents: 'none' } 
                            }}
                        >
                            <text
                                y="2"
                                fontSize={10}
                                textAnchor="middle"
                                className="filter drop-shadow-sm pointer-events-none select-none opacity-80"
                            >
                                {flag}
                            </text>
                        </Marker>
                    );
                })}
                </>
            )}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default MapChart;