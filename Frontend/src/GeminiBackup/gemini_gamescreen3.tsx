import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Battery, 
  Search, 
  Globe, 
  Terminal, 
  Zap, 
  Database,
  Lock,
  ChevronRight,
  Minimize,
  User,
  Radio,
  Cpu,
  ShieldAlert
} from 'lucide-react';

// ==========================================
// 0. Constants & Config
// ==========================================
const COLORS = {
  cyan: '#06b6d4',
  neonCyan: '#00f3ff',
  grid: 'rgba(6, 182, 212, 0.12)',
  pink: '#ec4899',
  yellow: '#eab308',
  slate900: '#0f172a'
};

const APPS = [
  { id: 'decrypt', name: 'DECRYPTOR_V2', icon: Lock, status: 'RUNNING', color: 'text-pink-500' },
  { id: 'netmap', name: 'NET_MAPPER', icon: Globe, status: 'IDLE', color: 'text-cyan-500' },
  { id: 'override', name: 'SYS_OVERRIDE', icon: Terminal, status: 'READY', color: 'text-yellow-500' }
];

const SEARCH_HISTORY = [
  { id: 1, query: "Arasaka_Tower_Blueprint_L4", date: "2026-02-14" },
  { id: 2, query: "bypass_protocol_ice_breaker.exe", date: "2026-02-14" },
  { id: 3, query: "unknown_signal_source_frequency", date: "2026-02-13" },
  { id: 4, query: "NetWatch_agent_list_sector_7", date: "2026-02-12" },
  { id: 5, query: "vintage_cyberdeck_parts_shop", date: "2026-02-10" },
];

const INITIAL_NETWORKS = [
  { id: 1, ssid: "NCPD_SECURE_NET", strength: 80, secure: true, active: false },
  { id: 2, ssid: "Public_Grid_V", strength: 40, secure: false, active: false },
  { id: 3, ssid: "G0st_Signal_Encrypted", strength: 100, secure: true, active: true },
  { id: 4, ssid: "Arasaka_Guest", strength: 60, secure: true, active: false },
];

// ==========================================
// 1. Background Component
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

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Grid
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Particles
      ctx.fillStyle = COLORS.cyan;
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    animate();
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-slate-950" />;
};

// ==========================================
// 2. Components
// ==========================================
const GlassCard = ({ children, className = "", title, subTitle, glow = false }: any) => (
  <div className={`
    relative backdrop-blur-md border rounded flex flex-col overflow-hidden transition-all duration-300 group
    ${glow ? 'bg-slate-900/80 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-slate-900/60 border-slate-700/60 hover:border-cyan-500/30'}
    ${className}
  `}>
    {(title || subTitle) && (
      <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="flex flex-col leading-none">
          {title && <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-100/90">{title}</span>}
          {subTitle && <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{subTitle}</span>}
        </div>
        <div className="flex gap-1">
           <div className="w-1 h-1 bg-slate-600 rounded-full" />
           <div className={`w-1 h-1 rounded-full ${glow ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
        </div>
      </div>
    )}
    <div className="flex-1 overflow-hidden relative p-3">
      {children}
      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/30 rounded-br-sm" />
    </div>
  </div>
);

const MissionTimer = ({ startTime, duration = 600 }: any) => {
  const [remainingSeconds, setRemainingSeconds] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const left = duration - elapsed;
        setRemainingSeconds(left > 0 ? left : 0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, duration]);

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="h-full flex flex-col justify-center items-center relative overflow-hidden bg-black/20 rounded">
      <div className="text-[9px] text-pink-500 font-bold tracking-[0.3em] mb-1 animate-pulse">CONNECTION_LIMIT</div>
      <div className="font-mono text-4xl font-bold text-white tracking-widest relative z-10" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.6)' }}>
        {minutes}<span className="mx-1 text-slate-600">:</span>{seconds}
      </div>
      <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(remainingSeconds / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 3. Main Application
// ==========================================
export default function HackerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [networks, setNetworks] = useState(INITIAL_NETWORKS);
  
  // Fake System Stats
  const systemStats = {
    userName: "Kyarasu",
    userId: "K-9920-X",
    localIP: "192.168.0.42",
    serverIP: "10.244.12.8",
    blueShard: 12540,
    battery: 87,
  };

  const filteredHistory = SEARCH_HISTORY.filter(h => h.query.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleNetworkSelect = (id: number) => {
    setNetworks(networks.map(n => ({ ...n, active: n.id === id })));
  };

  return (
    <div className="w-full h-screen bg-slate-950 overflow-hidden font-mono text-slate-300 selection:bg-cyan-500/30 selection:text-white flex flex-col relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap');
        body { font-family: 'Anonymous Pro', monospace; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>

      {/* Layer 0: Background */}
      <CyberBackground />
      <div className="fixed inset-0 z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      <div className="fixed inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%]" />

      {/* Layer 1: Main Content */}
      <div className="relative z-30 flex flex-col h-full p-4 lg:p-6 gap-4">
        
        {/* Header: Simple Logo Area */}
        <header className="flex-none flex items-center justify-between pb-2 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="p-1.5 border border-cyan-500/50 rounded bg-cyan-950/30">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
             </div>
             <h1 className="text-xl font-bold tracking-tighter text-white">
                IDISCLOSURE <span className="text-yellow-400 text-sm">#3.5</span>
             </h1>
          </div>
          <div className="flex gap-2 text-[10px] uppercase tracking-widest text-slate-500">
             <span>SYS_INTEGRITY: 98%</span>
             <span className="text-slate-700">|</span>
             <span>ENC: AES-256</span>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 grid-rows-6 gap-4 min-h-0">
          
          {/* 1. Profile Card [Top Left] */}
          <GlassCard className="col-span-1 row-span-2" title="User_Identity">
             <div className="flex items-start gap-4 h-full">
                <div className="w-16 h-16 rounded border border-slate-600 bg-slate-800 overflow-hidden relative shrink-0">
                  <img src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="User" />
                  <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />
                </div>
                <div className="flex flex-col justify-between h-full py-1">
                   <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Codename</div>
                      <div className="text-lg font-bold text-white leading-none">{systemStats.userName}</div>
                      <div className="text-[10px] text-cyan-500 font-bold mt-1">{systemStats.userId}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-[9px] gap-2">
                         <span className="text-slate-500">LOC_IP:</span>
                         <span className="text-slate-300 font-mono">{systemStats.localIP}</span>
                      </div>
                      <div className="flex justify-between text-[9px] gap-2">
                         <span className="text-slate-500">SVR_IP:</span>
                         <span className="text-pink-400 font-mono">{systemStats.serverIP}</span>
                      </div>
                   </div>
                </div>
             </div>
          </GlassCard>

          {/* 2. WiFi Manager [Top Mid-Left] */}
          <GlassCard className="col-span-1 row-span-2" title="Network_Interface" subTitle="Select Access Point">
             <div className="space-y-1 h-full overflow-y-auto custom-scrollbar pr-1">
                {networks.map((net) => (
                   <div 
                      key={net.id} 
                      onClick={() => handleNetworkSelect(net.id)}
                      className={`
                         flex items-center justify-between p-2 rounded cursor-pointer border transition-all
                         ${net.active 
                            ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
                            : 'bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-700'}
                      `}
                   >
                      <div className="flex items-center gap-2 overflow-hidden">
                         <div className={`p-1 rounded-full ${net.active ? 'text-cyan-400' : 'text-slate-600'}`}>
                            <Wifi className="w-3.5 h-3.5" />
                         </div>
                         <div className="flex flex-col min-w-0">
                            <span className={`text-[10px] font-bold truncate ${net.active ? 'text-cyan-100' : 'text-slate-400'}`}>
                               {net.ssid}
                            </span>
                            <span className="text-[9px] text-slate-600 uppercase">
                               {net.secure ? 'Encrypted' : 'Open'} • {net.strength}%
                            </span>
                         </div>
                      </div>
                      {net.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />}
                   </div>
                ))}
             </div>
          </GlassCard>

          {/* 3. Resources (Battery & Currency) [Top Mid-Right] */}
          <div className="col-span-1 row-span-2 flex flex-col gap-4">
             {/* Currency */}
             <GlassCard className="flex-1 justify-center" glow>
                <div className="flex items-center justify-between px-2">
                   <div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Blue_Shard</div>
                      <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-1" style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}>
                         {systemStats.blueShard.toLocaleString()}
                         <span className="text-[10px] text-cyan-500 font-normal">BSH</span>
                      </div>
                   </div>
                   <Database className="w-8 h-8 text-cyan-500/20" />
                </div>
             </GlassCard>
             
             {/* Battery */}
             <GlassCard className="flex-1 justify-center">
                <div className="flex items-center justify-between px-2">
                   <div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Power_Cell</div>
                      <div className="flex items-center gap-2">
                        <div className={`text-xl font-bold font-mono ${systemStats.battery > 20 ? 'text-emerald-400' : 'text-red-500'}`}>
                           {systemStats.battery}%
                        </div>
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                           <div className={`h-full ${systemStats.battery > 20 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${systemStats.battery}%` }} />
                        </div>
                      </div>
                   </div>
                   <Zap className={`w-6 h-6 ${systemStats.battery > 20 ? 'text-emerald-500/20' : 'text-red-500/20'}`} />
                </div>
             </GlassCard>
          </div>

          {/* 4. Timer [Top Right] */}
          <GlassCard className="col-span-1 row-span-2" title="Time_Remaining">
             <MissionTimer startTime={new Date()} duration={3600} />
          </GlassCard>

          {/* 5. App Launcher [Bottom Left Sidebar] */}
          <GlassCard className="col-span-1 row-span-4" title="System_Apps">
             <div className="space-y-2 mt-2">
                {APPS.map((app) => (
                  <div key={app.id} className="group relative p-3 bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/40 hover:border-cyan-500/30 transition-all cursor-pointer rounded flex items-center gap-3 overflow-hidden">
                     <div className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all ${app.status === 'RUNNING' ? 'bg-pink-500 h-full' : 'bg-transparent h-0 group-hover:h-full group-hover:bg-slate-500'}`} />
                     <div className={`p-2 rounded bg-slate-900 ${app.color} bg-opacity-10`}>
                        <app.icon className={`w-5 h-5 ${app.color}`} />
                     </div>
                     <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{app.name}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wide">{app.status}</div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-700 absolute right-2 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))}
                
                <div className="mt-4 p-4 border border-dashed border-slate-700/50 rounded flex flex-col items-center text-center gap-2 group cursor-pointer hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all">
                   <Cpu className="w-6 h-6 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                   <span className="text-[9px] text-slate-500 uppercase">Install Module</span>
                </div>
             </div>
          </GlassCard>

          {/* 6. Browser [Bottom Right Main Area] */}
          <GlassCard className="col-span-1 md:col-span-3 row-span-4" title="HyperText_Browser" subTitle="Secure Connection">
             <div className="flex flex-col h-full bg-slate-950/30 rounded border border-slate-800/50">
                {/* Browser Toolbar */}
                <div className="flex items-center gap-3 p-3 border-b border-slate-800/50 bg-slate-900/50">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                   </div>
                   <div className="flex-1 relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                         type="text" 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         placeholder="https://darknet.index/search?q=..."
                         className="w-full bg-slate-950 border border-slate-700 rounded h-8 pl-9 pr-3 text-xs text-cyan-100 focus:border-cyan-500/50 focus:outline-none transition-colors"
                      />
                   </div>
                   <div className="px-2 py-1 bg-slate-800 rounded text-[9px] text-emerald-400 border border-emerald-900/50 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> SECURE
                   </div>
                </div>

                {/* Browser Content */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                   <div className="text-xs text-slate-500 mb-4 uppercase tracking-widest font-bold">Search Results_</div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredHistory.map((item) => (
                         <div key={item.id} className="p-3 bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800 transition-all cursor-pointer group rounded">
                            <div className="flex items-start justify-between mb-1">
                               <div className="text-xs text-cyan-400 font-bold group-hover:underline truncate pr-2">{item.query}</div>
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-pink-500 transition-colors" />
                            </div>
                            <div className="text-[10px] text-slate-500 flex justify-between">
                               <span>ID: {item.id.toString().padStart(4, '0')}</span>
                               <span>{item.date}</span>
                            </div>
                         </div>
                      ))}
                      {filteredHistory.length === 0 && (
                         <div className="col-span-2 py-12 text-center text-slate-600 border border-dashed border-slate-800 rounded">
                            NO MATCHING DATA FOUND
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </GlassCard>

        </main>
      </div>
    </div>
  );
}