"use client";

import { INITIAL_STATS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Copy, Check, BarChart3, TrendingUp, RefreshCw } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import { TOKEN_CONFIG, formatCurrency, formatPrice } from "@/lib/token-config";

interface HeaderProps {
  stats: typeof INITIAL_STATS;
  lastUpdated?: Date;
}

function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={cn("font-mono text-sm font-bold leading-none", color)}>{display}</motion.span>;
}
export default function Header({ stats, lastUpdated }: HeaderProps) {
  const token = useTokenData();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_CONFIG.TOKEN_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-24 border-b border-primary/30 flex flex-col justify-between bg-background/50 backdrop-blur-md z-50">
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <h1 className="font-mono text-xl font-bold glow-green tracking-tighter leading-none">
              HANTA GRAVITY LIVE
            </h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className="font-mono text-[9px] text-primary/40">EMERGENCY RESPONSE PROTOCOL v4.2</span>
              {mounted && lastUpdated && (
                <span className="font-mono text-[8px] text-secondary/60 animate-pulse uppercase tracking-wider">
                  Last Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          
          {/* DexScreener Style Widget (Elite Polish) */}
          <div className="hidden lg:flex items-center space-x-4 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2 shadow-[inset_0_0_20px_rgba(0,255,159,0.05)] border-b-2 border-b-primary/30 relative overflow-hidden">
            {token.loading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <RefreshCw size={14} className="text-primary animate-spin" />
              </div>
            )}
            <div className="flex flex-col border-r border-primary/10 pr-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00ff9f]" />
                <span className="font-mono text-[10px] text-primary/60 font-black tracking-widest uppercase flex items-center gap-1">
                  HANTA_INDEX 
                  <span className="w-1 h-1 rounded-full bg-primary animate-ping" />
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base text-primary font-black tracking-tight">
                  ${formatPrice(token.priceUsd)}
                </span>
                <span className={cn(
                  "font-mono text-[9px] px-1.5 py-0.5 rounded font-black border flex items-center gap-0.5",
                  token.priceChange24h >= 0 ? "text-primary bg-primary/10 border-primary/20" : "text-secondary bg-secondary/10 border-secondary/20"
                )}>
                  {token.priceChange24h >= 0 ? "▲" : "▼"} {Math.abs(token.priceChange24h).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-primary/40 uppercase font-bold tracking-tighter">24H VOLUME</span>
                  <span className="font-mono text-[10px] text-primary/80 font-black">{formatCurrency(token.volume24h)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-primary/40 uppercase font-bold tracking-tighter">LIQUIDITY</span>
                  <span className="font-mono text-[10px] text-primary/80 font-black">{formatCurrency(token.liquidity)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-primary/40 uppercase font-bold tracking-tighter">MCAP / FDV</span>
                  <span className="font-mono text-[10px] text-primary/80 font-black">{formatCurrency(token.fdv)}</span>
                </div>
              </div>
              <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary animate-[shimmer_2s_infinite]" 
                  style={{ width: `${60 + Math.random() * 20}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a 
            href={TOKEN_CONFIG.BUY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-secondary/20 px-5 py-2 border border-secondary/50 rounded-lg hover:bg-secondary/30 transition-all cursor-pointer group shadow-[0_0_20px_rgba(255,0,170,0.3)] hover:shadow-[0_0_30px_rgba(255,0,170,0.5)] active:scale-95 animate-pulse-gentle"
          >
            <TrendingUp size={14} className="text-secondary group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[11px] text-secondary font-black group-hover:glow-pink transition-all tracking-[0.1em] uppercase">BUY $HANTA</span>
          </a>
          
          <button 
            onClick={copyToClipboard}
            className="flex items-center space-x-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-4 py-2 rounded-lg font-mono text-[10px] text-primary transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span className="opacity-60 group-hover:opacity-100 uppercase font-bold tracking-wider">CA: {TOKEN_CONFIG.TOKEN_CA.slice(0, 4)}...{TOKEN_CONFIG.TOKEN_CA.slice(-4)}</span>
            {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} className="text-primary opacity-50 group-hover:opacity-100" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-primary/10 h-12 divide-x divide-primary/10">
        <StatBlock label="TOTAL" value={stats.total} color="text-primary" />
        <StatBlock label="DECEASED" value={stats.deceased} color="text-secondary" />
        <StatBlock label="CONFIRMED" value={stats.confirmed} color="text-accent" />
        <StatBlock label="SUSPECTED" value={stats.suspected} color="text-suspected" />
        <StatBlock label="MONITORING" value={stats.monitoring} color="text-primary" />
        <StatBlock label="LOCATIONS" value={stats.locations} color="text-primary" />
        <StatBlock label="CFR %" value={stats.cfr} isString color="text-secondary" />
      </div>
    </header>
  );
}

function StatBlock({ label, value, color, isString }: { label: string; value: number | string; color: string; isString?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors group cursor-default">
      <span className="font-mono text-[8px] text-primary/40 leading-none mb-1 group-hover:text-primary/60 transition-colors uppercase tracking-[0.2em] font-bold">{label}</span>
      {isString ? (
        <span className={cn("font-mono text-sm font-black leading-none tracking-tight", color)}>{value}</span>
      ) : (
        <AnimatedCounter value={value as number} color={color} />
      )}
    </div>
  );
}
