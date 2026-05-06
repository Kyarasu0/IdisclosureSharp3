import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { 
  Terminal, Shield, Activity, Cpu, Crosshair, 
  Lock, Power, Globe, Database, Zap, Search, Eye, Radio, Cpu as Chip
} from 'lucide-react';

// =================================================================
// 📁 本来の配置: src/styles/GlobalStyles.tsx
// =================================================================
const GlobalStyles = () => (
  <style>{`
    @keyframes iconFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes glint {
      0% { left: -100%; }
      100% { left: 200%; }
    }

    .glass-shimmer {
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
      transform: skewX(-25deg);
      animation: glint 3s infinite;
    }

    .bg-canvas {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      pointer-events: none;
    }
  `}</style>
);

// =================================================================
// 📁 本来の配置: src/components/ui/CyberIcon.tsx
// 役割: サイバーで角の鋭い「ガラス製アプリアイコン」の枠
// =================================================================
type IconVariant = 'diamond' | 'hex' | 'square-cut' | 'bracket';

interface CyberIconProps {
  icon: ReactNode;
  label: string;
  variant?: IconVariant;
  color?: string;
  onClick?: () => void;
}

const CyberIcon = ({ icon, label, variant = 'square-cut', color = '#00f0ff', onClick }: CyberIconProps) => {
  // バリアント（形状）に応じたクリップパスの設定
  const getClipPath = () => {
    switch (variant) {
      case 'diamond': return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      case 'hex': return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
      case 'square-cut': return 'polygon(0 15%, 15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%)';
      case 'bracket': return 'none'; // 通常の矩形に装飾
      default: return 'none';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 active:scale-90"
      style={{ width: '100px' }}
    >
      {/* アイコン背面のグローエフェクト */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />

      {/* ガラス本体の枠 */}
      <div 
        className="relative w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2"
        style={{ 
          clipPath: getClipPath(),
          backgroundColor: 'rgba(6, 11, 23, 0.7)',
          backdropFilter: 'blur(12px)',
          border: variant === 'bracket' ? `1px solid ${color}44` : 'none',
          boxShadow: `inset 0 0 15px ${color}22`
        }}
      >
        {/* ガラスの反射（Shimmer） */}
        <div className="glass-shimmer" />

        {/* 枠線エフェクト（clip-pathを使っている場合、通常のborderが効かないため擬似要素で表現） */}
        <div 
          className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ 
            clipPath: getClipPath(),
            padding: '1.5px', // 線の太さ
            background: `linear-gradient(135deg, ${color}, transparent, ${color})`
          }}
        >
          <div className="w-full h-full" style={{ clipPath: getClipPath(), backgroundColor: 'rgba(6, 11, 23, 0.7)' }} />
        </div>

        {/* 中央のアイコン */}
        <div 
          className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          style={{ color: color }}
        >
          {icon}
        </div>

        {/* コーナー装飾（Bracket variant用） */}
        {variant === 'bracket' && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: color }}></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: color }}></div>
          </>
        )}
      </div>

      {/* ラベル */}
      <span className="mt-3 text-[10px] font-black tracking-widest uppercase opacity-60 group-hover:opacity-100 group-hover:text-cyan-400 transition-all">
        {label}
      </span>
      
      {/* 選択中のインジケーター（ドット） */}
      <div 
        className="w-1 h-1 mt-1 bg-cyan-400 rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_5px_#00f0ff]"
      />
    </div>
  );
};

// =================================================================
// 📁 本来の配置: src/Theme/Backgrounds/MajorCyberBackground.tsx
// =================================================================
const MajorCyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

      ctx.fillStyle = '#00f0ff';
      ctx.strokeStyle = '#00f0ff';
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || width < p.x) p.vx *= -1;
        if (p.y < 0 || height < p.y) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x; const dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - dist/150)})`;
            ctx.stroke();
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
  return <canvas ref={canvasRef} className="bg-canvas" />;
};

// =================================================================
// 📁 メインコンポーネント: App.tsx
// =================================================================
export default function App() {
  const [selectedTool, setSelectedTool] = useState("DECRYPTOR");

  return (
    <div className="min-h-screen bg-[#02050a] text-cyan-50 font-sans selection:bg-cyan-500/30 flex items-center justify-center">
      <GlobalStyles />
      <MajorCyberBackground />

      <div className="relative z-10 w-full max-w-4xl px-8">
        {/* ヘッダーエリア */}
        <div className="mb-12 text-center">
          <div className="inline-block border-y border-cyan-500/30 py-1 px-8 mb-2">
            <span className="text-[10px] tracking-[0.5em] text-cyan-400 font-bold uppercase">Tactical Launcher</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter">SELECT <span className="text-cyan-400">INTERFACE</span></h2>
        </div>

        {/* Bento Grid Layout for Icons */}
        <div className="bg-[#060b17]/40 backdrop-blur-2xl border border-white/5 p-12 relative overflow-hidden">
          {/* 背景の大きな装飾用アイコン */}
          <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
            <Shield size={300} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-8 justify-items-center">
            <CyberIcon 
              variant="square-cut" 
              icon={<Terminal size={24} />} 
              label="Terminal" 
              color="#00f0ff"
              onClick={() => setSelectedTool("TERMINAL")}
            />
            <CyberIcon 
              variant="diamond" 
              icon={<Shield size={24} />} 
              label="Firewall" 
              color="#ff3e3e"
              onClick={() => setSelectedTool("FIREWALL")}
            />
            <CyberIcon 
              variant="hex" 
              icon={<Activity size={24} />} 
              label="Monitor" 
              color="#3eff8b"
              onClick={() => setSelectedTool("MONITOR")}
            />
            <CyberIcon 
              variant="bracket" 
              icon={<Lock size={24} />} 
              label="Decrypt" 
              color="#f0ff00"
              onClick={() => setSelectedTool("DECRYPT")}
            />
            <CyberIcon 
              variant="hex" 
              icon={<Database size={24} />} 
              label="Database" 
              color="#bd3eff"
              onClick={() => setSelectedTool("DATABASE")}
            />
            <CyberIcon 
              variant="square-cut" 
              icon={<Globe size={24} />} 
              label="Network" 
              color="#00f0ff"
              onClick={() => setSelectedTool("NETWORK")}
            />
            <CyberIcon 
              variant="diamond" 
              icon={<Eye size={24} />} 
              label="Observe" 
              color="#ff8b3e"
              onClick={() => setSelectedTool("OBSERVE")}
            />
             <CyberIcon 
              variant="bracket" 
              icon={<Chip size={24} />} 
              label="Hardware" 
              color="#00ffcc"
              onClick={() => setSelectedTool("HARDWARE")}
            />
          </div>

          {/* 下部のステータス表示 */}
          <div className="mt-16 flex justify-between items-center border-t border-white/10 pt-6">
            <div className="flex gap-4 items-center">
               <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
               <span className="text-[10px] font-mono opacity-50">STATUS: READY_TO_LAUNCH</span>
            </div>
            <div className="text-[10px] font-mono text-cyan-400 border border-cyan-400/30 px-3 py-1">
              SELECTED: {selectedTool}
            </div>
          </div>
        </div>

        {/* フッター装飾 */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={`h-1 w-4 ${i % 3 === 0 ? 'bg-cyan-500/50' : 'bg-white/5'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}