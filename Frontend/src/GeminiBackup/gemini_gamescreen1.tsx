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
  ChevronRight
} from 'lucide-react';

// ==========================================
// 0. Global Constants & Types
// ==========================================
const COLORS = {
  cyan: '#06b6d4', // cyan-500 equivalent
  neonCyan: '#00f3ff',
  grid: 'rgba(6, 182, 212, 0.15)',
  pink: '#ec4899',
  yellow: '#eab308'
};

const APPS_DATA = [
  { id: 1, name: 'DECRYPTOR', icon: <Lock className="w-6 h-6" />, status: 'ACTIVE' },
  { id: 2, name: 'NET_MAP', icon: <Globe className="w-6 h-6" />, status: 'IDLE' },
  { id: 3, name: 'TERMINAL', icon: <Terminal className="w-6 h-6" />, status: 'SUSPENDED' },
];

const WIFI_NETWORKS = [
  { ssid: 'Skynet_Global', signal: 80, secure: true },
  { ssid: 'Area_51_Guest', signal: 45, secure: true },
  { ssid: 'Unknown_Signal', signal: 20, secure: false },
];

const SEARCH_HISTORY_MOCK = [
  { id: 1, query: 'How to bypass firewall level 5', time: '10:02' },
  { id: 2, query: 'BlueShard exchange rate', time: '09:45' },
  { id: 3, query: 'Server 192.168.X.X vulnerability', time: '09:12' },
];

// ==========================================
// 1. Background Component (Based on user code)
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
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Grid
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Particles
      ctx.fillStyle = COLORS.neonCyan;
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / 150})`;
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
// 2. Timer Component (Based on user code - Tailwind Version)
// ==========================================
interface DurationDisplayProps {
  label?: string;
  startTime?: Date;
  duration?: number;
}

const DurationDisplay: React.FC<DurationDisplayProps> = ({
  label = "MISSION_DURATION",
  startTime,
  duration = 600,
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let remainingSeconds = duration;
  if (startTime) {
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    remainingSeconds = duration - elapsed;
  }
  if (remainingSeconds < 0) remainingSeconds = 0;

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="relative p-1 bg-slate-900/80 border border-cyan-900/50 rounded-lg overflow-hidden group hover:border-cyan-500/50 transition-colors duration-500">
       {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <div className="text-[10px] tracking-[0.2em] text-cyan-600 mb-1 font-bold">{label}</div>
        <div className="flex items-baseline space-x-2 text-4xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
          <span>{minutes}</span>
          <span className="animate-pulse">:</span>
          <span>{seconds}</span>
        </div>
        <div className="text-[9px] text-cyan-700/80 mt-2 tracking-wider animate-pulse">
          MISSION TIMER ACTIVE
        </div>
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
};

// ==========================================
// 3. UI Components
// ==========================================

const GlassCard = ({ children, className = "", title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: React.ElementType }) => (
  <div className={`relative backdrop-blur-md bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg ${className}`}>
    {title && (
      <div className="flex items-center space-x-2 px-4 py-3 border-b border-slate-700/50 bg-slate-900/40">
        {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
        <span className="text-xs font-bold text-cyan-300 tracking-wider uppercase">{title}</span>
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
    {/* Decorative line */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
  </div>
);

const StatItem = ({ label, value, colorClass = "text-white" }: { label: string, value: string, colorClass?: string }) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</span>
    <span className={`text-sm font-mono font-bold ${colorClass}`}>{value}</span>
  </div>
);

const ProgressBar = ({ value, color = "bg-cyan-500" }: { value: number, color?: string }) => (
  <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
    <div className={`h-full ${color} shadow-[0_0_10px_currentColor]`} style={{ width: `${value}%` }} />
  </div>
);

// ==========================================
// 4. Main Application
// ==========================================
export default function HackerDashboard() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [missionStartTime] = useState<Date>(new Date()); // Timer starts from load
  const [connectedWifiIndex, setConnectedWifiIndex] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update time
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-mono selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Load Anonymous Pro Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap');
        body { font-family: 'Anonymous Pro', monospace; }
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .neon-text-cyan { text-shadow: 0 0 5px rgba(6, 182, 212, 0.8); }
        .neon-text-pink { text-shadow: 0 0 5px rgba(236, 72, 153, 0.8); }
        .scanline {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
        }
      `}</style>

      {/* Background */}
      <CyberBackground />
      
      <div className="relative z-10 flex flex-col h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* === Header === */}
        <header className="flex justify-between items-end mb-8 border-b border-slate-800/60 pb-4">
          {/* Logo Area */}
          <div className="flex items-center space-x-4 group">
            <div className="relative w-12 h-12 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)]">
               <Lock className="w-6 h-6 text-cyan-400 animate-pulse" />
               <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
                <span className="text-pink-500 neon-text-pink">I</span>
                <span className="text-cyan-400 neon-text-cyan">disclosure</span> 
                <span className="text-yellow-400 ml-2">#3</span>
              </h1>
              <span className="text-[10px] text-slate-500 tracking-[0.3em] uppercase group-hover:text-cyan-600 transition-colors">System Breach Protocol</span>
            </div>
          </div>

          {/* System Status Top Right */}
          <div className="flex items-center space-x-6 text-xs md:text-sm">
            {/* Wifi Selector */}
            <div className="flex flex-col items-end">
                <div className="flex space-x-1 mb-1">
                   {[0,1,2].map(i => (
                     <div 
                      key={i} 
                      className={`h-1 w-3 rounded-full ${connectedWifiIndex === i ? 'bg-cyan-400 shadow-[0_0_8px_currentColor]' : 'bg-slate-700'}`}
                     />
                   ))}
                </div>
                <div className="flex items-center space-x-2 text-cyan-300">
                    <Wifi className="w-4 h-4" />
                    <span>{WIFI_NETWORKS[connectedWifiIndex].ssid}</span>
                </div>
            </div>

            {/* Battery */}
            <div className="flex items-center space-x-2 text-emerald-400">
               <div className="text-right">
                 <div className="leading-none">{batteryLevel}%</div>
                 <div className="text-[9px] text-slate-500">PWR</div>
               </div>
               <Battery className="w-5 h-5" />
            </div>

            {/* Time */}
            <div className="text-right">
                <div className="text-xl font-bold text-slate-100 font-mono">{currentTime}</div>
                <div className="text-[9px] text-slate-500 tracking-wider">TOKYO-03</div>
            </div>
          </div>
        </header>

        {/* === Main Grid === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-y-auto pb-4">
          
          {/* Left Column (Stats & App List) - 3 Cols */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
             
             {/* Connection Info */}
             <GlassCard title="CONNECTION_INFO" icon={Server}>
                <div className="space-y-4">
                   <div className="bg-slate-950/50 p-3 rounded border border-slate-800 flex justify-between items-center">
                      <StatItem label="LOCAL IP" value="192.168.0.42" />
                      <Monitor className="w-4 h-4 text-slate-600" />
                   </div>
                   <div className="bg-slate-950/50 p-3 rounded border border-slate-800 flex justify-between items-center">
                      <StatItem label="TARGET SERVER" value="10.24.89.201" colorClass="text-pink-400" />
                      <Globe className="w-4 h-4 text-pink-700" />
                   </div>
                </div>
             </GlassCard>

             {/* Currency */}
             <GlassCard className="bg-gradient-to-br from-slate-900/80 to-blue-900/20">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs text-cyan-600 font-bold uppercase tracking-widest">Blue Shard</span>
                   <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                  10,000
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                   WALLET SYNCED
                </div>
             </GlassCard>

             {/* App List */}
             <GlassCard title="ACTIVE_MODULES" icon={Cpu} className="flex-1">
                <div className="space-y-3">
                   {APPS_DATA.map((app) => (
                     <div key={app.id} className="group relative p-3 bg-slate-950/40 hover:bg-cyan-900/20 border border-slate-800 hover:border-cyan-500/50 rounded transition-all duration-300 cursor-pointer flex items-center justify-between overflow-hidden">
                        <div className="flex items-center space-x-3 relative z-10">
                           <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
                             {app.icon}
                           </div>
                           <div>
                             <div className="text-sm font-bold text-slate-300 group-hover:text-white">{app.name}</div>
                             <div className="text-[10px] text-slate-600 group-hover:text-cyan-300">{app.status}</div>
                           </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all" />
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                   ))}
                </div>
             </GlassCard>
          </div>

          {/* Center/Right Column (Browser & Timer) - 9 Cols */}
          <div className="lg:col-span-9 grid grid-rows-[auto_1fr] gap-6">
             
             {/* Timer Section - Prominent */}
             <div className="flex justify-between items-center gap-6">
                <div className="flex-1 hidden md:block">
                   <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
                </div>
                <div className="w-full md:w-auto min-w-[300px]">
                   <DurationDisplay startTime={missionStartTime} duration={3600} />
                </div>
                <div className="flex-1 hidden md:block">
                   <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
                </div>
             </div>

             {/* Browser Window */}
             <div className="relative glass-panel rounded-xl overflow-hidden flex flex-col border-t-2 border-t-cyan-500/30 min-h-[400px]">
                {/* Browser Toolbar */}
                <div className="bg-slate-950/60 p-3 border-b border-slate-700/50 flex items-center space-x-4">
                   <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                   </div>
                   <div className="flex-1 bg-slate-900/80 rounded border border-slate-700 flex items-center px-3 py-1.5 focus-within:border-cyan-500/50 transition-colors">
                      <Lock className="w-3 h-3 text-emerald-500 mr-2" />
                      <span className="text-xs text-slate-500 mr-2">https://</span>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search internal database..."
                        className="bg-transparent border-none outline-none text-xs text-cyan-100 w-full placeholder-slate-600 font-mono"
                      />
                      <Search className="w-3 h-3 text-slate-500 ml-2" />
                   </div>
                   <Wifi className="w-4 h-4 text-slate-600" />
                </div>

                {/* Browser Content */}
                <div className="flex-1 p-6 relative">
                   {/* Background Overlay for Browser */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                   {/* Search History */}
                   <div className="max-w-2xl mx-auto mt-10">
                      <div className="text-center mb-12">
                         <h2 className="text-2xl font-bold text-slate-200 mb-2">Internal Knowledge Base</h2>
                         <p className="text-sm text-slate-500">Access restricted to Level 3 Clearance</p>
                      </div>

                      <div className="space-y-2">
                         <div className="text-xs text-slate-500 uppercase mb-4 tracking-wider pl-2">Recent Queries</div>
                         {SEARCH_HISTORY_MOCK.map((item) => (
                           <div key={item.id} className="flex items-center justify-between p-3 rounded hover:bg-slate-800/50 border border-transparent hover:border-slate-700 cursor-pointer transition-all group">
                              <div className="flex items-center space-x-3">
                                 <Clock className="w-4 h-4 text-slate-600 group-hover:text-cyan-500 transition-colors" />
                                 <span className="text-sm text-slate-300 group-hover:text-cyan-100">{item.query}</span>
                              </div>
                              <span className="text-xs text-slate-600 font-mono">{item.time}</span>
                           </div>
                         ))}
                         
                         {/* Fake "Ghost" items for aesthetic */}
                         {[1, 2].map((i) => (
                            <div key={`ghost-${i}`} className="h-10 w-full rounded bg-slate-800/20 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                         ))}
                      </div>
                   </div>

                   {/* Bottom Status Bar of Browser */}
                   <div className="absolute bottom-0 left-0 w-full bg-slate-950/80 border-t border-slate-800 py-1 px-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>TLS 1.3 ENCRYPTED</span>
                      <span>NODE: TOKYO-03</span>
                   </div>
                </div>
             </div>

          </div>
        </div>
        
        {/* Footer/Overlay decorative elements */}
        <div className="fixed bottom-4 right-4 pointer-events-none opacity-50 hidden lg:block">
           <div className="border border-slate-700 p-2 rounded">
              <div className="grid grid-cols-4 gap-1">
                 {[...Array(16)].map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full ${Math.random() > 0.7 ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}