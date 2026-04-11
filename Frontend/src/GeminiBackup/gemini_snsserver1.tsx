import React, { useRef, useEffect, useState } from 'react';
import { 
  Terminal, Shield, Wifi, Zap, User, Target, 
  Cpu, Code, Activity, Globe, Lock, Unlock, 
  ChevronRight, BatteryMedium, Send
} from 'lucide-react';

// ==========================================
// 1. カラーパレット定義 (全体で統一して使用するサイバーカラー)
// ==========================================
const COLORS = {
  background: '#040b16', // 深い紺色
  grid: 'rgba(34, 211, 238, 0.1)', // 薄いシアンのグリッド線
  cyan: '#22d3ee', // メインのシアン
  green: '#7ed957', // 成功・安全の緑
  pink: '#ff66c4', // 警告・敵のピンク
  glassBg: 'rgba(11, 25, 44, 0.4)', // すりガラスの背景色
  glassBorder: 'rgba(34, 211, 238, 0.2)', // すりガラスの枠線
};

// ==========================================
// 2. カスタムスタイル (Fade-in Up アニメーション用)
// ==========================================
// Tailwindだけでは表現しきれないカスタムアニメーションをここで定義します
const CustomStyles = () => (
  <style>
    {`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
      
      /* スクロールバーのカスタマイズ */
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: ${COLORS.cyan}80;
        border-radius: 10px;
      }
    `}
  </style>
);

// ==========================================
// 3. 背景アニメーション (CyberBackground)
// 頂いたコードをTailwind環境に合わせて微調整しました
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

    // パーティクルの設定
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60; // スマホでは数を減らして軽くする

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // グリッド線の描画
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

      // パーティクルの描画
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
            // 距離に応じて線の透明度を変える
            const alpha = 1 - distance / 150;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.5})`;
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
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
      style={{ backgroundColor: COLORS.background }}
    />
  );
};

// ==========================================
// 4. UIコンポーネント: GlassCard (すりガラス風の箱)
// Bento Gridの基本要素となります
// ==========================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // アニメーションの遅延時間
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-6
        backdrop-blur-xl border
        transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-900/50
        animate-fade-in-up
        ${className}
      `}
      style={{ 
        backgroundColor: COLORS.glassBg,
        borderColor: COLORS.glassBorder,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        animationDelay: `${delay}s`
      }}
    >
      {/* カード内の左上の装飾的な光 */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      {children}
    </div>
  );
};

// ==========================================
// 5. UIコンポーネント: Logo (左上のロゴ)
// ==========================================
const Logo: React.FC = () => (
  <div className="flex items-center gap-3 animate-fade-in-up">
    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/50 overflow-hidden">
      <div className="absolute inset-0 bg-cyan-400/20 animate-pulse" />
      <Terminal size={24} color={COLORS.cyan} className="relative z-10" />
    </div>
    <div>
      <h1 className="text-xl font-bold tracking-widest text-white m-0 leading-tight">NEURAL<span className="text-cyan-400">NET</span></h1>
      <p className="text-xs text-cyan-400/70 tracking-widest uppercase font-mono">v.2.0.4 - Online</p>
    </div>
  </div>
);

// ==========================================
// 6. UIコンポーネント: ChatMessage (グループライン風の吹き出し)
// ==========================================
export interface MessageData {
  id: number;
  type: 'me' | 'other' | 'system';
  name?: string;
  role?: string;
  text: string;
  time?: string;
}

const ChatMessage: React.FC<{ msg: MessageData }> = ({ msg }) => {
  // システムメッセージ (中央寄せ)
  if (msg.type === 'system') {
    return (
      <div className="flex justify-center my-4 animate-fade-in-up">
        <span className="bg-slate-900/60 border border-slate-700 text-slate-400 font-mono text-[10px] px-3 py-1 rounded-full">
          {msg.text}
        </span>
      </div>
    );
  }

  const isMe = msg.type === 'me';
  // 自分の発言はシアン、相手の発言はピンク
  const bubbleColor = isMe ? 'bg-cyan-950/60 border-cyan-500/30' : 'bg-pink-950/60 border-pink-500/30';
  const textColor = 'text-slate-200';
  const nameColor = isMe ? 'text-cyan-400' : 'text-pink-400';
  // 吹き出しの「しっぽ」を表現 (自分は右下、相手は左下の角を尖らせる)
  const shape = isMe ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm';
  const Icon = isMe ? User : Target;

  return (
    <div className={`flex w-full mb-6 animate-fade-in-up ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        {/* アイコン */}
        <div className={`w-10 h-10 rounded-full bg-slate-900 border flex items-center justify-center shrink-0 mb-1 ${isMe ? 'border-cyan-700/50' : 'border-pink-700/50'}`}>
          <Icon size={18} className={nameColor} />
        </div>
        
        {/* メッセージ本文 */}
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
          <div className="flex items-baseline gap-2 mb-1 mx-1">
            <span className={`text-xs font-bold ${nameColor}`}>{msg.name}</span>
            <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
          </div>
          <div className={`p-3 backdrop-blur-sm border shadow-lg ${bubbleColor} ${shape} ${textColor} text-sm leading-relaxed font-mono`}>
            {msg.text}
          </div>
          {/* LINEの既読マークの代わりに「DECRYPTED(解読済)」などのサイバーなテキスト */}
          {isMe && <span className="text-[10px] font-mono text-cyan-600 mt-1 mr-1">DECRYPTED</span>}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. 遊べるギミック: HackingWidget (タップして遊べるツール)
// スマホでもタップして「ハッキング感」を味わえます
// ==========================================
const HackingWidget: React.FC<{ delay: number }> = ({ delay }) => {
  const [progress, setProgress] = useState(0);
  const [isHacking, setIsHacking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'hacking' | 'success'>('idle');

  const handleHackClick = () => {
    if (status === 'success' || isHacking) return;
    
    setIsHacking(true);
    setStatus('hacking');
    setProgress(0);

    // プログレスバーを進める演出
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 15) + 5;
        if (next >= 100) {
          clearInterval(interval);
          setIsHacking(false);
          setStatus('success');
          return 100;
        }
        return next;
      });
    }, 200);
  };

  return (
    <GlassCard delay={delay} className="flex flex-col justify-between h-full group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-mono flex items-center gap-2">
          <Code size={18} className="text-cyan-400" />
          TARGET_OVERRIDE.exe
        </h3>
        {status === 'success' ? (
          <Unlock size={20} color={COLORS.green} className="animate-bounce" />
        ) : (
          <Lock size={20} className="text-slate-500" />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        {/* プログレスバー */}
        <div className="w-full bg-slate-900/80 rounded-full h-4 border border-slate-700 overflow-hidden relative">
          <div 
            className="h-full bg-cyan-500 transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50" />
          </div>
        </div>

        {/* ステータステキスト */}
        <div className="text-center font-mono text-sm h-6">
          {status === 'idle' && <span className="text-slate-400">System Ready. Awaiting execution.</span>}
          {status === 'hacking' && <span className="text-cyan-400 animate-pulse">Bypassing firewall... {progress}%</span>}
          {status === 'success' && <span className="text-green-400 font-bold">ACCESS GRANTED.</span>}
        </div>

        {/* 実行ボタン (Micro-interaction) */}
        <button
          onClick={handleHackClick}
          disabled={status === 'success' || isHacking}
          className={`
            w-full py-4 rounded-xl font-mono font-bold flex items-center justify-center gap-2
            transition-all duration-200 active:scale-95
            ${status === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-not-allowed' 
              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30'
            }
          `}
        >
          {status === 'idle' ? (
            <>EXECUTE <ChevronRight size={18} /></>
          ) : status === 'hacking' ? (
            <><Activity size={18} className="animate-spin" /> PROCESSING...</>
          ) : (
            'CONNECTED'
          )}
        </button>
      </div>
    </GlassCard>
  );
};


// ==========================================
// 8. メインアプリケーション (App)
// ページ全体のレイアウト（Bento Grid）を構成します
// ==========================================
export default function App() {
  // チャットの初期履歴データ
  const [messages, setMessages] = useState<MessageData[]>([
    { id: 1, type: 'system', text: 'SECURE CONNECTION ESTABLISHED TO MAINFRAME' },
    { id: 2, type: 'other', name: 'ENIGMA', role: 'Defender', text: 'Firewall is active. State your purpose, intruder.', time: '11:42 AM' },
    { id: 3, type: 'me', name: 'KYARASU', role: 'Infiltrator', text: 'I\'m here for the data. You can\'t stop me.', time: '11:45 AM' },
    { id: 4, type: 'other', name: 'ENIGMA', role: 'Defender', text: 'My security protocols are fully updated. Try if you dare.', time: '11:46 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  
  // チャットの一番下に自動スクロールするための参照
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージが追加されたら一番下までスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // チャット送信＆自動返信ギミック処理
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 自分の発言を追加
    const newMsg: MessageData = {
      id: Date.now(),
      type: 'me',
      name: 'KYARASU',
      role: 'Infiltrator',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText(''); // 入力欄をクリア

    // 自動返信ギミック (時間差でシステム通知 → 相手の返信)
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'system', text: 'ANALYZING THREAT SIGNATURE...' }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 2,
          type: 'other',
          name: 'ENIGMA',
          role: 'Defender',
          text: 'Payload detected and neutralized. You are wasting your time.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="h-screen text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* 必要なカスタムスタイルの注入 */}
      <CustomStyles />

      {/* 背景レイヤー */}
      <CyberBackground />

      {/* コンテンツレイヤー (z-10で背景より前面に) */}
      <div className="relative z-10 container mx-auto px-4 py-6 h-full flex flex-col">
        
        {/* ヘッダーエリア */}
        <header className="flex justify-between items-center mb-4 shrink-0">
          <Logo />
          <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-700 font-mono text-xs text-green-400">
              <Zap size={14} /> SECURE CONNECTION
            </div>
          </div>
        </header>

        {/* SNS (グループライン) 風レイアウト 
          左側: ステータス＆ギミックツール (サイドバー)
          右側: メインチャット画面
        */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* 左側: ステータス＆ウィジェットエリア (PCでは固定、スマホでは非表示か縦並び) */}
          <div className="hidden lg:flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
            
            {/* プロジェクト概要 */}
            <GlassCard delay={0.2} className="flex flex-col items-center text-center py-6 shrink-0">
              <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30 relative">
                 <Globe size={28} className="text-cyan-400 animate-[spin_10s_linear_infinite]" />
                 <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">PSYCH-WARFARE</h2>
              <div className="flex gap-2 font-mono text-xs mt-2">
                <span className="bg-slate-900/50 px-2 py-1 rounded text-cyan-400 border border-slate-700/50">MEMBERS: 2</span>
                <span className="bg-slate-900/50 px-2 py-1 rounded text-pink-400 border border-slate-700/50">THREAT: HIGH</span>
              </div>
            </GlassCard>

            {/* サーバーステータス */}
            <GlassCard delay={0.3} className="flex flex-col gap-4 shrink-0">
               <h3 className="text-white font-mono flex items-center gap-2 mb-2 text-sm">
                  <Shield size={16} className="text-green-400" />
                  SYSTEM_STATUS
               </h3>
               <div className="space-y-3">
                  {[
                    { label: "CPU Usage", val: "84%", color: "bg-pink-500" },
                    { label: "Memory Allocation", val: "4.2TB", color: "bg-cyan-500" },
                    { label: "Trace Route", val: "Active", color: "bg-green-500" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-black/30 p-2 rounded-lg border border-white/5 flex justify-between items-center">
                      <span className="text-xs font-mono text-slate-400">{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-mono">{stat.val}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${stat.color} animate-pulse`} />
                      </div>
                    </div>
                  ))}
               </div>
            </GlassCard>

            {/* 既存のハッキングウィジェット */}
            <div className="shrink-0 h-64">
              <HackingWidget delay={0.4} />
            </div>
          </div>

          {/* 右側: グループライン風チャットエリア */}
          <GlassCard delay={0.5} className="lg:col-span-2 flex flex-col p-0 overflow-hidden border-cyan-500/30">
            
            {/* チャットヘッダー */}
            <div className="bg-slate-900/80 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/50 rounded-lg flex items-center justify-center border border-slate-700">
                  <Terminal size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold font-mono text-lg leading-tight">MAINFRAME_NETWORK</h2>
                  <p className="text-xs text-green-400 font-mono">● 2 Users Active</p>
                </div>
              </div>
              <Wifi size={20} className="text-slate-500" />
            </div>

            {/* チャットタイムライン (上にスクロールしていくエリア) */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* チャット入力エリア */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-700/50 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 font-mono text-lg">{'>'}</span>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter command or message..."
                    className="w-full bg-black/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-slate-200 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded-xl px-6 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>

          </GlassCard>

        </main>
      </div>
    </div>
  );
}