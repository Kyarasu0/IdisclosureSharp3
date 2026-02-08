import React, { useState, useEffect, useRef } from 'react';
import { Zap, User, Calendar, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

// ==========================================
// 設定 & 定数
// ==========================================

// アイコン画像のパス (ここに画像を配置してください)
// ※ 動作確認用に一時的なプレースホルダー画像を入れていますが、
// お手元の 'image_de2e01.png' を public フォルダ等に置き、パスを変更してください。
const ICON_PATH = "https://cdn-icons-png.flaticon.com/512/3588/3588289.png"; 

const COLORS = {
  cyan: '#00f3ff',
  pink: '#ff00ff',
  bg: '#0a0f1e',
};

// ==========================================
// 共通コンポーネント: 背景アニメーション (Canvas)
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
      
      // グリッド線
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

      // パーティクル
      ctx.fillStyle = COLORS.cyan;
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
// 共通コンポーネント: タップエフェクト
// ==========================================
const TapRipple = () => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
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
// ページ1: イントロダクション画面
// ==========================================
const IntroScreen = ({ onStart, isExiting }: { onStart: () => void; isExiting: boolean }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen transition-all duration-700 ${isExiting ? 'opacity-0 scale-110 blur-sm' : 'opacity-100 scale-100'}`}>
      
      {/* ヒーローロゴエリア */}
      <div className="flex flex-col items-center justify-center mb-12 relative z-10">
        
        {/* アイコン画像 (指定パス) */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />
          <img 
            src={ICON_PATH} 
            alt="Lock Icon" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] relative z-10"
            onError={(e) => {
                // 画像読み込みエラー時のフォールバック（SVG）
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* 画像が見つからない場合のフォールバックアイコン */}
          <div className="hidden w-32 h-32 flex items-center justify-center border-2 border-cyan-500 rounded-2xl bg-slate-900/50 backdrop-blur">
             <span className="text-cyan-500 text-xs">NO IMAGE</span>
          </div>
        </div>

        {/* タイトルテキスト */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-mono text-center leading-tight">
          {/* Id (Pink & Glow) */}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff00ff] to-[#d600d6] drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
            Id
          </span>
          {/* isclosure (Cyan & Glow) */}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#00f3ff] to-[#00c0cc] drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
            isclosure
          </span>
          {/* #3 */}
          <span className="ml-2 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.8)] text-4xl md:text-6xl align-top">
            #3
          </span>
        </h1>
        <p className="mt-4 text-cyan-200/70 text-sm tracking-[0.5em] font-mono animate-pulse">
          SYSTEM BREACH PROTOCOL
        </p>
      </div>

      {/* STARTボタン */}
      <div className="mt-4">
        <button
          onClick={onStart}
          className="group relative px-16 py-5 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 border border-cyan-500/50 rounded-full group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_#00f3ff] transition-all duration-300" />
          <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-sm rounded-full" />
          
          <span className="relative flex items-center gap-3 text-xl font-bold tracking-widest text-cyan-300 group-hover:text-white transition-colors font-mono">
            PRESS TO START
            <Zap size={20} className="group-hover:fill-current group-hover:text-pink-500 transition-colors" />
          </span>
        </button>
        
        <div className="mt-8 text-center">
          <div className="animate-bounce text-cyan-500/50 text-xl">▼</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ページ2: 登録画面 (Registration)
// ==========================================
const RegistrationScreen = () => {
  const [formData, setFormData] = useState({ userId: '', birthDate: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // 登録処理のモック
    setTimeout(() => {
      setIsLoading(false);
      alert(`Access Granted.\nWelcome, Agent ${formData.userId}.`);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in-up">
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* 装飾: 上部のスキャンライン */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500 animate-gradient-x" />

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <ShieldCheck size={24} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">AGENT REGISTRATION</h2>
            <p className="text-xs text-cyan-300/50 font-mono">SECURE CONNECTION ESTABLISHED</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* User ID Input */}
          <div className="space-y-2 group">
            <label className="text-xs font-mono text-cyan-300/70 ml-1 flex items-center gap-2">
              <User size={12} /> IDENTIFICATION CODE
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                placeholder="ENTER AGENT ID"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-mono tracking-wider"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            </div>
          </div>

          {/* Birthday Input */}
          <div className="space-y-2 group">
            <label className="text-xs font-mono text-cyan-300/70 ml-1 flex items-center gap-2">
              <Calendar size={12} /> DATE OF ORIGIN
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-mono tracking-wider appearance-none"
                style={{ colorScheme: 'dark' }} // カレンダーアイコンをダークモード対応
              />
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-2 p-3 bg-pink-900/10 border border-pink-500/20 rounded-lg">
             <AlertTriangle size={14} className="text-pink-500 mt-0.5 shrink-0" />
             <p className="text-[10px] text-pink-200/60 leading-tight">
               WARNING: False identification will result in immediate termination of the session and IP blacklisting.
             </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative overflow-hidden bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-[0.98]"
          >
            <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              INITIATE UPLINK <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>

        </form>
      </div>
      
      <div className="mt-6 text-center">
         <p className="text-[10px] text-slate-500 font-mono tracking-widest">
           ENCRYPTED VIA SHA-256 // NODE: TOKYO-03
         </p>
      </div>
    </div>
  );
};

// ==========================================
// メインコンポーネント: App
// ==========================================
export default function App() {
  const [started, setStarted] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  // STARTボタンクリック時の遷移処理
  const handleStart = () => {
    setStarted(true);
    // アニメーション時間に合わせて画面切り替え
    setTimeout(() => {
      setShowRegistration(true);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1e] text-white overflow-x-hidden font-sans selection:bg-pink-500 selection:text-white">
      
      {/* 共通の背景エフェクト */}
      <CyberBackground />
      <TapRipple />

      {/* カスタムアニメーション定義 */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>

      {/* メインコンテンツ */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center">
        
        {!showRegistration ? (
          // 画面1: イントロ
          <IntroScreen onStart={handleStart} isExiting={started} />
        ) : (
          // 画面2: 登録フォーム
          <RegistrationScreen />
        )}

      </main>
    </div>
  );
}