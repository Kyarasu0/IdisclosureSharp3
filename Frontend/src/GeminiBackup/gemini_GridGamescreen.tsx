import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, BatteryMedium, Terminal, Globe, Cpu, 
  Lock, Unlock, Shield, Zap, Clock, Activity, 
  Search, Crosshair, Server, Fingerprint, ShieldAlert,
  Signal, Smartphone
} from 'lucide-react';

// ==========================================
// 1. カラー定義 & アニメーション設定
// ==========================================
const COLORS = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  grid: 'rgba(0, 255, 255, 0.05)',
  darkBg: '#050A15',
  cardBg: 'rgba(10, 17, 40, 0.4)',
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      overflow: hidden; /* 画面全体のスクロールを禁止 */
      background-color: ${COLORS.darkBg};
      font-family: 'JetBrains Mono', monospace;
      color: white;
    }

    /* カスタムスクロールバー (カード内部用) */
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.2); border-radius: 10px; }

    /* グリッチ効果 */
    .glitch-hover:hover {
      text-shadow: 2px 0px 0px ${COLORS.magenta}, -2px 0px 0px ${COLORS.cyan};
    }

    /* 走査線 */
    .scanline {
      background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0, 255, 255, 0.03) 50%, rgba(0, 255, 255, 0.03));
      background-size: 100% 4px;
      pointer-events: none;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-in {
      animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    /* ボタンの光沢アニメーション */
    @keyframes shimmer {
      100% { left: 125%; }
    }
    .shimmer-effect {
      position: relative;
      overflow: hidden;
    }
    .shimmer-effect::after {
      content: "";
      position: absolute;
      top: 0; left: -75%; width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
      transform: skewX(-25deg);
      transition: 0.5s;
    }
    .shimmer-effect:hover::after {
      animation: shimmer 0.8s;
    }
  `}</style>
);

// ==========================================
// 2. 背景描画 (CyberBackground)
// ==========================================
const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      const step = 50;
      for (let x = 0; x < width; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

      ctx.fillStyle = COLORS.cyan;
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath(); ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 - dist / 1000})`;
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// ==========================================
// 3. 共通カードコンポーネント
// ==========================================
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; interactive?: boolean; title?: string; icon?: React.ReactNode }> = ({ children, className = "", interactive = false, title, icon }) => (
  <div className={`relative flex flex-col rounded-xl border border-cyan-500/20 bg-[#0a1128]/60 backdrop-blur-md overflow-hidden animate-in ${interactive ? 'hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300' : ''} ${className}`}>
    <div className="absolute inset-0 scanline opacity-20" />
    {/* 装飾角 */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/40" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/40" />
    
    {title && (
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between bg-white/5">
        <span className="text-[10px] font-bold tracking-widest text-cyan-400 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30" />
        </div>
      </div>
    )}
    <div className="relative flex-1 p-4 overflow-hidden flex flex-col">
      {children}
    </div>
  </div>
);

// ==========================================
// 4. コンテンツ・ウィジェット
// ==========================================

// --- タイマー ---
const TimerWidget = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <GlassCard title="MISSION_CLOCK" icon={<Clock size={12}/>}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-baseline space-x-2 font-bold text-white tracking-tighter">
          <span className="text-4xl">{time.getHours().toString().padStart(2, '0')}</span>
          <span className="text-2xl text-cyan-500 animate-pulse">:</span>
          <span className="text-4xl">{time.getMinutes().toString().padStart(2, '0')}</span>
          <span className="text-xl text-cyan-400/60 ml-1">{time.getSeconds().toString().padStart(2, '0')}</span>
        </div>
        <div className="mt-2 text-[9px] text-cyan-500/50">GMT+0900 (JST) // STABLE_CONNECTION</div>
      </div>
    </GlassCard>
  );
};

// --- 充電カード ---
const BatteryWidget = () => (
  <GlassCard title="SYSTEM_ENERGY" icon={<Zap size={12}/>} interactive>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-gray-400">CORE_BATTERY</span>
      <span className="text-sm font-bold text-green-400">82%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
      <div className="h-full bg-gradient-to-r from-cyan-600 to-green-400 w-[82%] shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
    </div>
    <div className="grid grid-cols-2 gap-2 text-[10px]">
      <div className="bg-white/5 p-1 rounded flex items-center"><Smartphone size={10} className="mr-1 text-cyan-500"/> VOLT: 3.8V</div>
      <div className="bg-white/5 p-1 rounded flex items-center"><Activity size={10} className="mr-1 text-cyan-500"/> TEMP: 32°C</div>
    </div>
  </GlassCard>
);

// --- WiFi一覧 ---
const WifiWidget = () => {
  const wifis = [
    { id: 'SECURE_ALPHA', signal: 4, lock: true },
    { id: 'FREE_AIR_PUBLIC', signal: 2, lock: false },
    { id: 'UNKNOWN_HOST_X', signal: 1, lock: true },
    { id: 'GUEST_GATEWAY', signal: 3, lock: true },
    { id: 'NULL_POINTER', signal: 4, lock: true },
  ];
  return (
    <GlassCard title="NETWORK_NODE_SCANNER" icon={<Wifi size={12}/>} className="flex-1">
      <div className="bg-cyan-500/10 p-2 rounded border border-cyan-500/20 mb-3 flex items-center justify-between">
        <div className="text-[10px]">
          <div className="text-cyan-400 opacity-70">ACTIVE_LINK</div>
          <div className="text-white font-bold">BASE_STATION_09</div>
        </div>
        <Signal size={16} className="text-cyan-400" />
      </div>
      <div className="flex-1 overflow-y-auto custom-scroll space-y-1 pr-1">
        {wifis.map((w, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer text-[11px] group transition-colors">
            <div className="flex items-center space-x-2">
              {w.lock ? <Lock size={10} className="text-gray-500 group-hover:text-cyan-400"/> : <Unlock size={10} className="text-red-500"/>}
              <span className="text-gray-300 group-hover:text-white">{w.id}</span>
            </div>
            <div className="flex space-x-0.5">
              {[...Array(4)].map((_, j) => (
                <div key={j} className={`w-1 h-2 ${j < w.signal ? 'bg-cyan-400' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// --- ブラウザ (中央) ---
const BrowserWidget = () => (
  <GlassCard title="WEBBROWSER_V1.0.4" icon={<Globe size={12}/>} className="h-full">
    <div className="flex space-x-2 mb-4">
      <div className="flex-1 flex items-center bg-black/40 rounded-lg px-3 py-1.5 border border-cyan-500/20">
        <Search size={14} className="text-cyan-500 mr-2" />
        <input type="text" defaultValue="https://internal.target-corp.net/admin" className="bg-transparent border-none outline-none text-xs text-cyan-100 w-full font-mono" />
      </div>
      <button className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
        <Crosshair size={16} />
      </button>
    </div>
    
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <ShieldAlert size={80} className="text-cyan-500/20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Terminal size={32} className="text-cyan-400" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold glitch-hover cursor-default">AUTHENTICATION_REQUIRED</h2>
        <p className="text-[11px] text-gray-500 mt-2 max-w-xs">Brute force sequence ready. Proxies established via 14 nodes. Awaiting manual override.</p>
      </div>
      <button className="shimmer-effect bg-cyan-900/30 border border-cyan-400 px-8 py-3 rounded-full text-xs font-bold text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 uppercase tracking-widest">
        Start Injection
      </button>
    </div>

    <div className="mt-4 p-3 bg-black/40 rounded-lg border border-cyan-500/10">
      <div className="text-[9px] text-cyan-500 font-bold mb-2">INSPECTION_HISTORY</div>
      <div className="space-y-1 text-[10px] font-mono">
        <div className="flex justify-between text-green-400/70"><span>{'>'} cookie_stealer.js</span><span>LOADED</span></div>
        <div className="flex justify-between text-cyan-400/70"><span>{'>'} bypass_v3.exe</span><span>READY</span></div>
      </div>
    </div>
  </GlassCard>
);

// --- ネットワークノード ---
const NetworkWidget = () => (
  <GlassCard title="CONNECTION_NODES" icon={<Server size={12}/>} interactive>
    <div className="space-y-3">
      <div className="flex items-center space-x-3 p-2 rounded bg-white/5 border border-white/5">
        <Cpu size={14} className="text-blue-400" />
        <div>
          <div className="text-[8px] text-gray-500">MY_TERMINAL</div>
          <div className="text-xs font-bold text-white tracking-wider">127.0.0.1:8080</div>
        </div>
      </div>
      <div className="flex items-center space-x-3 p-2 rounded bg-white/5 border border-white/5">
        <Server size={14} className="text-red-400" />
        <div>
          <div className="text-[8px] text-gray-500">TARGET_HOST</div>
          <div className="text-xs font-bold text-white tracking-wider">203.0.113.194</div>
        </div>
      </div>
    </div>
  </GlassCard>
);

// --- 通貨 & ステータス ---
const StatusWidget = () => (
  <GlassCard title="WALLET_STATUS" icon={<Zap size={12}/>}>
    <div className="flex justify-between items-center h-full">
      <div className="flex flex-col">
        <span className="text-[8px] text-gray-500">BLUE_SHARD_BALANCE</span>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-cyan-300">4,120</span>
          <span className="text-[10px] text-cyan-600 font-bold">BS</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[8px] text-gray-500">REWARD_TIER</span>
        <div className="text-xs font-bold text-magenta uppercase tracking-tighter">Gold_Breaker</div>
      </div>
    </div>
  </GlassCard>
);

// --- ログ ---
const LogWidget = () => (
  <GlassCard title="SYSTEM_LOGS" icon={<Terminal size={12}/>} className="flex-1">
    <div className="flex-1 overflow-y-auto custom-scroll font-mono text-[10px] space-y-1.5 opacity-80">
      <div className="text-cyan-500">[14:22:01] Booting neural link...</div>
      <div className="text-cyan-500">[14:22:03] Syncing with satellite B-12...</div>
      <div className="text-red-400">[14:22:05] ERR: Handshake failed at node 7.</div>
      <div className="text-yellow-400">[14:22:06] Rerouting via onion-network...</div>
      <div className="text-green-400">[14:22:09] Connection established. Stealth: 98%</div>
      <div className="text-cyan-500">[14:22:12] Scanning target directory...</div>
      <div className="text-cyan-500 animate-pulse">{'>'} Awaiting command...</div>
    </div>
  </GlassCard>
);

// ==========================================
// 5. メインレイアウト
// ==========================================
export default function App() {
  return (
    <div className="relative w-screen h-screen flex flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <GlobalStyles />
      <CyberBackground />

      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        
        {/* LEFT COLUMN: TITLE + 3-TIER */}
        <div className="flex flex-col space-y-4 min-h-0">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 px-2 py-4">
            <div className="relative">
              <Lock className="text-cyan-400" size={42} />
              <div className="absolute inset-0 blur-lg bg-cyan-400/20" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none">
                <span className="text-magenta">DIS</span>CLOSURE
              </h1>
              <div className="text-[9px] tracking-[0.4em] text-cyan-500/60 uppercase font-bold">Shadow_Hack_OS v3.0</div>
            </div>
          </div>
          {/* 3 Panels */}
          <StatusWidget />
          <NetworkWidget />
          <LogWidget />
        </div>

        {/* MIDDLE COLUMN: FULL BROWSER */}
        <div className="flex flex-col min-h-0">
          <BrowserWidget />
        </div>

        {/* RIGHT COLUMN: 3-TIER (Timer, Battery, Wifi) */}
        <div className="flex flex-col space-y-4 min-h-0">
          <TimerWidget />
          <BatteryWidget />
          <WifiWidget />
        </div>

      </div>

      {/* Footer Decoration */}
      <div className="relative z-10 flex justify-between items-center text-[8px] text-cyan-500/30 font-bold uppercase tracking-widest px-2">
        <span>Unit_ID: 9912-X</span>
        <div className="flex items-center space-x-4">
          <span>Encryption: AES-256</span>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-cyan-500/20" />)}
          </div>
        </div>
      </div>
    </div>
  );
}