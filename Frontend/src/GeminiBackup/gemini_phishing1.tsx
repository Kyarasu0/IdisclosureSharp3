import React, { useState, useEffect, type ReactNode } from 'react';
import { 
  Server, 
  Globe, 
  ShieldAlert, 
  Activity, 
  Power, 
  Wifi, 
  Smartphone,
  Cpu,
  Unlock,
  ChevronRight,
  Battery,
  Clock
} from 'lucide-react';

// ============================================================================
// 🎨 カスタムCSS (module.cssの代用)
// ============================================================================
const customStyles = `
  .mesh-bg {
    background-color: #050a15;
    background-image: 
      linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    background-position: center center;
  }

  .cyber-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* サイバーウィンドウの展開アニメーション */
  .cyber-panel {
    position: relative;
    width: 0;
    height: 2px;
    background: transparent;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                height 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, 
                background 0.3s ease 0.8s,
                opacity 0.3s ease;
    opacity: 0;
    display: flex;
    flex-direction: column;
  }

  .cyber-panel.animating-line {
    opacity: 1;
    width: 100%;
    background: rgba(34, 211, 238, 0.8);
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
  }

  .cyber-panel.animating-expand {
    height: 100%;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(34, 211, 238, 0.3);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }

  /* 装飾用コーナー */
  .corner-deco {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(34, 211, 238, 0.8);
    opacity: 0;
    transition: opacity 0.3s ease 0.8s;
  }
  .animating-expand .corner-deco { opacity: 1; }
  .cTl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
  .cTr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
  .cBl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
  .cBr { bottom: -2px; right: -2px; border-left: none; border-top: none; }

  .panel-content {
    opacity: 0;
    transition: opacity 0.5s ease 0.9s;
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    overflow: hidden;
  }
  .panel-content.show { opacity: 1; }

  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .glass-card:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(34, 211, 238, 0.4);
    transform: translateY(-2px);
  }

  /* スキャンライン */
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  .scanline-effect::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 20vh;
    background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.03), transparent);
    animation: scanline 8s linear infinite;
    pointer-events: none;
    z-index: 100;
  }

  /* スクロールバーのカスタマイズ */
  .custom-scroll::-webkit-scrollbar { width: 4px; }
  .custom-scroll::-webkit-scrollbar-track { background: transparent; }
  .custom-scroll::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 10px; }
`;

// ============================================================================
// 🧩 コンポーネント: CyberWindow
// ============================================================================
type Props = {
  children: ReactNode;
  bootState: number;
  alertActive?: boolean;
};

export const CyberWindow = ({ children, bootState, alertActive }: Props) => {
  return (
    <div className="cyber-container">
      <div
        className={`cyber-panel 
          ${bootState >= 1 ? 'animating-line' : ''} 
          ${bootState >= 2 ? 'animating-expand' : ''} 
          ${alertActive ? 'border-rose-500 shadow-rose-500/20' : ''}
        `}
      >
        <div className="corner-deco cTl"></div>
        <div className="corner-deco cTr"></div>
        <div className="corner-deco cBl"></div>
        <div className="corner-deco cBr"></div>

        <div className={`panel-content ${bootState >= 3 ? 'show' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 🎮 メインアプリケーション
// ============================================================================

// ターゲットサイトのリスト (JSON形式を想定)
const SITE_LIST = [
  { id: 'sns', name: 'Connect-X SNS', category: 'Social', icon: <Smartphone className="w-5 h-5 text-sky-400" />, security: 'Low' },
  { id: 'bank', name: 'Swift Bank Portal', category: 'Finance', icon: <Unlock className="w-5 h-5 text-amber-400" />, security: 'High' },
  { id: 'mail', name: 'SkyMail Service', category: 'Mail', icon: <Globe className="w-5 h-5 text-emerald-400" />, security: 'Medium' },
  { id: 'cloud', name: 'Zenith Cloud Storage', category: 'Storage', icon: <Server className="w-5 h-5 text-purple-400" />, security: 'High' },
];

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bootState, setBootState] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // 時計の更新
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // サイト選択時の処理
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setBootState(1);
    setTimeout(() => setBootState(2), 450);
    setTimeout(() => {
      setBootState(3);
      generateLogs();
    }, 900);
  };

  // 停止処理
  const handleStop = () => {
    setBootState(0);
    setTimeout(() => {
      setSelectedId(null);
      setLogs([]);
    }, 600);
  };

  const generateLogs = () => {
    const baseLogs = [
      "Initializing Ghost Protocol...",
      "Cloning target CSS modules...",
      "Setting up proxy redirect...",
      "Injecting session listener...",
      "Server is running on port 8080",
      "WAITING FOR CONNECTION..."
    ];
    baseLogs.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
      }, i * 600);
    });
  };

  const currentSite = SITE_LIST.find(s => s.id === selectedId);

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen mesh-bg scanline-effect text-slate-100 font-sans overflow-hidden flex flex-col md:flex-row">
        
        {/* --- 左エリア & 真ん中エリア統合: メイン操作盤 --- */}
        <div className="flex-[2] relative p-6 flex flex-col border-r border-cyan-900/20">
          
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-cyan-400">
                <Cpu className="w-8 h-8" /> PHISH_CONTROL_v4
              </h1>
              <div className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mt-1">
                Authorized access only // Node: 0xF24A
              </div>
            </div>
          </header>

          <div className="flex-1 relative">
            {/* 状態1: リスト選択 (Bento Grid) */}
            <div className={`transition-all duration-500 absolute inset-0 ${selectedId ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SITE_LIST.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => handleSelect(site.id)}
                    className="glass-card p-6 flex flex-col gap-4 text-left group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-cyan-500/20 transition-colors">
                        {site.icon}
                      </div>
                      <div className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10 text-slate-400">
                        SEC: {site.security}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg group-hover:text-cyan-400 transition-colors">{site.name}</div>
                      <div className="text-xs text-slate-500">{site.category} Web Host</div>
                    </div>
                    <div className="flex items-center text-xs text-cyan-600 font-mono opacity-0 group-hover:opacity-100 transition-all">
                      INITIALIZE_HOST <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 状態2: CyberWindowによるホスティング画面 */}
            <div className={`absolute inset-0 z-20 ${!selectedId ? 'pointer-events-none' : ''}`}>
              <CyberWindow bootState={bootState}>
                {currentSite && (
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-400 blur-md opacity-20 animate-pulse"></div>
                          <div className="relative p-3 bg-cyan-500/20 rounded-xl">
                            <Server className="w-6 h-6 text-cyan-400" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-cyan-500 font-mono flex items-center gap-1">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
                            HOSTING_ACTIVE
                          </div>
                          <div className="text-xl font-bold">{currentSite.name} Proxy</div>
                        </div>
                      </div>
                      <button 
                        onClick={handleStop}
                        className="p-3 hover:bg-rose-500/20 rounded-xl transition-colors group"
                      >
                        <Power className="w-5 h-5 text-slate-500 group-hover:text-rose-500 transition-colors" />
                      </button>
                    </div>

                    <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col">
                      <div className="text-[10px] text-cyan-800 mb-2 border-b border-cyan-900/30 pb-1">LIVE_TRAFFIC_LOG</div>
                      <div className="flex-1 space-y-1 custom-scroll overflow-y-auto">
                        {logs.map((log, i) => (
                          <div key={i} className="text-cyan-400/80 animate-in fade-in slide-in-from-left-2">
                            {log}
                          </div>
                        ))}
                        {logs.length > 0 && <div className="w-2 h-4 bg-cyan-400 animate-pulse inline-block"></div>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { label: 'TRAFFIC', val: '0B' },
                        { label: 'HITS', val: '0' },
                        { label: 'STATUS', val: '200 OK' }
                      ].map((s, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-xl text-center">
                          <div className="text-[9px] text-slate-500 font-mono uppercase">{s.label}</div>
                          <div className="text-sm font-bold font-mono text-cyan-200">{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CyberWindow>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}