// ==========================================
// Awwwards-Winning Hacker Game UI
// ==========================================
// このファイルは、React, Tailwind CSSを使用して構築された
// 心理戦ハッキングゲームの1ペーストで動く完全なLPです。
// コンポーネントごとに機能が分割されており、容易にカスタマイズ可能です。
// ==========================================

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Terminal as TerminalIcon, 
  Timer, 
  Battery, 
  BatteryCharging,
  Wifi, 
  Lock, 
  Unlock, 
  Zap,
  GlobeLock,
  RadioTower,
  Cpu
} from 'lucide-react';

// ==========================================
// 1. カスタムアニメーション & スタイル定義 (CSS-in-JS代用)
// 本来 module.css に記述する内容をここに集約しています。
// ==========================================
const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    /* スクロールバーを隠すユーティリティ */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    /* ターミナル起動時のサイバーな枠広がりアニメーション */
    @keyframes expandWidth {
      0% { width: 0%; opacity: 0; border-color: transparent; }
      50% { width: 100%; height: 2px; opacity: 1; border-color: rgba(6, 182, 212, 1); box-shadow: 0 0 20px rgba(6, 182, 212, 0.8); }
      100% { width: 100%; height: 2px; opacity: 1; border-color: rgba(6, 182, 212, 0.5); }
    }
    @keyframes expandHeight {
      0% { height: 2px; }
      100% { height: 100%; }
    }
    @keyframes fadeInContent {
      0% { opacity: 0; filter: blur(4px); transform: translateY(10px); }
      100% { opacity: 1; filter: blur(0); transform: translateY(0); }
    }

    /* 各種アニメーションクラス */
    .animate-expand-width {
      animation: expandWidth 0.6s cubic-bezier(0.86, 0, 0.07, 1) forwards;
    }
    .animate-expand-height {
      animation: expandHeight 0.6s cubic-bezier(0.86, 0, 0.07, 1) forwards 0.6s;
    }
    .animate-fade-in-content {
      opacity: 0;
      animation: fadeInContent 0.8s ease-out forwards 1.2s;
    }

    /* Bento Gridの要素が下からフワッと浮かび上がる (Fade-in Up) */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .stagger-1 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s; opacity: 0; }
    .stagger-2 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s; opacity: 0; }
    .stagger-3 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.6s; opacity: 0; }
    .stagger-4 { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.8s; opacity: 0; }

    /* CRTモニターのような微細なスキャンライン */
    .scanlines {
      background: linear-gradient(
        to bottom,
        rgba(255,255,255,0),
        rgba(255,255,255,0) 50%,
        rgba(0,0,0,0.1) 50%,
        rgba(0,0,0,0.1)
      );
      background-size: 100% 4px;
    }

    /* === 追加: 発光＆点滅エフェクト === */
    .text-glow {
      text-shadow: 0 0 8px rgba(6, 182, 212, 0.6), 0 0 15px rgba(6, 182, 212, 0.4);
    }
    
    @keyframes flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
      20%, 24%, 55% { opacity: 0.8; text-shadow: none; }
    }
    .animate-flicker {
      animation: flicker 8s infinite;
    }

    @keyframes cyberPulse {
      0% { opacity: 1; filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.8)); }
      50% { opacity: 0.3; filter: drop-shadow(0 0 2px rgba(6, 182, 212, 0.2)); }
      100% { opacity: 1; filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.8)); }
    }
    .animate-cyber-pulse {
      animation: cyberPulse 2.5s infinite ease-in-out;
    }
  `}} />
);

// ==========================================
// 2. 背景コンポーネント (CyberBackground)
// いただいたコードをベースに色味とパフォーマンスを調整
// ==========================================
const CyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // カラーパレット (紺と水色ベース)
    const COLORS = {
      grid: 'rgba(30, 41, 59, 0.3)', // 薄い紺のメッシュ
      cyan: 'rgba(6, 182, 212, 0.6)', // 水色のパーティクル
    };

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 70; // スマホでも重くならない数

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
      
      // グリッド線の描画
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      const gridSize = 60;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // パーティクルとノード線の描画
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = COLORS.cyan;
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
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 - distance / 300})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* ベースの紺色背景 */}
      <div className="fixed inset-0 bg-[#050B14] z-0" />
      {/* アニメーションするキャンバス */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-80" />
      {/* 画面全体の微細なノイズ（質感を高めるAwwwards的テクニック） */}
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
    </>
  );
};

// ==========================================
// 3. 共通Glassmorphismカード (Bento Grid用部品)
// ==========================================
const GlassCard = ({ children, className = "", delayClass = "" }: { children: React.ReactNode, className?: string, delayClass?: string }) => (
  <div className={`
    relative overflow-hidden rounded-3xl
    bg-white/[0.03] backdrop-blur-xl
    border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
    transition-all duration-300 ease-out
    hover:border-cyan-500/30 hover:bg-white/[0.05]
    ${className} ${delayClass}
  `}>
    {/* ガラスの反射ハイライト */}
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    {children}
  </div>
);

// ==========================================
// 4. 左＆中央：ターミナルコンポーネント
// ==========================================
const FILE_SYSTEM: any = {
  "mission": {
    "target_info.txt": "TARGET: Project Chimera\nRISK LEVEL: HIGH\nSTATUS: Active",
    "decrypt_keys": {
      "key_alpha.bin": "[ENCRYPTED DATA]",
      "key_beta.bin": "[ENCRYPTED DATA]"
    }
  },
  "tools": {
    "bruteforce.exe": "[Executable Binary]",
    "network_scanner.sh": "Scanning local area network..."
  }
};

const TerminalWidget = () => {
  const [logs, setLogs] = useState<string[]>([
    "Initialising neural link...",
    "Establishing secure connection...",
    "Connection established. Welcome, Agent.",
    "Type 'help' to view available commands."
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>(["mission"]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 起動アニメーション用のステート
  const [isBooted, setIsBooted] = useState(false);
  useEffect(() => {
    // 枠が広がりきった後(約1.2秒後)に中身を表示
    const timer = setTimeout(() => setIsBooted(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const resolvePath = (path: string[]): any => {
    let current: any = FILE_SYSTEM;
    for (const p of path) {
      if (current && typeof current === 'object' && p in current) current = current[p];
      else return null;
    }
    return current;
  };

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const rawCmd = input.trim();
    const args = rawCmd.split(" ");
    const cmd = args[0].toLowerCase();
    
    const newLogs = [...logs, `root@system:/${cwd.join("/")}# ${rawCmd}`];

    switch (cmd) {
      case "help":
        newLogs.push("COMMANDS: help, ls, cd, cat, clear, hack");
        break;
      case "ls":
        const currentDir = resolvePath(cwd);
        if (typeof currentDir === 'object') {
          const items = Object.keys(currentDir).map(key => typeof currentDir[key] === 'object' ? `<DIR> ${key}` : `      ${key}`);
          newLogs.push(...items);
        } else {
          newLogs.push("Error: Not a directory");
        }
        break;
      case "cd":
        if (!args[1] || args[1] === "/") setCwd([]);
        else if (args[1] === "..") setCwd(prev => prev.slice(0, -1));
        else {
          const targetDir = resolvePath([...cwd, args[1]]);
          if (targetDir && typeof targetDir === 'object') setCwd(prev => [...prev, args[1]]);
          else newLogs.push(`cd: no such directory: ${args[1]}`);
        }
        break;
      case "cat":
        if (!args[1]) newLogs.push("Usage: cat <filename>");
        else {
          const targetFile = resolvePath([...cwd, args[1]]);
          if (typeof targetFile === 'string') newLogs.push(targetFile);
          else newLogs.push(`cat: cannot read: ${args[1]}`);
        }
        break;
      case "clear":
        setLogs([]);
        setInput("");
        return;
      case "hack":
        newLogs.push("ACCESS DENIED. Missing privileges or target network.");
        break;
      default:
        newLogs.push(`command not found: ${cmd}`);
    }
    setLogs(newLogs);
    setInput("");

    // スクロールを最下部に
    requestAnimationFrame(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    });
  };

  return (
    <GlassCard className="h-full flex flex-col p-6 sm:p-8 relative group stagger-1">
      {/* カード右上のアイコン */}
      <div className="absolute top-6 right-6 text-cyan-500/50">
        <TerminalIcon size={24} />
      </div>
      
      {/* ターミナル外枠（サイバー的に広がるアニメーション） */}
      <div className="flex-1 flex items-center justify-center relative w-full h-full">
        {/* アニメーションで広がるコンテナ（ベースを微弱な光に） */}
        <div className="absolute bg-slate-900/60 backdrop-blur-md rounded-lg overflow-hidden flex flex-col animate-expand-width animate-expand-height border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)_inset]">
          
          {/* === 追加: 途切れ途切れのサイバー装飾枠 (起動後に表示) === */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isBooted ? 'opacity-100' : 'opacity-0'}`}>
            {/* 四隅のコーナー (強く光る) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.9)]"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.9)]"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.9)]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.9)]"></div>
            
            {/* 上下の途切れ線 (点滅して光る) */}
            <div className="absolute top-0 left-[15%] right-[15%] border-t border-dashed border-cyan-400/80 animate-cyber-pulse"></div>
            <div className="absolute bottom-0 left-[15%] right-[15%] border-b border-dashed border-cyan-400/80 animate-cyber-pulse"></div>
            
            {/* 左右の短い点線 */}
            <div className="absolute top-[30%] bottom-[30%] left-0 border-l-2 border-dotted border-cyan-500/40"></div>
            <div className="absolute top-[30%] bottom-[30%] right-0 border-r-2 border-dotted border-cyan-500/40"></div>
          </div>

          {/* ターミナル内部コンテンツ（枠が広がった後にフェードイン） */}
          <div className={`flex flex-col h-full w-full p-4 font-mono text-sm sm:text-base text-cyan-400 scanlines text-glow animate-flicker ${isBooted ? 'animate-fade-in-content' : 'opacity-0'}`}>
            {/* ヘッダーバー */}
            <div className="flex justify-between items-center border-b border-dashed border-cyan-500/40 pb-2 mb-4 text-xs tracking-widest text-cyan-400/80 relative z-10">
              <span>ROOT CONSOLE_v2.4.1</span>
              <span className="animate-pulse text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">ONLINE</span>
            </div>

            {/* ログ出力領域 */}
            <div 
              ref={logContainerRef}
              className="flex-1 overflow-y-auto space-y-2 scrollbar-hide pb-4 relative z-10"
            >
              {logs.map((log, i) => (
                <div key={i} className={log.includes("#") ? "text-cyan-100 font-bold mt-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]" : "text-cyan-300/90 whitespace-pre-wrap pl-2 border-l-2 border-cyan-400/60 ml-1 drop-shadow-[0_0_3px_rgba(6,182,212,0.5)]"}>
                  {log}
                </div>
              ))}
            </div>

            {/* 入力フォーム */}
            <form onSubmit={handleCommand} className="mt-auto flex items-center gap-2 pt-3 border-t border-dashed border-cyan-500/40 relative z-10">
              <span className="text-pink-500 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">root@sys:</span>
              <span className="text-cyan-300 font-bold">/{cwd.join("/")}</span>
              <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">#</span>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder-cyan-800/60 focus:ring-0 p-0 ml-2 caret-cyan-400 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                placeholder="Enter command..."
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// ==========================================
// 5. 右上：タイマーコンポーネント
// ==========================================
const TimerWidget = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1時間 (秒)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(p => (p > 0 ? p - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <GlassCard className="p-6 flex items-center justify-between stagger-2">
      <div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-widest mb-1">
          <Timer size={14} className="text-pink-500" />
          SYSTEM LOCK IN
        </div>
        <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tight flex items-baseline">
          {m}<span className="text-cyan-500 mx-1 animate-pulse">:</span>{s}
        </div>
      </div>
      {/* 装飾用のリング */}
      <div className="relative w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center">
        <div 
          className="absolute inset-0 rounded-full border-4 border-pink-500 transition-all duration-1000"
          style={{ clipPath: `polygon(0 0, 100% 0, 100% ${((3600 - timeLeft)/3600)*100}%, 0 ${((3600 - timeLeft)/3600)*100}%)` }}
        />
        <Lock size={20} className="text-pink-500" />
      </div>
    </GlassCard>
  );
};

// ==========================================
// 6. 右中：バッテリー（残充電）コンポーネント
// ==========================================
const BatteryWidget = () => {
  const batteryLevel = 42; // 残充電(%)

  return (
    <GlassCard className="p-6 flex flex-col justify-center stagger-3">
       <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-widest">
          <BatteryCharging size={14} className="text-cyan-400" />
          POWER REMAINING
        </div>
        <span className="text-cyan-400 font-mono font-bold">{batteryLevel}%</span>
      </div>

      {/* バッテリープログレスバー */}
      <div className="h-6 w-full bg-slate-900/50 rounded-full p-1 border border-white/5 relative overflow-hidden">
        {/* バー本体 */}
        <div 
          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full relative"
          style={{ width: `${batteryLevel}%` }}
        >
          {/* サイバーなストライプ柄（ハッカーテイスト） */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]" />
        </div>
      </div>
    </GlassCard>
  );
};

// ==========================================
// 7. 右下：WiFiリストコンポーネント
// ==========================================
const WIFIS = [
  { id: 1, name: "GUEST_NET_FREE", security: "OPEN", signal: 90 },
  { id: 2, name: "CORP_LOCAL_5G", security: "WPA2", signal: 75 },
  { id: 3, name: "HIDDEN_NETWORK", security: "WEP", signal: 40 },
  { id: 4, name: "COFFEE_SHOP_WIFI", security: "OPEN", signal: 30 },
];

const WifiWidget = () => {
  return (
    <GlassCard className="p-6 flex flex-col flex-1 min-h-[250px] stagger-4">
      
      {/* 接続中のネットワーク (一番上のカード的扱い) */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 mb-4 flex items-center justify-between group cursor-pointer hover:bg-cyan-500/20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-full group-hover:scale-110 transition-transform">
            <GlobeLock size={20} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-cyan-400 text-xs font-bold tracking-wider">CONNECTED</div>
            <div className="text-white font-mono font-bold">SECURE_NET_0X</div>
          </div>
        </div>
        <RadioTower size={20} className="text-cyan-400 animate-pulse" />
      </div>

      <div className="text-slate-500 text-xs font-bold tracking-widest mb-3 flex items-center gap-2">
        <Wifi size={14} />
        AVAILABLE NETWORKS
      </div>

      {/* スクロール可能なリスト領域 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pr-2">
        {WIFIS.map((wifi) => (
          <div 
            key={wifi.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <Zap size={16} className={wifi.security === 'OPEN' ? 'text-green-400' : 'text-slate-500'} />
              <div>
                <div className="text-slate-200 text-sm font-mono font-semibold">{wifi.name}</div>
                <div className="text-slate-500 text-[10px] tracking-wider">{wifi.security}</div>
              </div>
            </div>
            {/* 電波強度インジケーター */}
            <div className="flex gap-1 items-end h-4">
              {[1, 2, 3].map((bar) => (
                <div 
                  key={bar} 
                  className={`w-1 rounded-t-sm bg-slate-600 ${wifi.signal > bar * 30 ? (wifi.security === 'OPEN' ? 'bg-green-500' : 'bg-cyan-500') : ''}`}
                  style={{ height: `${bar * 30}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ==========================================
// 8. メイン App コンポーネント (Bento Grid レイアウト)
// ==========================================
export default function App() {
  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      
      {/* スタイルと背景 */}
      <CustomStyles />
      <CyberBackground />

      {/* メインコンテンツエリア (Bento Grid) */}
      <div className="relative z-10 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 h-screen flex flex-col justify-center">
        
        {/* ヘッダー (任意) */}
        <header className="flex justify-between items-center mb-6 px-2 stagger-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu size={24} />
            <h1 className="text-xl font-bold tracking-widest uppercase">Project_Chimera</h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            SYS.VER 9.0.4 // UNAUTHORIZED ACCESS PROTOCOL
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[85vh] lg:h-[75vh]">
          
          {/* 左・中央エリア (ターミナル) */}
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <TerminalWidget />
          </div>
          
          {/* 右エリア (縦3分割) */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full">
            <TimerWidget />
            <BatteryWidget />
            <WifiWidget />
          </div>

        </div>
      </div>
    </div>
  );
}