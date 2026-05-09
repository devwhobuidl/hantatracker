"use client";

import React, { useEffect, useRef, useState } from "react";
import Map, { MapRef, NavigationControl, Marker, Popup, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Case } from "@/lib/data";
import { generateOutbreakArcs } from "@/lib/arcUtils";
import { cn } from "@/lib/utils";

interface TacticalMapProps {
  cases: Case[];
  selectedCaseId: string | null;
  onSelectCase: (id: string) => void;
}

const WORLD_GEOJSON = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

export default function TacticalMap({ cases, selectedCaseId, onSelectCase }: TacticalMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1.5,
    pitch: 0,
    bearing: 0
  });

  const [popupInfo, setPopupInfo] = useState<Case | null>(null);
  const [autoRotate, setAutoRotate] = useState(true); // Enabled by default
  const [liveScan, setLiveScan] = useState(true); // Automated surveillance mode
  const [focusedCaseId, setFocusedCaseId] = useState<string | null>(null);
  const rotationRef = useRef<number>(0);
  const lastInteractionRef = useRef<number>(Date.now());
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Auto-Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastInteractionRef.current;

      // Only rotate if autoRotate is ON and we're NOT in the middle of a focused fly-to
      if (autoRotate && idleTime > 10000 && !focusedCaseId) { 
        setViewport(prev => ({
          ...prev,
          longitude: (prev.longitude + 0.05) % 360 
        }));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate, focusedCaseId]);

  // Live Scan Mode Logic (Intelligent Surveillance)
  useEffect(() => {
    if (!liveScan) return;

    const runScan = () => {
      const now = Date.now();
      const idleTime = now - lastInteractionRef.current;

      // Pause if user interacted recently
      if (idleTime < 20000) {
        scanTimeoutRef.current = setTimeout(runScan, 5000);
        return;
      }

      if (mapRef.current && liveScan) {
        // Weighted selection: Zurich, Berlin, London, Amsterdam are higher priority
        const weightedPool = cases.flatMap(c => {
          const isHighPriority = c.location.includes("ZURICH") || 
                                 c.location.includes("BERLIN") || 
                                 c.location.includes("LONDON") || 
                                 c.location.includes("AMSTERDAM");
          return Array(isHighPriority ? 5 : 1).fill(c);
        });

        const target = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        
        // Focus on location
        setFocusedCaseId(target.id);
        mapRef.current.flyTo({
          center: [target.lng, target.lat],
          zoom: 6,
          pitch: 45,
          bearing: Math.random() * 30 - 15,
          duration: 4000,
          essential: true
        });

        // Hold for 8s then release
        scanTimeoutRef.current = setTimeout(() => {
          setFocusedCaseId(null);
          if (mapRef.current) {
            mapRef.current.easeTo({
              zoom: 1.5,
              pitch: 0,
              duration: 4000
            });
          }
          // Schedule next scan in 18-35 seconds
          const nextInterval = Math.random() * (35000 - 18000) + 18000;
          scanTimeoutRef.current = setTimeout(runScan, nextInterval);
        }, 8000);
      }
    };

    // Initial delay
    const initialDelay = Math.random() * 10000 + 5000;
    scanTimeoutRef.current = setTimeout(runScan, initialDelay);

    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    };
  }, [liveScan, cases]);

  useEffect(() => {
    if (selectedCaseId && mapRef.current) {
      const selected = cases.find((c) => c.id === selectedCaseId);
      if (selected) {
        mapRef.current.flyTo({
          center: [selected.lng, selected.lat],
          zoom: 7,
          duration: 2000,
          essential: true,
          pitch: 45,
          bearing: Math.random() * 20 - 10,
        });
        setPopupInfo(selected);
        lastInteractionRef.current = Date.now(); // Mark interaction
      }
    }
  }, [selectedCaseId, cases]);

  // Set atmosphere/fog for the globe
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap() as any;
      const updateFog = () => {
        if (typeof map.setFog === 'function') {
          map.setFog({
          color: 'rgb(0, 10, 5)', // Deep space with a hint of green
          'high-color': 'rgba(0, 255, 159, 0.7)', // Stronger neon horizon
          'horizon-blend': 0.1,
          'space-color': 'rgb(5, 0, 5)', // Subtle magenta hint in space
          'star-intensity': 0.8,
          'star-color': 'rgba(255, 0, 170, 0.5)' // Pink stars for contrast
          });
        }
      };
      
      if (map.isStyleLoaded()) updateFog();
      else map.on('style.load', updateFog);
    }
  }, [mounted]);


  const handleZoom = (delta: number) => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.zoomTo(currentZoom + delta, { duration: 500 });
      lastInteractionRef.current = Date.now();
    }
  };

  const handleRotate = (delta: number) => {
    if (mapRef.current) {
      const currentBearing = mapRef.current.getBearing();
      mapRef.current.rotateTo(currentBearing + delta, { duration: 500 });
      lastInteractionRef.current = Date.now();
    }
  };

  const handleEuropeFocus = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [15, 50],
        zoom: 3.5,
        pitch: 30,
        duration: 3000
      });
      lastInteractionRef.current = Date.now();
    }
  };

  const handleWorldView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [0, 0],
        zoom: 1.5,
        pitch: 0,
        duration: 3000
      });
      lastInteractionRef.current = Date.now();
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-full relative bg-black overflow-hidden" id="tactical-map-container">
      <Map
        ref={mapRef}
        initialViewState={viewport}
        onMove={(evt) => {
          setViewport(evt.viewState);
        }}
        onDragStart={() => lastInteractionRef.current = Date.now()}
        onZoomStart={() => lastInteractionRef.current = Date.now()}
        onMoveStart={() => lastInteractionRef.current = Date.now()}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
        projection="globe"
        {...({ preserveDrawingBuffer: true } as any)}
        dragRotate={true}
        touchPitch={true}
        touchZoomRotate={true}
      >
        <NavigationControl position="top-right" />
        {/* Country Borders & Glow Layers */}
        <Source id="countries" type="geojson" data={WORLD_GEOJSON}>
          {/* High Density Country Pulse (CH, NL, DE, FR) */}
          <Layer
            id="high-density-glow"
            type="fill"
            filter={['in', ['get', 'iso_a2'], ['literal', ['CH', 'NL', 'DE', 'FR']]]}
            paint={{
              "fill-color": "#00ff9f",
              "fill-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.1, 5, 0.2], // Deeper on zoom
              "fill-outline-color": "#00ff9f",
            }}
          />
          {/* Animated Country Pulse (Simulated via overlay) */}
          <Layer
            id="high-density-pulse"
            type="fill"
            filter={['in', ['get', 'iso_a2'], ['literal', ['CH', 'NL', 'DE', 'FR']]]}
            paint={{
              "fill-color": "#00ff9f",
              "fill-opacity": 0.05,
            }}
          />
          <Layer
            id="country-glow-outer"
            type="line"
            paint={{
              "line-color": "#00ff9f",
              "line-width": 10,
              "line-blur": 8,
              "line-opacity": 0.3
            }}
          />
          <Layer
            id="country-core"
            type="line"
            paint={{
              "line-color": "#00ff9f",
              "line-width": 1,
              "line-opacity": 0.5
            }}
          />
        </Source>

        <Source id="outbreak-arcs" type="geojson" data={generateOutbreakArcs(cases)}>
          <Layer
            id="arc-glow"
            type="line"
            paint={{
              "line-color": [
                "match",
                ["get", "status"],
                "DECEASED", "#ff4d4d",
                "CONFIRMED", "#ff00aa",
                "#00ff9f"
              ],
              "line-width": 8,
              "line-blur": 5,
              "line-opacity": 0.2
            }}
          />
          <Layer
            id="arc-core"
            type="line"
            paint={{
              "line-color": [
                "match",
                ["get", "status"],
                "DECEASED", "#ff4d4d",
                "CONFIRMED", "#ff00aa",
                "#00ff9f"
              ],
              "line-width": 1.5,
              "line-opacity": 0.6
            }}
          />
        </Source>

        {/* Tactical Markers */}
        {cases.map((c) => {
          const isMajor = c.location.includes("ZURICH") || c.location.includes("BERLIN");
          return (
            <Marker 
              key={c.id} 
              longitude={c.lng} 
              latitude={c.lat} 
              anchor="center"
            >
              <div 
                className={cn(
                  "relative group cursor-pointer transition-all duration-1000",
                  focusedCaseId === c.id ? "scale-150" : "scale-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCase(c.id);
                  setPopupInfo(c);
                  lastInteractionRef.current = Date.now();
                }}
              >
                {/* Concentric Pulsing Rings (Elite Upgrade) */}
                <div className={cn(
                  "absolute -inset-8 rounded-full border-2 border-current opacity-0 animate-ring-1",
                  isMajor ? "scale-150" : "",
                  c.status === 'CONFIRMED' ? 'text-secondary' : 
                  c.status === 'DECEASED' ? 'text-red-500' : 'text-primary'
                )} style={{ animationDelay: '0s' }} />
                <div className={cn(
                  "absolute -inset-12 rounded-full border border-current opacity-0 animate-ring-2",
                  isMajor ? "scale-150" : "",
                  c.status === 'CONFIRMED' ? 'text-secondary' : 
                  c.status === 'DECEASED' ? 'text-red-500' : 'text-primary'
                )} style={{ animationDelay: '0.5s' }} />
                <div className={cn(
                  "absolute -inset-16 rounded-full border border-current opacity-0 animate-ring-3",
                  isMajor ? "scale-150" : "",
                  c.status === 'CONFIRMED' ? 'text-secondary' : 
                  c.status === 'DECEASED' ? 'text-red-500' : 'text-primary'
                )} style={{ animationDelay: '1s' }} />

                {/* Focus Ring (Live Scan Mode) */}
                {focusedCaseId === c.id && (
                  <div className="absolute -inset-24 rounded-full border-4 border-primary opacity-40 animate-ping shadow-[0_0_50px_#00ff9f]" />
                )}
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 border-white shadow-[0_0_20px_currentColor] relative z-10 transition-transform duration-300 group-hover:scale-150",
                  isMajor ? "w-6 h-6 border-4" : "",
                  c.status === 'CONFIRMED' ? 'bg-secondary text-secondary' : 
                  c.status === 'DECEASED' ? 'bg-red-500 text-red-500' : 'bg-primary text-primary'
                )} />
                
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-sm opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[200] shadow-[0_0_30px_rgba(0,0,0,1)] whitespace-nowrap border-b-2 border-b-primary scale-90 group-hover:scale-100 origin-bottom">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] font-black text-primary uppercase tracking-[0.2em]">{c.location}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-mono text-[8px] font-black tracking-widest text-white/40">ID: {c.number.toString().padStart(3, '0')}</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className={cn(
                        "font-mono text-[8px] font-black tracking-widest",
                        c.status === 'CONFIRMED' ? 'text-secondary' : 'text-primary'
                      )}>{c.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Selected Case Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="tactical-popup"
            offset={30}
          >
            <div className="min-w-[220px] p-3 font-mono bg-black/95 backdrop-blur-xl border border-primary/40 shadow-[0_0_50px_rgba(0,255,159,0.3)] rounded-sm">
              <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                <div className="flex flex-col">
                  <div className="text-[11px] text-primary font-black tracking-tighter animate-pulse">INTEL_ACQUIRED</div>
                  <div className="text-[9px] text-white/40">REF: {popupInfo.id.toUpperCase()}</div>
                </div>
                <div className={`text-[9px] px-2 py-0.5 rounded font-black ${
                  popupInfo.status === 'CONFIRMED' ? 'bg-secondary text-black glow-pink' : 
                  popupInfo.status === 'DECEASED' ? 'bg-red-600 text-white' : 'bg-primary text-black'
                }`}>
                  {popupInfo.status}
                </div>
              </div>
              <div className="text-sm font-black uppercase mb-1.5 tracking-widest text-white">{popupInfo.location}</div>
              <div className="text-[11px] leading-relaxed text-white/80 mb-4 border-l-2 border-primary/40 pl-3">
                {popupInfo.details}
              </div>
              <button 
                onClick={() => {
                  onSelectCase(popupInfo.id);
                  setPopupInfo(null);
                }}
                className="w-full bg-primary/20 hover:bg-primary/40 border border-primary/60 text-primary text-[10px] py-2.5 rounded-sm font-mono font-black transition-all uppercase tracking-widest flex items-center justify-center space-x-2 group active:scale-95 shadow-[0_0_20px_rgba(0,255,159,0.2)] hover:shadow-[0_0_30px_rgba(0,255,159,0.4)]"
              >
                <span>ACCESS_INTEL_PROFILE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </Popup>
        )}
      </Map>

      {/* Mission Control Panel (Elite Upgrade) */}
      <div className="absolute left-6 top-6 z-[100] pointer-events-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2 bg-black/60 backdrop-blur-md border border-primary/30 p-1.5 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <button 
              onClick={handleEuropeFocus}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/30 border border-primary/20 rounded text-[9px] font-black text-primary transition-all uppercase tracking-widest"
            >
              Europe Focus
            </button>
            <button 
              onClick={handleWorldView}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/30 border border-primary/20 rounded text-[9px] font-black text-primary transition-all uppercase tracking-widest"
            >
              World View
            </button>
          </div>
        </div>
      </div>

      {/* Floating Legend Overlay */}
      <div className="absolute bottom-8 left-8 z-[100] pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-xl border border-primary/30 p-4 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col space-y-3 min-w-[160px]">
          <div className="flex items-center justify-between border-b border-primary/10 pb-2 mb-1">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00ff9f]" />
              <span className="font-mono text-[10px] font-black text-primary/80 tracking-[0.2em]">TACTICAL_MAP_V4</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <LegendItem color="#ff00aa" label="CONFIRMED" />
            <LegendItem color="#ffea00" label="SUSPECTED" />
            <LegendItem color="#00ff9f" label="MONITORING" />
            <LegendItem color="#ff4d4d" label="DECEASED" />
          </div>

          <div className="pt-2 border-t border-primary/10">
            <div className="flex items-center justify-between text-[8px] font-mono text-primary/30">
              <span>SCAN_RESOLUTION</span>
              <span className="text-primary/60 font-black">ULTRA_HD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none z-[10]">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(0,255,159,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,159,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {/* Dynamic Scan Line (Elite Upgrade) */}
        {liveScan && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-1 bg-primary/20 shadow-[0_0_20px_#00ff9f] animate-scan-line" />
          </div>
        )}
        
        <div className="crt-overlay opacity-[0.3]" />
      </div>


      {/* Right Side Navigation Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col space-y-3">
        <div className="flex flex-col bg-black/60 backdrop-blur-md border border-primary/20 p-2 rounded-lg space-y-2 shadow-[0_0_20px_rgba(0,255,159,0.1)]">
          <div className="text-[8px] text-primary/40 text-center font-bold mb-1 uppercase tracking-tighter">Zoom</div>
          <button 
            onClick={() => handleZoom(1)}
            className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary/30 border border-primary/30 rounded text-primary transition-all font-black text-xl"
          >
            +
          </button>
          <button 
            onClick={() => handleZoom(-1)}
            className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary/30 border border-primary/30 rounded text-primary transition-all font-black text-xl"
          >
            -
          </button>
        </div>

        <div className="flex flex-col bg-black/60 backdrop-blur-md border border-primary/20 p-2 rounded-lg space-y-2 shadow-[0_0_20px_rgba(0,255,159,0.1)]">
          <div className="text-[8px] text-primary/40 text-center font-bold mb-1 uppercase tracking-tighter">Orbit</div>
          <button 
            onClick={() => handleRotate(-45)}
            className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary/30 border border-primary/30 rounded text-primary transition-all font-mono text-[10px] font-black"
          >
            L
          </button>
          <button 
            onClick={() => handleRotate(45)}
            className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary/30 border border-primary/30 rounded text-primary transition-all font-mono text-[10px] font-black"
          >
            R
          </button>
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={cn(
              "w-10 h-10 flex flex-col items-center justify-center border rounded transition-all",
              autoRotate ? "bg-primary/20 border-primary text-primary" : "bg-black/40 border-white/10 text-white/40"
            )}
            title="Auto Rotate"
          >
            <div className="text-[8px] font-black leading-none mb-0.5">ROT</div>
            <div className={`w-1.5 h-1.5 rounded-full ${autoRotate ? 'bg-primary shadow-[0_0_5px_#00ff9f]' : 'bg-white/20'}`} />
          </button>

          <button 
            onClick={() => setLiveScan(!liveScan)}
            className={cn(
              "w-10 h-10 flex flex-col items-center justify-center border rounded transition-all",
              liveScan ? "bg-secondary/20 border-secondary text-secondary" : "bg-black/40 border-white/10 text-white/40"
            )}
            title="Live Scan Mode"
          >
            <div className="text-[8px] font-black leading-none mb-0.5">SCAN</div>
            <div className={`w-1.5 h-1.5 rounded-full ${liveScan ? 'bg-secondary shadow-[0_0_5px_#ff00aa]' : 'bg-white/20'}`} />
          </button>
        </div>

        <button 
          onClick={() => {
            mapRef.current?.flyTo({
              center: [0, 0],
              zoom: 1.5,
              pitch: 0,
              bearing: 0,
              duration: 2000
            });
            rotationRef.current = 0;
            lastInteractionRef.current = Date.now();
          }}
          className="bg-black/60 backdrop-blur-md border border-primary/30 p-2 rounded text-[8px] text-primary hover:bg-primary/20 transition-all font-mono uppercase tracking-tighter font-black"
        >
          Reset<br/>View
        </button>
      </div>

      <div className="absolute top-4 left-4 z-[20] flex flex-col space-y-1 font-mono text-[10px] text-primary/40 uppercase tracking-tighter bg-black/40 p-2 backdrop-blur-sm rounded border border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <div>System: G-NAV Tactical 4.2</div>
        </div>
        <div>Signal: Encrypted [AES-256]</div>
        <div>Lat: {viewport.latitude.toFixed(4)}</div>
        <div>Lng: {viewport.longitude.toFixed(4)}</div>
      </div>

      <div className="absolute bottom-4 right-4 z-[20] flex flex-col items-end space-y-1 font-mono text-[10px] text-primary/40 uppercase tracking-tighter bg-black/40 p-2 backdrop-blur-sm rounded border border-white/5">
        <div>Zoom: {viewport.zoom.toFixed(1)}x</div>
        <div>Pitch: {viewport.pitch.toFixed(0)}°</div>
        <div>Bearing: {viewport.bearing.toFixed(0)}°</div>
      </div>
      
      <div className="vignette absolute inset-0 pointer-events-none z-[15]" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 rounded-full relative" style={{ backgroundColor: color }}>
        <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: color }} />
      </div>
      <span style={{ color: color }} className="font-bold opacity-80">{label}</span>
    </div>
  );
}
