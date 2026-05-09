"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import CaseProfile from "@/components/CaseProfile";
import RightSidebar from "@/components/RightSidebar";
import BottomBar from "@/components/BottomBar";
import { INITIAL_CASES, INITIAL_CHAT, INITIAL_FEED, INITIAL_STATS, Case } from "@/lib/data";
import { getLatestReports, ReliefWebReport } from "@/lib/liveData";
import { Plus, Share2 } from "lucide-react";

// Dynamic import for Leaflet to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-background flex items-center justify-center font-mono text-primary animate-pulse">LOADING GLOBAL MAP SYSTEM...</div>
});

export default function Dashboard() {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [chat, setChat] = useState(INITIAL_CHAT);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>("case-5");
  const [reports, setReports] = useState<ReliefWebReport[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const fetchReports = useCallback(async () => {
    const latestReports = await getLatestReports();
    setReports(latestReports);
    // Use setTimeout to avoid synchronous setState warning in Next.js 16
    setTimeout(() => {
      setLastUpdated(new Date());
    }, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLastUpdated(new Date());
      fetchReports();
    }, 0);
    const interval = setInterval(fetchReports, 60000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  const selectedCase = cases.find(c => c.id === selectedCaseId) || null;

  // Simulate periodic updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random chat message
      const users = ["void_walker", "hanta_believer", "istthatmystic", "elibedovic7774", "cryptoguard"];
      const messages = [
        "Did you see the new markers in Germany?",
        "CFR rate is climbing. This is not good.",
        "Anyone in Zurich? Stay indoors.",
        "The ship group was larger than they said.",
        "Check the source feed, Heathrow is locking down.",
      ];
      
      const newUser = users[Math.floor(Math.random() * users.length)];
      const newMessage = messages[Math.floor(Math.random() * messages.length)];
      
      setChat(prev => [...prev.slice(-15), {
        id: Date.now(),
        user: newUser,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Slowly increment stats
      setStats(prev => ({
        ...prev,
        total: prev.total + Math.floor(Math.random() * 3),
        suspected: prev.suspected + Math.floor(Math.random() * 2),
      }));

      // Add random alert to feed
      if (Math.random() > 0.4) {
        const alerts = [
          "HEATHROW AIRPORT LOCKDOWN INITIATED",
          "NEW CLUSTER DETECTED IN MARSEILLE",
          "WHO DECLARES LEVEL 4 EMERGENCY",
          "PORT OF ROTTERDAM QUARANTINE PROTOCOL",
          "VACCINE RESEARCH FACILITY BREACH REPORTED",
          "ZURICH QUARANTINE ZONE EXPANDED",
          "BERLIN SECTOR 7 CLEARANCE REVOKED",
          "NUCLEAR POWER PLANT SCRAMMED - CONTAINMENT FAILURE",
          "INTERPOL ISSUES RED NOTICE FOR PATIENT ZERO",
          "SATELLITE THERMAL SCAN: UNKNOWN HEAT SIGNATURES IN ALPS"
        ];
        const newAlert = alerts[Math.floor(Math.random() * alerts.length)];
        setFeed(prev => [{
          id: Date.now(),
          type: Math.random() > 0.6 ? "CRITICAL" : "WARNING",
          text: newAlert,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          url: "#"
        }, ...prev.slice(0, 15)]);
      }
    }, 6000); // Faster updates for "live" feel

    return () => clearInterval(interval);
  }, []);

  const simulateNewCase = useCallback(() => {
    const locations = [
      { name: "MUNICH, DE", lat: 48.1351, lng: 11.582 },
      { name: "LYON, FR", lat: 45.764, lng: 4.8357 },
      { name: "VIENNA, AT", lat: 48.2082, lng: 16.3738 },
      { name: "MILAN, IT", lat: 45.4642, lng: 9.1899 },
    ];
    
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const id = `case-${Date.now()}`;
    const newCase: Case = {
      id,
      number: cases.length + 1,
      location: loc.name,
      lat: loc.lat + (Math.random() - 0.5) * 0.1,
      lng: loc.lng + (Math.random() - 0.5) * 0.1,
      status: Math.random() > 0.7 ? "CONFIRMED" : "SUSPECTED",
      details: "New cluster detected via thermal screening. Investigation ongoing.",
      sex: Math.random() > 0.5 ? "MALE" : "FEMALE",
      age: Math.floor(Math.random() * 40) + 20,
      ship: "MV HONDIUS (SECONDARY)",
      source: "LOCAL-HEALTH-AUTH",
      coordinates: `${loc.lat.toFixed(2)}°N ${loc.lng.toFixed(2)}°E`,
      timestamp: new Date().toISOString(),
    };

    setCases(prev => [...prev, newCase]);
    setFeed(prev => [{
      id: Date.now(),
      type: "ALERT",
      text: `NEW CLUSTER DETECTED: ${loc.name}`,
      timestamp: "Just now",
      url: "#"
    }, ...prev.slice(0, 9)]);
    
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      suspected: prev.suspected + 1,
      locations: prev.locations + 1
    }));
  }, [cases.length]);

  const handleSendMessage = useCallback((message: string) => {
    setChat(prev => [...prev.slice(-15), {
      id: Date.now(),
      user: "YOU",
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  const handleSelectLocation = useCallback((locationName: string) => {
    // Find the first case with this location or just fallback to Zurich if none found
    const found = cases.find(c => c.location.includes(locationName.split(',')[0]));
    if (found) {
      setSelectedCaseId(found.id);
    }
  }, [cases]);

  const [isFlashing, setIsFlashing] = useState(false);

  const handleShareScreenshot = async () => {
    setIsFlashing(true);
    
    // Add temporary class to hide elements
    const hideElements = document.querySelectorAll(".screenshot-hide");
    hideElements.forEach(el => el.classList.add("hidden"));
    
    setTimeout(async () => {
      try {
        const dashboard = document.querySelector("main");
        if (dashboard) {
          const { toPng } = await import("html-to-image");
          
          const dataUrl = await toPng(dashboard, {
            backgroundColor: "#0a0f0a",
            quality: 1,
            pixelRatio: 2,
            cacheBust: true,
            filter: (node) => {
              const element = node as HTMLElement;
              if (element.classList) {
                return !element.classList.contains('screenshot-hide') && !element.classList.contains('animate-flash');
              }
              return true;
            }
          });
          
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `HANTA-GLOBAL-INTEL-${new Date().getTime()}.png`;
          link.click();
        }
      } catch (err) {
        console.error("Screenshot failed:", err);
      } finally {
        hideElements.forEach(el => el.classList.remove("hidden"));
        setIsFlashing(false);
      }
    }, 200);
  };

  return (
    <main className="h-screen w-screen flex flex-col bg-background text-primary selection:bg-primary selection:text-background overflow-hidden relative">
      {/* Flash Effect Layer */}
      {isFlashing && <div className="absolute inset-0 z-[9999] animate-flash pointer-events-none" />}
      
      <Header stats={stats} lastUpdated={lastUpdated} />
      
      <div className="flex-1 flex min-h-0 relative">
        <CaseProfile selectedCase={selectedCase} />
        
        <div className="flex-1 relative flex flex-col min-w-0">
          <Map 
            cases={cases} 
            selectedCaseId={selectedCaseId} 
            onSelectCase={setSelectedCaseId} 
          />
          
          {/* Simulation Overlay (Hidden on Screenshot) */}
          <div className="absolute top-6 right-6 z-[1000] flex flex-col space-y-3 screenshot-hide">
            <button 
              onClick={simulateNewCase}
              className="flex items-center space-x-2 bg-background/80 hover:bg-primary/20 border border-primary/40 px-4 py-2 rounded font-mono text-xs text-primary transition-all glow-border-green group shadow-[0_0_15px_rgba(0,255,159,0.1)]"
            >
              <Plus size={14} className="group-hover:rotate-90 transition-transform" />
              <span>SIMULATE NEW CASE</span>
            </button>
            
            <button 
              className="flex items-center space-x-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/40 px-4 py-2 rounded font-mono text-xs text-secondary transition-all shadow-[0_0_15px_rgba(255,0,170,0.1)] group relative overflow-hidden"
              onClick={handleShareScreenshot}
            >
              <div className="absolute inset-0 bg-secondary/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              <Share2 size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="opacity-70 group-hover:opacity-100 uppercase font-black tracking-widest text-[10px]">Capture Intel</span>
            </button>
          </div>
        </div>

        <RightSidebar 
          messages={chat} 
          onSendMessage={handleSendMessage}
          onSelectLocation={handleSelectLocation}
        />
      </div>

      <BottomBar feed={feed} reports={reports} />

      {/* Grid Overlay for aesthetic */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
           style={{ backgroundImage: 'radial-gradient(#00ff9f 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </main>
  );
}
