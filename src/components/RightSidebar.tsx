"use client";

import { useEffect, useRef, useState } from "react";
import { INITIAL_CHAT } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MessageSquare, TrendingUp, Cpu } from "lucide-react";

interface RightSidebarProps {
  messages: typeof INITIAL_CHAT;
  onSendMessage: (message: string) => void;
  onSelectLocation: (location: string) => void;
}

export default function RightSidebar({ messages, onSendMessage, onSelectLocation }: RightSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const getAvatar = (user: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user}`;
  };

  return (
    <div className="w-80 h-full bg-background border-l border-primary/20 flex flex-col z-40">
      {/* Top Locations Panel */}
      <div className="h-1/3 flex flex-col border-b border-primary/20">
        <div className="p-3 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp size={14} className="text-primary" />
            <span className="font-mono text-xs font-bold text-primary">TOP LOCATIONS PER CASES</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {[
            { loc: "ZURICH, CH", count: 142, trend: "+12" },
            { loc: "BERLIN, DE", count: 89, trend: "+5" },
            { loc: "AMSTERDAM, NL", count: 76, trend: "+8" },
            { loc: "PARIS, FR", count: 42, trend: "+2" },
            { loc: "LONDON, UK", count: 31, trend: "+4" },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => onSelectLocation(item.loc)}
              className="w-full flex items-center justify-between p-2 bg-primary/5 border border-primary/10 rounded group hover:bg-primary/10 hover:border-primary/30 transition-all text-left"
            >
              <span className="font-mono text-[11px] text-primary/80 group-hover:text-primary">{item.loc}</span>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-primary">{item.count}</span>
                <span className="font-mono text-[9px] text-secondary">{item.trend}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* YouTube Chat Simulation */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-3 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare size={14} className="text-primary" />
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-tighter">HANTA-GRAVITY LIVE CHAT</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[9px] text-primary/40 uppercase">1.2K watching</span>
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#ff00aa]" />
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-primary/20"
        >
          {messages.map((m) => (
            <div key={m.id} className="flex items-start space-x-3 group">
              <div className="shrink-0 mt-0.5">
                <img 
                  src={getAvatar(m.user)} 
                  alt={m.user} 
                  className="w-6 h-6 rounded border border-primary/20 bg-primary/10 group-hover:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex flex-col space-y-1 min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className={cn("font-mono text-[11px] font-bold truncate", m.user === "YOU" ? "text-secondary" : "text-primary")}>
                    {m.user}
                  </span>
                  <span className="font-mono text-[9px] text-primary/30 shrink-0">{m.timestamp}</span>
                </div>
                <p className={cn(
                  "font-mono text-[11px] leading-tight p-2 rounded-r-lg rounded-bl-lg border-l-2 transition-all",
                  m.user === "YOU" 
                    ? "bg-secondary/5 border-secondary/40 text-secondary/90" 
                    : "bg-primary/5 border-primary/20 text-primary/80 group-hover:bg-primary/10"
                )}>
                  {m.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-primary/20 bg-background/80 backdrop-blur-sm">
          <div className="relative group">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="SEND MESSAGE..." 
              className="w-full bg-primary/5 border border-primary/30 rounded px-3 py-2.5 font-mono text-[10px] text-primary placeholder:text-primary/20 focus:outline-none focus:border-primary/60 focus:bg-primary/10 glow-border-green transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <span className="font-mono text-[8px] text-primary/20 group-focus-within:text-primary/40 uppercase">Press Enter</span>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_5px_#00ff9f]" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="h-1/4 border-t border-primary/20 bg-primary/5 p-3 flex flex-col relative overflow-hidden group">
        {/* Background Animation Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(45deg,#00ff9f_25%,transparent_25%,transparent_50%,#00ff9f_50%,#00ff9f_75%,transparent_75%,transparent)] bg-[length:4px_4px]" />
        
        <div className="flex items-center space-x-2 mb-2 relative z-10">
          <Cpu size={14} className="text-secondary" />
          <span className="font-mono text-[10px] font-bold text-secondary tracking-widest uppercase">ADVISORY SYSTEM</span>
        </div>
        <div className="flex-1 bg-background/80 border border-secondary/20 rounded p-3 overflow-hidden relative z-10">
          <p className="font-mono text-[9px] text-secondary/80 leading-relaxed uppercase tracking-tight">
            <span className="text-secondary font-bold mr-1">[!]</span>
            {messages[messages.length-1]?.message.includes('Germany') 
              ? "DEU_CLUSTER_UPDATE: CROSS-BORDER RISK INCREASING IN MUNICH SECTOR. DEPLOYING CONTAINMENT SQUADS."
              : "MONITORING GLOBAL DATA FEEDS. PATIENT ZERO PROFILE COMPLETE. RECOMMEND IMMEDIATE QUARANTINE PROTOCOL X-RAY."
            }
          </p>
          <div className="mt-2 flex space-x-1">
            <div className="h-1 w-8 bg-secondary/30 rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-2/3 animate-[shimmer_2s_infinite]" />
            </div>
            <div className="h-1 w-4 bg-secondary/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
