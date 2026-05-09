import { useSyncExternalStore } from "react";
import { Case } from "@/lib/data";
import { cn } from "@/lib/utils";
import { User, MapPin, Anchor, Link as LinkIcon, Info } from "lucide-react";

interface CaseProfileProps {
  selectedCase: Case | null;
}

export default function CaseProfile({ selectedCase }: CaseProfileProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!selectedCase) {
    return (
      <div className="w-80 h-full bg-background/80 border-r border-primary/20 p-4 flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 scanline-slow opacity-10 pointer-events-none" />
        <div className="font-mono text-[10px] text-primary/30 animate-pulse tracking-[0.3em]">
          WAITING FOR SELECTION...<br/>
          [SCANNING NETWORK]
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-background/40 backdrop-blur-xl border-r border-primary/20 flex flex-col overflow-y-auto relative glass-panel">
      {/* Local Scanline Effect */}
      <div className="absolute inset-0 scanline opacity-[0.05] pointer-events-none z-10" />
      
      <div className="p-5 border-b border-primary/20 bg-primary/5 relative z-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-primary/60 tracking-[0.2em] uppercase">BIO-PROFILE</span>
          </div>
          <span className="font-mono text-[10px] bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 font-bold rounded shadow-[0_0_10px_rgba(0,255,159,0.1)]">
            #{selectedCase.number}
          </span>
        </div>
        <h2 className="font-mono text-2xl font-black glow-green uppercase tracking-tighter mb-1">{selectedCase.location}</h2>
        <div className={cn("font-mono text-[10px] font-bold px-2 py-1 inline-block rounded border transition-colors shadow-sm uppercase tracking-widest", 
          (selectedCase.status === 'CONFIRMED' || selectedCase.status === 'DECEASED') ? 'bg-secondary/20 text-secondary border-secondary/40 shadow-[0_0_10px_rgba(255,0,170,0.2)]' :
          selectedCase.status === 'SUSPECTED' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 shadow-[0_0_10px_rgba(255,255,0,0.2)]' :
          'bg-primary/20 text-primary border-primary/40 shadow-[0_0_10px_rgba(0,255,159,0.2)]'
        )}>
          {selectedCase.status}
        </div>
      </div>

      <div className="p-5 space-y-8 relative z-20">
        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 group hover:border-primary/30 transition-all">
            <div className="flex items-center space-x-2 mb-1">
              <User size={10} className="text-primary/60" />
              <span className="font-mono text-[8px] text-primary/40 uppercase font-bold tracking-widest">Demographics</span>
            </div>
            <div className="font-mono text-xs text-primary font-bold">{selectedCase.sex} / {selectedCase.age}Y</div>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 group hover:border-primary/30 transition-all">
            <div className="flex items-center space-x-2 mb-1">
              <Anchor size={10} className="text-primary/60" />
              <span className="font-mono text-[8px] text-primary/40 uppercase font-bold tracking-widest">Vessel</span>
            </div>
            <div className="font-mono text-xs text-primary font-bold truncate">{selectedCase.ship.split(' ')[1]}</div>
          </div>
        </div>

        {/* Detailed Data */}
        <div className="space-y-4">
          <div className="group">
            <div className="flex items-center space-x-2 mb-1.5">
              <MapPin size={12} className="text-primary/40 group-hover:text-primary transition-colors" />
              <span className="font-mono text-[9px] text-primary/40 group-hover:text-primary/60 transition-colors uppercase font-black tracking-wider">Coordinates</span>
            </div>
            <div className="font-mono text-[11px] text-primary bg-primary/5 p-2 rounded border border-primary/10 font-bold tracking-widest">
              {selectedCase.coordinates}
            </div>
          </div>

          <div className="group">
            <div className="flex items-center space-x-2 mb-1.5">
              <LinkIcon size={12} className="text-primary/40 group-hover:text-primary transition-colors" />
              <span className="font-mono text-[9px] text-primary/40 group-hover:text-primary/60 transition-colors uppercase font-black tracking-wider">Primary Data Source</span>
            </div>
            <div className="font-mono text-[11px] text-primary/80 bg-primary/5 p-2 rounded border border-primary/10 flex justify-between items-center">
              <span>{selectedCase.source}</span>
              <span className="text-[8px] text-primary/30">[LINK]</span>
            </div>
          </div>
        </div>

        {/* Notes Section with Pulse Indicator */}
        <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary animate-ping opacity-20" />
          <div className="font-mono text-[9px] text-primary/40 mb-2.5 flex items-center font-black uppercase tracking-[0.1em]">
            <Info size={10} className="mr-1.5" /> Incident Log Entry
          </div>
          <p className="font-mono text-[11px] text-primary/90 leading-relaxed italic">
            &quot;{selectedCase.details}&quot;
          </p>
          <div className="mt-3 font-mono text-[8px] text-primary/20 text-right uppercase">
            Captured: {mounted ? new Date(selectedCase.timestamp).toLocaleTimeString() : "--:--:--"}
          </div>
        </div>

        {/* Local Network */}
        <div className="pt-2 border-t border-primary/10">
          <div className="font-mono text-[9px] text-primary/30 mb-3 uppercase tracking-widest font-bold">Sector Cluster Activity</div>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-primary/5 border border-primary/10 rounded-lg group cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 rounded-sm bg-primary/30 group-hover:bg-primary transition-colors" />
                  <span className="font-mono text-[10px] text-primary/70 font-bold">CASE #00{selectedCase.number + i}</span>
                </div>
                <span className="font-mono text-[8px] text-primary/20 group-hover:text-primary/60 transition-colors">DEEP_SCAN</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Visual Detail */}
      <div className="mt-auto p-4 border-t border-primary/10 bg-primary/5 opacity-50">
        <div className="flex justify-between items-center mb-1">
          <div className="h-0.5 w-12 bg-primary/20" />
          <span className="font-mono text-[8px] text-primary/20">END_OF_PROFILE</span>
          <div className="h-0.5 w-12 bg-primary/20" />
        </div>
      </div>
    </div>
  );
}
