import { useState, useEffect } from "react";
import { INITIAL_FEED } from "@/lib/data";
import { ReliefWebReport } from "@/lib/liveData";
import { Radio, AlertTriangle, ShieldCheck, Activity, ExternalLink } from "lucide-react";

interface BottomBarProps {
  feed: typeof INITIAL_FEED;
  reports?: ReliefWebReport[];
}

export default function BottomBar({ feed, reports }: BottomBarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <footer className="h-12 border-t border-primary/30 bg-background/80 backdrop-blur-md flex items-center divide-x divide-primary/20 z-50">
      {/* Legend Section */}
      <div className="flex items-center space-x-6 px-6 h-full">
        <LegendItem color="bg-secondary" label="DECEASED" />
        <LegendItem color="bg-accent" label="CONFIRMED" />
        <LegendItem color="bg-suspected" label="SUSPECTED" />
        <LegendItem color="bg-primary" label="MONITORING" />
      </div>

      {/* Feed Section */}
      <div className="flex-1 flex items-center px-4 h-full overflow-hidden">
        <div className="flex items-center space-x-3 mr-6 shrink-0">
          <div className="flex items-center space-x-1.5 bg-secondary/10 border border-secondary/30 px-2 py-0.5 rounded-sm animate-pulse">
            <Radio size={10} className="text-secondary" />
            <span className="font-mono text-[8px] font-black text-secondary tracking-tighter">LIVE</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] font-black text-primary leading-none">SOURCE FEED</span>
            <span className="font-mono text-[7px] text-primary/30 uppercase tracking-tighter">WHO / ReliefWeb Official</span>
          </div>
        </div>
        
        <div className="flex-1 relative h-full flex items-center overflow-hidden group">
          <div className="flex animate-marquee whitespace-nowrap items-center hover:[animation-play-state:paused]">
            {[...(reports && reports.length > 0 ? reports : feed), ...(reports && reports.length > 0 ? reports : feed)].map((item: any, i) => (
              <a 
                key={`${item.id || i}-${i < (reports?.length || feed.length) ? '1' : '2'}`} 
                href={item.url || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 group/item hover:bg-primary/10 px-4 py-1.5 rounded transition-all border border-transparent hover:border-primary/20 mr-8"
              >
                <span className={`font-mono text-[8px] px-2 py-0.5 rounded font-black shadow-[0_0_5px_rgba(0,0,0,0.5)] ${
                  item.type === 'CRITICAL' || !item.type ? 'bg-secondary text-background glow-pink' :
                  item.type === 'WARNING' ? 'bg-accent text-background' :
                  'bg-primary text-background glow-green'
                }`}>
                  {item.type || "REPORT"}
                </span>
                <span className="font-mono text-[10px] text-primary/80 group-hover/item:text-primary group-hover/item:glow-green transition-all uppercase tracking-tight font-bold">
                  {item.title || item.text}
                </span>
                <span className="font-mono text-[8px] text-primary/30 flex items-center space-x-1">
                  <span>[{mounted ? (item.date ? new Date(item.date).toLocaleTimeString() : item.timestamp) : "--:--"}]</span>
                  <ExternalLink size={8} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* System Pulse */}
      <div className="px-6 flex items-center space-x-4 shrink-0">
        <div className="flex items-center space-x-2">
          <Activity size={14} className="text-primary" />
          <span className="font-mono text-[9px] text-primary/60 uppercase">System Latency: 12ms</span>
        </div>
        <div className="w-px h-6 bg-primary/10" />
        <div className="flex items-center space-x-2">
          <ShieldCheck size={14} className="text-primary" />
          <span className="font-mono text-[9px] text-primary/60 uppercase">Encrypted</span>
        </div>
      </div>

    </footer>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center space-x-2 group cursor-help">
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_5px_currentColor]`} />
      <span className={`font-mono text-[10px] ${color.replace('bg-', 'text-')} opacity-70 group-hover:opacity-100 transition-opacity`}>
        {label}
      </span>
    </div>
  );
}
