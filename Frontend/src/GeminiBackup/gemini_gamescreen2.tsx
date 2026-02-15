import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Battery, 
  Search, 
  Monitor, 
  Server, 
  Cpu, 
  Terminal, 
  Database, 
  Shield, 
  Globe, 
  Clock,
  Lock,
  ChevronRight,
  Activity,
  Zap,
  HardDrive
} from 'lucide-react';

// ==========================================
// Constants & Types
// ==========================================
const COLORS = {
  cyan: '#06b6d4',
  neonCyan: '#00f3ff',
  grid: 'rgba(6, 182, 212, 0.12)',
  pink: '#ec4899',
  yellow: '#eab308'
};

const LOG_DATA = [
  { id: 1, text: "ACCESS_GRANTED: NODE_TOKYO_03", type: "success" },
  { id: 2, text: "ENCRYPTING_PACKETS... AES-256", type: "info" },
  { id: 3, text: "WARNING: FIREWALL_DETECTION_NEARBY", type: "warn" },
  { id: 4, text: "CONNECTION_STABLE: 124.124.124.124", type: "info" },
];

// ==========================================
// Background Component
// ==========================================
const CyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particles: any[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      ctx.fillStyle = COLORS.neonCyan;
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist / 180)})`;
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-slate-950" />;
};

// ==========================================
// Reusable UI Components
// ==========================================
const WindowFrame = ({ children, title, icon: Icon, className = "", bodyClassName = "" }: any) => (
  <div className={`glass-panel border border-slate-700/40 rounded-lg flex flex-col overflow-hidden relative ${className}`}>
    <div className="flex-none flex items-center justify-between px-3 py-1.5 border-b border-slate-700/40 bg-slate-900/60 backdrop-blur-md">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400" />}
        <span className="text-[10px] font-bold text-cyan-100/70 tracking-[0.15em] uppercase">{title}</span>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full border border-slate-700" />
        <div className="w-2 h-2 rounded-full border border-slate-700 bg-cyan-500/20" />
      </div>
    </div>
    <div className={`p-3 flex-1 overflow-y-auto custom-scrollbar ${bodyClassName}`}>
      {children}
    </div>
    {/* Decorative corner */}
    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-10 h-10 bg-cyan-500/5 rotate-45 border-l border-cyan-500/20" />
    </div>
  </div>
);

const MetricBox = ({ label, value, unit, color = "text-cyan-400" }: any) => (
  <div className="bg-black/20 p-2 rounded border border-slate-800/50">
    <div className="text-[9px] text-slate-500 uppercase mb-1">{label}</div>
    <div className="flex items-baseline space-x-1">
      <span className={`text-lg font-bold font-mono tracking-tight ${color}`}>{value}</span>
      {unit && <span className="text-[9px] text-slate-600">{unit}</span>}
    </div>
  </div>
);

// ==========================================
// Main Dashboard
// ==========================================
export default function HackerDashboard() {
  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('ja-JP', { hour12: false }));
    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-300 overflow-hidden font-mono selection:bg-cyan-500/30 flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap');
        body { font-family: 'Anonymous Pro', monospace; }
        .glass-panel {
          background: rgba(10, 15, 30, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 2px; }
        .neon-glow { text-shadow: 0 0 8px rgba(0, 243, 255, 0.5); }
      `}</style>

      <CyberBackground />
      
      <div className="relative z-10 flex flex-col h-full p-3 gap-3">
        
        {/* TOP BAR - LOGO & SYSTEM STATUS */}
        <div className="flex-none flex items-center justify-between px-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-md border border-cyan-500/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                 <h1 className="text-xl font-bold tracking-tighter text-white">
                  <span className="text-pink-500">I</span>disclosure <span className="text-yellow-400">#3</span>
                 </h1>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">v2.5_Stable</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-bold text-slate-400 uppercase">System: Normal</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white neon-glow">{currentTime}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Global_Clock</div>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-6 gap-3">
          
          {/* USER MONITOR (LEFT TOP) */}
          <WindowFrame title="USER_STATUS_MONITOR" icon={Monitor} className="col-span-12 md:col-span-4 row-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent" />
                <Terminal className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase leading-none mb-1">Authenticated_User</div>
                <div className="text-xl font-bold text-white">Kyarasu</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-bold">Lvl_03_Admin</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MetricBox label="Tokens" value="10,000" unit="BLUE" />
              <MetricBox label="Stability" value="99.9" unit="%" />
            </div>
          </WindowFrame>

          {/* APP MODULES (LEFT BOTTOM) */}
          <WindowFrame title="ACTIVE_MODULES" icon={Cpu} className="col-span-12 md:col-span-4 row-span-4">
            <div className="space-y-2">
              {['DECRYPTOR', 'NET_MAP', 'TERMINAL', 'PACKET_SNIFFER', 'FIREWALL_BREACH'].map((app, i) => (
                <div key={app} className="group flex items-center justify-between p-2.5 bg-slate-900/40 border border-slate-800 rounded hover:border-cyan-500/40 transition-all cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]' : 'bg-slate-700'}`} />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{app}</span>
                  </div>
                  <div className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Ready</div>
                </div>
              ))}
              <div className="pt-2">
                 <div className="h-20 w-full bg-cyan-900/10 border border-dashed border-cyan-900/30 rounded flex items-center justify-center">
                    <span className="text-[10px] text-cyan-800 uppercase tracking-widest">Add_New_Module</span>
                 </div>
              </div>
            </div>
          </WindowFrame>

          {/* BROWSER / MAIN PANEL (CENTER) */}
          <WindowFrame title="HYPERTEXT_PROTOCOL_BROWSER" icon={Globe} className="col-span-12 md:col-span-5 row-span-5" bodyClassName="p-0 flex flex-col">
            <div className="flex-none bg-black/40 p-2 border-b border-slate-800 flex items-center space-x-3">
              <div className="flex-1 bg-slate-950 rounded px-3 py-1.5 flex items-center border border-slate-800">
                <Search className="w-3 h-3 text-slate-600 mr-2" />
                <input 
                  className="bg-transparent border-none outline-none text-[11px] text-cyan-100 w-full"
                  placeholder="https://internal.db/search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex-1 p-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              <div className="mb-6 text-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Knowledge_Base</h3>
                <div className="h-0.5 w-12 bg-cyan-500/40 mx-auto" />
              </div>
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded hover:bg-slate-800/40 transition-colors cursor-pointer group">
                    <div className="text-xs text-cyan-400 font-bold mb-1 group-hover:underline">Subject_Protocol_Delta_{i}0{i}</div>
                    <div className="text-[10px] text-slate-500">Last updated: 2026-02-15 // Classification: SECRET</div>
                  </div>
                ))}
              </div>
            </div>
          </WindowFrame>

          {/* NETWORK INFO (RIGHT TOP) */}
          <WindowFrame title="NETWORK_TELEMETRY" icon={Wifi} className="col-span-12 md:col-span-3 row-span-2">
             <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">SSID:</span>
                  <span className="text-cyan-400 font-bold">Skynet_Global</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-500 w-[82%] shadow-[0_0_10px_#06b6d4]" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center">
                    <div className="text-[9px] text-slate-500 uppercase">Ping</div>
                    <div className="text-sm font-bold text-white">6ms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-slate-500 uppercase">Jitter</div>
                    <div className="text-sm font-bold text-white">1ms</div>
                  </div>
                </div>
             </div>
          </WindowFrame>

          {/* SYSTEM LOGS (RIGHT MID) */}
          <WindowFrame title="SYSTEM_EVENT_LOG" icon={Terminal} className="col-span-12 md:col-span-3 row-span-3">
            <div className="font-mono text-[10px] space-y-2">
              {LOG_DATA.map(log => (
                <div key={log.id} className="flex space-x-2">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}]</span>
                  <span className={log.type === 'warn' ? 'text-pink-500' : 'text-cyan-500'}>{log.text}</span>
                </div>
              ))}
              <div className="flex space-x-2 animate-pulse">
                <span className="text-slate-600">[{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}]</span>
                <span className="text-slate-400">WAITING_FOR_INPUT_</span>
              </div>
            </div>
          </WindowFrame>

          {/* HARD DRIVE (BOTTOM BAR REPLACEMENT) */}
          <WindowFrame title="STORAGE_POOL" icon={HardDrive} className="col-span-12 md:col-span-3 row-span-1" bodyClassName="p-2">
            <div className="flex items-center space-x-3">
               <Database className="w-5 h-5 text-pink-500" />
               <div className="flex-1">
                 <div className="flex justify-between text-[9px] mb-1">
                   <span className="text-slate-500">VOL_01/SSD</span>
                   <span className="text-slate-300">420GB / 512GB</span>
                 </div>
                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 w-[75%]" />
                 </div>
               </div>
            </div>
          </WindowFrame>

          {/* MISSION TIMER (BOTTOM CENTER) */}
          <div className="col-span-12 md:col-span-5 row-span-1 flex items-center justify-center p-2 glass-panel border border-slate-700/40 rounded-lg">
             <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-[9px] text-cyan-600 uppercase font-bold tracking-widest">Mission_Time</div>
                  <div className="text-2xl font-bold text-cyan-400 tracking-widest neon-glow">00:42:15</div>
                </div>
                <div className="h-10 w-[1px] bg-slate-800" />
                <div className="text-center">
                  <div className="text-[9px] text-pink-600 uppercase font-bold tracking-widest">Time_Remaining</div>
                  <div className="text-2xl font-bold text-pink-500 tracking-widest">09:17:45</div>
                </div>
             </div>
          </div>

        </div>
        
        {/* FOOTER STATUS */}
        <div className="flex-none flex items-center justify-between text-[9px] text-slate-600 uppercase tracking-[0.2em] px-2 py-1">
          <div className="flex space-x-4">
            <span>Enc: AES-256-GCM</span>
            <span>Auth: RSA-4096</span>
            <span>Node: JP-TKY-03</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Secure_Link_Established</span>
          </div>
        </div>

      </div>
    </div>
  );
}