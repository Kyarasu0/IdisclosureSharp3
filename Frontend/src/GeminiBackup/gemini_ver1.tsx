import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Zap, Skull, Shield, Terminal, Play, Settings, Users, ShoppingCart } from 'lucide-react';

// ==========================================
// ユーティリティ & 定数
// ==========================================

// デザインで使用するメインカラー（Tailwindのクラスと併用）
const COLORS = {
  cyan: '#00f3ff', // ロック本体の色
  pink: '#ff00ff', // ロックのアーム部分の色
  bg: '#0a0f1e',   // 濃紺の背景
};

// ==========================================
// コンポーネント: 背景アニメーション (Canvas)
// ==========================================
/**
 * 背景に表示するサイバーなパーティクルネットワークを描画します。
 * ハッカーがネットワークに潜入しているような浮遊感を演出します。
 */
const CyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // パーティクルの設定
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 60; // パーティクルの数

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, // ゆったりとした動き
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // グリッド線の描画（薄い背景のメッシュ）
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.03)';
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

      // パーティクルの更新と描画
      ctx.fillStyle = COLORS.cyan;
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // 画面端で跳ね返る処理
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // 点の描画
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // 近くの点同士を線で結ぶ
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 - distance / 1000})`;
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

    // リサイズ対応
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

// ==========================================
// コンポーネント: タップ時の波紋エフェクト
// ==========================================
const TapRipple = () => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
        // タッチイベントとマウスイベントの座標取得の差異を吸収
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

      const id = Date.now();
      setRipples((prev) => [...prev, { x: clientX, y: clientY, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    // window.addEventListener('touchstart', handleClick); // タッチでの二重発火防止のためclickのみで対応

    return () => {
      window.removeEventListener('click', handleClick);
      // window.removeEventListener('touchstart', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full border border-cyan-400 animate-ping opacity-75"
          style={{
            left: r.x,
            top: r.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

// ==========================================
// コンポーネント: Bento Grid用カード (Glassmorphism)
// ==========================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // アニメーション遅延
  onClick?: () => void;
}

const GlassCard = ({ children, className = '', delay = 0, onClick }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden group
        bg-slate-900/40 backdrop-blur-md 
        border border-white/10 rounded-3xl 
        shadow-lg transition-all duration-500 ease-out
        hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:border-cyan-500/30 hover:-translate-y-1
        active:scale-95 cursor-pointer
        animate-fade-in-up
        ${className}
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      {/* カード内の光の反射エフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </div>
  );
};

// ==========================================
// コンポーネント: タイトルロゴ & ロックアイコン
// ==========================================
const HeroLogo = ({ unlocked }: { unlocked: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8 relative z-10">
      {/* ロックアイコン (画像素材の色味に合わせてCSSで再現) */}
      <div className={`relative mb-6 transition-all duration-700 ${unlocked ? 'scale-110 drop-shadow-[0_0_30px_#00f3ff]' : 'drop-shadow-[0_0_15px_#ff00ff]'}`}>
        
        {/* アイコンの背景グロー */}
        <div className={`absolute inset-0 blur-2xl rounded-full opacity-50 ${unlocked ? 'bg-cyan-500' : 'bg-pink-600'}`} />

        {/* SVGでカスタムロックアイコンを描画 (画像の再現) */}
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
          {/* ロックの上のアーム部分 (ピンク) */}
          <path 
            d={unlocked ? "M7 11V7a5 5 0 0 1 9.9-1" : "M7 11V7a5 5 0 0 1 10 0v4"} 
            stroke={COLORS.pink} 
            strokeWidth="3" 
            strokeLinecap="round"
            className={`transition-all duration-500 ${unlocked ? '-translate-y-2 translate-x-1 rotate-12' : ''}`}
          />
          {/* ロックの本体部分 (シアン) */}
          <rect x="4" y="11" width="16" height="11" rx="2" fill={COLORS.cyan} className="shadow-lg" />
          {/* 鍵穴装飾 */}
          <circle cx="12" cy="16.5" r="1.5" fill="#0a0f1e" />
        </svg>
        
        {/* グリッチノイズ的な装飾 */}
        {!unlocked && (
           <div className="absolute top-0 right-0 w-4 h-4 bg-pink-500 animate-pulse blur-[1px]" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%)'}}></div>
        )}
      </div>

      {/* タイトルテキスト */}
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-lg font-mono">
        <span className="text-pink-500 inline-block animate-pulse">I</span>
        disclosure <span className="text-lime-400">#2</span>
      </h1>
      <p className="mt-2 text-cyan-200/70 text-sm tracking-widest font-mono">SYSTEM BREACH PROTOCOL</p>
    </div>
  );
};

// ==========================================
// メインコンポーネント: アプリケーション全体
// ==========================================
export default function App() {
  const [started, setStarted] = useState(false);
  const [view, setView] = useState<'intro' | 'home'>('intro');

  // "START"ボタンを押した時の処理
  const handleStart = () => {
    setStarted(true);
    // 0.8秒後に画面遷移
    setTimeout(() => {
      setView('home');
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1e] text-white overflow-x-hidden font-sans selection:bg-pink-500 selection:text-white">
      {/* 1. 背景エフェクト */}
      <CyberBackground />
      <TapRipple />

      {/* スタイル定義（Tailwindの設定外のアニメーション用） */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* 2. メインコンテンツコンテナ */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        
        {/* --- 画面A: イントロダクション (Start画面) --- */}
        {view === 'intro' && (
          <div className={`flex flex-col items-center transition-all duration-700 ${started ? 'opacity-0 scale-110 blur-sm' : 'opacity-100 scale-100'}`}>
            
            <HeroLogo unlocked={started} />

            <div className="mt-12">
              <button
                onClick={handleStart}
                className="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
              >
                {/* ボタン背景のグラデーションボーダー */}
                <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-full group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_#00f3ff] transition-all" />
                
                {/* ボタン内部の塗り */}
                <div className="absolute inset-0 bg-cyan-950/30 backdrop-blur-sm rounded-full" />
                
                <span className="relative flex items-center gap-3 text-lg font-bold tracking-widest text-cyan-300 group-hover:text-white transition-colors font-mono">
                  PRESS TO START
                  <Zap size={18} className={`transition-transform duration-300 ${started ? 'scale-150 text-pink-500' : 'group-hover:rotate-12'}`} />
                </span>
              </button>
              
              <div className="mt-4 text-center">
                <div className="animate-bounce text-cyan-500/50">▼</div>
              </div>
            </div>
          </div>
        )}

        {/* --- 画面B: メインメニュー (Bento Grid) --- */}
        {view === 'home' && (
          <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
            
            {/* ヘッダーエリア */}
            <div className="flex justify-between items-center mb-8 px-2">
              <div className="flex items-center gap-2">
                <div className="bg-pink-500 p-1.5 rounded-lg shadow-[0_0_10px_#ff00ff]">
                  <Lock size={16} className="text-white" />
                </div>
                <span className="font-mono text-xl font-bold tracking-tighter">Idisclosure<span className="text-cyan-400">#2</span></span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="hidden sm:flex text-xs font-mono text-cyan-300/60 bg-cyan-900/20 px-3 py-1 rounded-full border border-cyan-500/20">
                    STATUS: CONNECTED
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                    {/* ユーザーアバターのプレースホルダー */}
                    <Users size={20} className="text-white/70" />
                 </div>
              </div>
            </div>

            {/* Bento Grid レイアウト */}
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-4 h-auto md:h-[600px]">
              
              {/* 1. メインのストーリーモード (大きく表示) */}
              <GlassCard 
                className="col-span-2 row-span-2 bg-gradient-to-br from-slate-900/60 to-indigo-900/60 group"
                delay={100}
                onClick={() => alert("Loading Story Mode...")}
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
                  <span className="inline-block px-2 py-1 mb-2 text-xs font-bold bg-pink-600 text-white rounded">NEW SEASON</span>
                  <h2 className="text-3xl font-bold text-white mb-1">STORY MODE</h2>
                  <p className="text-sm text-cyan-200/70 line-clamp-2">
                    Infiltrate the mainframe. Uncover the truth behind the Idisclosure protocol.
                  </p>
                </div>
                <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </GlassCard>

              {/* 2. PvP / Multiplayer */}
              <GlassCard 
                className="col-span-2 md:col-span-1 row-span-1 bg-cyan-950/30"
                delay={200}
                onClick={() => alert("Searching for opponent...")}
              >
                <div className="flex flex-col h-full justify-between p-5">
                   <div className="flex justify-between items-start">
                     <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400"><Skull size={24} /></div>
                     <span className="text-xs font-mono text-white/40">ONLINE</span>
                   </div>
                   <div>
                     <h3 className="text-lg font-bold">Battle Arena</h3>
                     <p className="text-xs text-white/50">1v1 Hacking Battle</p>
                   </div>
                </div>
              </GlassCard>

              {/* 3. Shop / Items */}
              <GlassCard 
                className="col-span-1 row-span-2 md:row-span-2 bg-pink-950/20"
                delay={300}
                onClick={() => alert("Opening Shop...")}
              >
                 <div className="flex flex-col h-full items-center justify-center p-4 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-900/20 pointer-events-none" />
                    <ShoppingCart size={32} className="text-pink-400 mb-3 group-hover:animate-bounce" />
                    <h3 className="font-bold text-white">Dark Web Shop</h3>
                    <p className="text-xs text-pink-200/60 mt-2">Buy Tools & Exploits</p>
                    <div className="mt-4 px-3 py-1 bg-pink-600/20 border border-pink-500/50 rounded-full text-xs text-pink-300">
                      SALE -50%
                    </div>
                 </div>
              </GlassCard>

              {/* 4. Daily Challenge */}
              <GlassCard 
                className="col-span-1 row-span-1 bg-emerald-900/20"
                delay={400}
              >
                 <div className="h-full flex flex-col justify-center items-center p-4">
                    <Terminal size={24} className="text-emerald-400 mb-2" />
                    <h3 className="font-bold text-sm text-center">Daily Code</h3>
                    <span className="text-xs font-mono text-emerald-500/80 mt-1">#AF32-X</span>
                 </div>
              </GlassCard>

              {/* 5. Settings / Profile (横長) */}
              <GlassCard 
                className="col-span-2 md:col-span-2 row-span-1 bg-slate-800/40"
                delay={500}
              >
                <div className="flex items-center justify-between h-full px-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-full">
                        <Settings size={20} className="text-white/80 group-hover:rotate-90 transition-transform duration-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">System Settings</h3>
                        <p className="text-xs text-white/40 font-mono">Ver 2.0.4 // STABLE</p>
                      </div>
                   </div>
                   <div className="h-10 w-32 bg-slate-900/50 rounded-lg overflow-hidden relative">
                      {/* 音声波形のようなアニメーション */}
                      <div className="flex items-end justify-center gap-1 h-full pb-2 px-2">
                         {[...Array(8)].map((_,i) => (
                           <div key={i} className="w-1 bg-cyan-500/60 animate-pulse" style={{height: `${Math.random()*100}%`, animationDelay: `${i*0.1}s`}} />
                         ))}
                      </div>
                   </div>
                </div>
              </GlassCard>
              
              {/* 6. Security Status (装飾用) */}
              <GlassCard className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 bg-indigo-900/20 hidden md:block" delay={600}>
                 <div className="h-full flex flex-col justify-center items-center">
                    <Shield size={28} className="text-indigo-400 mb-2" />
                    <div className="text-xs font-mono text-indigo-300">PROTECTED</div>
                 </div>
              </GlassCard>

              {/* 7. Extra Button */}
              <GlassCard className="col-span-1 row-span-1 bg-slate-800/30 flex items-center justify-center" delay={700}>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-white/20 group-hover:text-white/60 transition-colors">+</div>
                 </div>
              </GlassCard>

            </div>
            
            {/* フッターテキスト */}
            <div className="mt-8 text-center">
               <p className="text-xs text-slate-500 font-mono">
                 © 2026 IDISCLOSURE PROJECT. ALL RIGHTS RESERVED.<br/>
                 UNAUTHORIZED ACCESS IS A FELONY.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}