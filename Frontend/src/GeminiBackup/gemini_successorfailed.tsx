import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, CheckCircle2, XCircle, Unlock, Lock, Loader2 } from 'lucide-react';

/* ==========================================
 * 🎨 1. グローバルスタイル＆アニメーション定義
 * (実案件ではこれを module.css に分離します)
 * ========================================== */
const CyberStyles = () => (
  <style>{`
    /* 紺色のメッシュ背景 */
    .cyber-mesh-bg {
      background-color: #050b14;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 60%),
        linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
      background-size: 100% 100%, 30px 30px, 30px 30px;
      background-position: center center;
    }

    /* 起動時の「ウィーン」と広がるアニメーション */
    @keyframes cyberExpandLine {
      0% { width: 0%; opacity: 0; }
      50% { width: 100%; opacity: 1; height: 2px; }
      100% { width: 100%; opacity: 1; height: 100%; }
    }
    .animate-cyber-expand {
      animation: cyberExpandLine 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* ログのスムーズなスクロール用 */
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }

    /* テキストの発光（ネオン）エフェクト */
    .neon-text-green {
      text-shadow: 0 0 10px rgba(34, 197, 94, 0.7), 0 0 20px rgba(34, 197, 94, 0.5);
    }
    .neon-text-red {
      text-shadow: 0 0 10px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.5);
    }

    /* グリッチ風の揺れ */
    @keyframes subtleGlitch {
      0% { transform: translate(0) }
      20% { transform: translate(-2px, 1px) }
      40% { transform: translate(-1px, -1px) }
      60% { transform: translate(2px, 1px) }
      80% { transform: translate(1px, -1px) }
      100% { transform: translate(0) }
    }
    .animate-glitch {
      animation: subtleGlitch 0.3s ease-in-out infinite alternate;
    }
  `}</style>
);

/* ==========================================
 * 🛠 2. ユーティリティ関数（内部処理）
 * 偽のハッキングログを生成するための関数群
 * ========================================== */
const generateIP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*10)}.${Math.floor(Math.random()*255)}`;
const generateHex = () => Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join('');

const LOG_TEMPLATES = [
  "Bypassing mainframe security protocols...",
  "Decrypting RSA-4096 layer...",
  "Extracting fragmented packet data...",
  "Compiling kernel modules...",
  "Accessing restricted sub-directories...",
  "Overriding administrator privileges...",
  "Masking IP signature...",
  "Establishing secondary VPN tunnel...",
  "Analyzing firewall vulnerabilities...",
  "Injecting zero-day payload..."
];

const generateLogEntry = () => {
  const time = new Date().toISOString().substring(11, 23);
  const type = Math.random() > 0.7 ? '[WARN]' : '[INFO]';
  const text = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
  const hash = generateHex();
  return `${time} ${type} ${text} [0x${hash}] > IP:${generateIP()}`;
};


/* ==========================================
 * 🧩 3. コンポーネント: ハッキング画面オーバーレイ
 * (今回のメインの演出部分)
 * ========================================== */
const CyberHackingOverlay = ({ onClose }) => {
  // フェーズ管理: 'boot' (起動) -> 'hacking' (ログ流れる) -> 'suspense' (沈黙・緊張) -> 'result' (結果)
  const [phase, setPhase] = useState('boot');
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null); // 'success' | 'failed'
  const [progress, setProgress] = useState(0); // プログレスバー用 (0-100)
  const [timeLeft, setTimeLeft] = useState("5.00"); // 残り秒数用
  const logContainerRef = useRef(null);

  // フェーズ進行とログ生成の制御
  useEffect(() => {
    let logInterval;
    let progressInterval;
    let phaseTimeout;

    // 1. 起動アニメーション終了後にハッキング開始
    if (phase === 'boot') {
      phaseTimeout = setTimeout(() => setPhase('hacking'), 800);
    }

    // 2. ハッキング中（爆速でログを生成 ＆ プログレスバー進行）
    if (phase === 'hacking') {
      const duration = 5000; // ハッキングにかかる時間（5秒）
      const startTime = Date.now();

      // ログを流す処理（30ms間隔で2行ずつ追加し、より「ぶあーっ」と感を出す）
      logInterval = setInterval(() => {
        setLogs(prev => {
          const newLogs = [...prev, generateLogEntry(), generateLogEntry()];
          // メモリ節約のため最新の80行だけ保持
          return newLogs.slice(-80);
        });
      }, 30);

      // プログレスバーと残り秒数の更新処理
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        const currentLeft = Math.max((duration - elapsed) / 1000, 0).toFixed(2);
        
        setProgress(currentProgress);
        setTimeLeft(currentLeft);

        // 5秒経過したら緊張フェーズへ移行
        if (elapsed >= duration) {
          clearInterval(logInterval);
          clearInterval(progressInterval);
          setPhase('suspense');
        }
      }, 50); // 50msごとにUIを滑らかに更新
    }

    // 3. 緊張フェーズ（1.5秒間ログを止めてドキドキさせる）
    if (phase === 'suspense') {
      setLogs(prev => [...prev, "", ">>> CRITICAL OPERATION IN PROGRESS...", ">>> AWAITING SERVER RESPONSE...", ""]);
      phaseTimeout = setTimeout(() => {
        // ここでおみくじの確率を決定（今回は50%）
        const isSuccess = Math.random() > 0.5;
        setResult(isSuccess ? 'success' : 'failed');
        setPhase('result');
      }, 1500);
    }

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearTimeout(phaseTimeout);
    };
  }, [phase]);

  // ログが追加されるたびに一番下へスクロール
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8">
      {/* ターミナルウィンドウ本体 (起動時にウィーンと広がるアニメーション) */}
      <div 
        className={`
          relative flex flex-col overflow-hidden cyber-mesh-bg
          border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.1)]
          transition-all duration-500
          ${phase === 'boot' ? 'h-[2px] w-0 opacity-0 animate-cyber-expand' : 'h-full w-full max-w-5xl'}
        `}
      >
        {/* ガラスモーフィズムの反射効果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        {/* ヘッダーとプログレスバー部分を統合 */}
        <div className="flex flex-col border-b border-cyan-500/20 bg-black/40 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm tracking-widest">ROOT_ACCESS_TERMINAL // v9.2.1</span>
            </div>
            {/* ローディングインジケーター */}
            {(phase === 'hacking' || phase === 'suspense') && (
               <div className="flex items-center gap-2 text-cyan-500">
                 <Loader2 className="w-4 h-4 animate-spin" />
                 <span className="font-mono text-xs animate-pulse">
                   {phase === 'suspense' ? 'VERIFYING' : 'PROCESSING'}
                 </span>
               </div>
            )}
          </div>

          {/* プログレスバーと残り時間表示 */}
          {(phase === 'hacking' || phase === 'suspense') && (
            <div className="px-6 pb-4">
              <div className="flex justify-between text-cyan-400/80 font-mono text-xs mb-2 tracking-wider">
                <span className="animate-pulse">
                  {phase === 'suspense' ? '> DECRYPTION FINALIZING...' : '> BYPASSING FIREWALL...'}
                </span>
                <span className="text-cyan-300 font-bold">
                  TIME_LEFT: [{timeLeft}s]
                </span>
              </div>
              {/* プログレスバーのレール */}
              <div className="w-full h-1.5 bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-900/50 relative">
                {/* 伸びるバー */}
                <div 
                  className="h-full bg-cyan-400 relative shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                  style={{ 
                    width: `${progress}%`, 
                    transition: phase === 'hacking' ? 'width 50ms linear' : 'none' 
                  }}
                >
                  {/* バーの中の光るエフェクト */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-[pulse_1s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* メインコンテンツエリア */}
        <div className="relative flex-1 p-6 overflow-hidden">
          
          {/* ログ表示エリア (フェーズが hacking か suspense の時に表示) */}
          <div 
            ref={logContainerRef}
            className={`
              h-full w-full font-mono text-xs sm:text-sm text-cyan-300/80 
              overflow-y-auto hide-scrollbar space-y-1 pb-20
              transition-opacity duration-300
              ${phase === 'result' ? 'opacity-10' : 'opacity-100'}
            `}
          >
            {logs.map((log, i) => (
              <div key={i} className="hover:bg-cyan-900/30 px-2 rounded transition-colors duration-150">
                {log}
              </div>
            ))}
          </div>

          {/* 結果表示エリア (フェーズが result の時に表示) */}
          {phase === 'result' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-700">
              {result === 'success' ? (
                <div className="flex flex-col items-center text-green-400 animate-in zoom-in duration-500">
                  <Unlock className="w-24 h-24 mb-6 neon-text-green" />
                  <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter neon-text-green">
                    SUCCESS!
                  </h2>
                  <p className="mt-4 font-mono text-green-400/80 tracking-widest">
                    SYSTEM OVERRIDE COMPLETE.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-red-500 animate-glitch">
                  <Lock className="w-24 h-24 mb-6 neon-text-red" />
                  <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter neon-text-red">
                    FAILED...
                  </h2>
                  <p className="mt-4 font-mono text-red-500/80 tracking-widest">
                    ACCESS DENIED. IP LOGGED.
                  </p>
                </div>
              )}

              {/* 閉じるボタン */}
              <button 
                onClick={onClose}
                className={`
                  mt-12 px-8 py-3 rounded-full font-mono text-sm tracking-widest transition-all duration-300
                  border backdrop-blur-md hover:scale-105 active:scale-95
                  ${result === 'success' 
                    ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' 
                    : 'border-red-500/50 text-red-400 hover:bg-red-500/10'}
                `}
              >
                CLOSE TERMINAL
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


/* ==========================================
 * 🚀 4. メインアプリケーション (App)
 * 普段のLP画面と、ハッキング起動のトリガー
 * ========================================== */
export default function App() {
  const [isHacking, setIsHacking] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative font-sans">
      <CyberStyles />
      
      {/* --- ダミーのLP背景 (今回は簡易的に配置) --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <ShieldAlert className="w-16 h-16 text-cyan-500 mb-6 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-center">
          Cyber Warfare Protocol
        </h1>
        <p className="text-slate-400 max-w-md text-center mb-10 leading-relaxed">
          This is a dummy landing page. To experience the hacking roulette sequence, initiate the protocol below.
        </p>

        {/* 起動ボタン */}
        <button
          onClick={() => setIsHacking(true)}
          className="
            group relative px-8 py-4 bg-cyan-950/50 border border-cyan-500/30 rounded-2xl 
            overflow-hidden backdrop-blur-md transition-all duration-300
            hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:-translate-y-1
            active:translate-y-0
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative font-mono font-semibold text-cyan-300 tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            INITIATE HACKING SEQUENCE
          </span>
        </button>
      </div>

      {/* --- ハッキングオーバーレイの描画 --- */}
      {isHacking && (
        <CyberHackingOverlay onClose={() => setIsHacking(false)} />
      )}
    </div>
  );
}