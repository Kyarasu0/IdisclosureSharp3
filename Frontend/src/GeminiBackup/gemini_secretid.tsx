import React, { useState, useEffect, useRef } from 'react';
import { Shield, Cpu, Terminal, AlertTriangle, CheckCircle2, Lock, Zap } from 'lucide-react';


// ==========================================
// コンポーネント: スコア (同期率) 表示
// ==========================================
const ScoreDisplay = ({ score, text }: { score: number; text: string }) => {
  return (
    <div className="flex flex-col items-end group">
      <div className="text-xs text-[#00f0ff] opacity-70 mb-1 tracking-widest font-mono">
        // {text}
      </div>
      <div className="relative">
        <div className="text-4xl font-bold text-white font-mono tabular-nums tracking-tighter text-shadow-cyan">
          {score.toString().padStart(4, '0')}
        </div>
        {/* グリッチレイヤー */}
        <div className="absolute top-0 left-0 text-4xl font-bold text-[#ff003c] opacity-0 group-hover:opacity-50 animate-pulse font-mono tabular-nums pointer-events-none translate-x-[2px]">
          {score.toString().padStart(4, '0')}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// コンポーネント: 左側のルールパネル
// ==========================================
const RulesPanel = ({ validations }: { validations: { id: string; label: string; valid: boolean }[] }) => {
  return (
    <div className="h-full w-full flex flex-col justify-center p-8 backdrop-blur-sm bg-black/20 border-r border-[#00f0ff]/20 relative overflow-hidden">
      {/* 装飾的なヘッダー */}
      <div className="absolute top-10 left-8">
        <h2 className="text-sm font-mono text-[#00f0ff] tracking-[0.2em] mb-2 flex items-center gap-2">
          <Terminal size={14} /> SYSTEM_PROTOCOLS
        </h2>
        <h1 className="text-3xl font-bold text-white tracking-wider uppercase">
          Secret <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#fff]">Access</span>
        </h1>
      </div>

      {/* ルールリスト */}
      <div className="mt-12 space-y-6 relative z-10">
        <div className="flex items-center gap-2 text-[#ff003c] mb-6 animate-pulse">
           <AlertTriangle size={16} />
           <span className="text-xs font-mono tracking-widest">RESTRICTED AREA // AUTH REQUIRED</span>
        </div>

        {validations.map((rule) => (
          <div 
            key={rule.id}
            className={`
              flex items-center justify-between p-4 border-l-2 transition-all duration-500
              ${rule.valid 
                ? 'border-[#00f0ff] bg-[#00f0ff]/10 translate-x-2' 
                : 'border-white/10 bg-white/5 text-gray-400'}
            `}
          >
            <span className="font-mono text-sm tracking-wide">{rule.label}</span>
            {rule.valid ? (
              <CheckCircle2 size={18} className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            ) : (
              <div className="h-2 w-2 rounded-full bg-white/20" />
            )}
          </div>
        ))}
      </div>

      {/* 装飾的なフッターテキスト */}
      <div className="absolute bottom-8 left-8 text-[10px] text-white/30 font-mono leading-relaxed">
        <p>SECURE CONNECTION ESTABLISHED</p>
        <p>ENCRYPTION: AES-256-GCM</p>
        <p>NODE: TOKYO-03</p>
      </div>
      
      {/* 背景のスキャンライン */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};

// ==========================================
// メインコンポーネント
// ==========================================
export function SecretEntryApp() {
  const [secretId, setSecretId] = useState('');
  const [score, setScore] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(false);

  // ルール定義
  const rules = [
    { id: 'length', label: '8文字以上入力せよ', check: (s: string) => s.length >= 8 },
    { id: 'upper', label: '大文字を含む', check: (s: string) => /[A-Z]/.test(s) },
    { id: 'number', label: '数字を含む', check: (s: string) => /[0-9]/.test(s) },
    { id: 'special', label: '特殊記号 (#, $, %, &) を含む', check: (s: string) => /[#$=&%]/.test(s) },
  ];

  const validations = rules.map(r => ({
    ...r,
    valid: r.check(secretId)
  }));

  const allValid = validations.every(v => v.valid);

  // 入力ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSecretId(val);

    // ポイント計算ロジック
    // 基本点: 文字数 * 10
    // ボーナス: 条件クリアごとに +150
    let tempScore = val.length * 15;
    const bonus = validations.filter(v => v.check(val)).length * 150;
    
    // 入力時のグリッチ演出トリガー
    setGlitchTrigger(true);
    setTimeout(() => setGlitchTrigger(false), 100);

    setScore(tempScore + bonus);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-[#050505] text-white selection:bg-[#ff003c] selection:text-white">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 240, 255, 0.05) 51%, transparent 51%);
          background-size: 100% 4px;
          animation: scanline 10s linear infinite;
          pointer-events: none;
          z-index: 50;
        }
        .text-shadow-cyan {
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3);
        }
        .input-glow:focus {
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.1);
        }
        .clip-corner {
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% calc(100% - 20px), 
            calc(100% - 20px) 100%, 
            0 100%
          );
        }
      `}</style>
      
      {/* スキャンラインオーバーレイ */}
      <div className="scanline" />

      {/* メインレイアウト: グリッドで左右分割 */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-12">
        <div className="max-w-6xl w-full h-[600px] flex rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 bg-[#0a0a12]/80 backdrop-blur-md">
          
          {/* 左カラム: ルール (40%) */}
          <div className="hidden md:block w-2/5 h-full">
            <RulesPanel validations={validations} />
          </div>

          {/* 右カラム: 入力フォーム (60%) */}
          <div className="w-full md:w-3/5 h-full relative flex flex-col p-8 md:p-12">
            
            {/* 右上のスコア表示 */}
            <div className="absolute top-8 right-12">
              <ScoreDisplay score={score} text="SYNC RATE" />
            </div>

            {/* 中央フォームエリア */}
            <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
              
              <div className="mb-2 flex items-center gap-2 text-[#00f0ff] opacity-80">
                <Lock size={16} />
                <span className="text-xs font-mono tracking-widest uppercase">Identity Verification</span>
              </div>

              <div className={`relative group transition-transform duration-100 ${glitchTrigger ? 'translate-x-1' : ''}`}>
                <input
                  type="text"
                  value={secretId}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="ENTER SECRET ID..."
                  className="w-full bg-[#050510] border-2 border-[#1a1a2e] text-[#00f0ff] text-xl font-mono p-6 pr-12 rounded-lg focus:outline-none focus:border-[#00f0ff] transition-all duration-300 placeholder:text-gray-700 input-glow"
                  spellCheck={false}
                />
                
                {/* 入力欄の右端のインジケーター */}
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${allValid ? 'text-[#00f0ff]' : 'text-gray-600'}`}>
                  <Cpu className={`animate-spin-slow ${allValid ? 'animate-pulse' : ''}`} />
                </div>
                
                {/* 枠線の装飾 */}
                <div className={`absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 transition-colors duration-300 ${isFocused ? 'border-[#00f0ff]' : 'border-gray-700'}`} />
                <div className={`absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 transition-colors duration-300 ${isFocused ? 'border-[#00f0ff]' : 'border-gray-700'}`} />
              </div>

              {/* プログレスバー風の装飾 */}
              <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff003c] transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(score / 5, 100)}%` }} // 500点でMAXとする
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
                <span>BUFFER: {secretId.length} BYTES</span>
                <span>STATUS: {allValid ? 'READY TO UPLOAD' : 'WAITING FOR INPUT'}</span>
              </div>

              {/* Submit Button */}
              <button
                disabled={!allValid}
                className={`
                  mt-12 w-full py-4 px-6 font-bold tracking-widest uppercase transition-all duration-300
                  flex items-center justify-center gap-3 clip-corner
                  ${allValid 
                    ? 'bg-[#00f0ff] text-black hover:bg-[#fff] hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] cursor-pointer' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed grayscale'}
                `}
              >
                {allValid ? <Zap size={20} className="fill-black" /> : <Lock size={20} />}
                Initiate Sequence
              </button>

            </div>

            {/* 下部の装飾 */}
            <div className="absolute bottom-8 right-12 text-right">
              <div className="text-[10px] text-gray-600 font-mono">
                 ID: 8492-AX <br/>
                 VER: 3.4.1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}