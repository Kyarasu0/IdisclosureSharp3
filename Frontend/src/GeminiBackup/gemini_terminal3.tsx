import React, { useRef, useState, useEffect, FormEvent, ReactNode } from "react";

// ==========================================
// 1. Types & Mock Data
// ==========================================

type LogType = "cmd" | "info" | "error" | "success" | "system";

interface LogEntry {
  id: string;
  type: LogType;
  cwd?: string;
  content: ReactNode;
}

const FILE_SYSTEM: any = {
  mission: {
    "target_info.txt":
      "TARGET: Project Chimera\nRISK LEVEL: TITAN\nSTATUS: Active\nCOORDINATES: 35.6895° N, 139.6917° E",
    "directive.log":
      "Operation Nightingale commencing in T-minus 12 hours.\nEnsure all traces are erased upon exit.",
    decrypt_keys: {
      "key_alpha.bin": "[ENCRYPTED FRAGMENT: 0x8A7B6C5D]",
      "key_beta.bin": "[ENCRYPTED FRAGMENT: 0xFF00AA11]",
    },
  },
  tools: {
    "bruteforce.exe": "[Executable Binary] - Core Cracker v3.1.0",
    "net_scan.sh":
      "Scanning LAN...\n[192.168.1.1] ROUTER - ALIVE\n[192.168.1.104] TARGET_HOST - ALIVE (PORTS: 22, 80, 443)",
    "override.py": "def override():\n  system.bypass_security(level='ROOT')\n  return True",
  },
  "readme.md":
    "# NEXUS CORE TERMINAL\nUnauthorized access is strictly monitored by Sentinel AI.\nType 'help' for available commands.",
};

const BOOT_SEQUENCE = [
  "INITIALIZING NEURAL LINK PROCESSOR...",
  "ALLOCATING MEMORY BLOCKS... [OK]",
  "BYPASSING PERIPHERAL FIREWALLS... [OK]",
  "DECRYPTING CORE PROTOCOLS... [OK]",
  "ESTABLISHING SECURE CONNECTION...",
  "WARNING: UNAUTHORIZED SIGNATURE DETECTED",
  "REROUTING IP TRACE TO PROXY CHAIN... [SUCCESS]",
  "MOUNTING VIRTUAL FILE SYSTEM...",
  "SYSTEM ONLINE. ACCESS GRANTED.",
];

// ==========================================
// 2. Helper Components (Decorations)
// ==========================================

// 流れるHEXダンプアニメーション
const HexMatrix = () => {
  const [hexLines, setHexLines] = useState<string[]>([]);

  useEffect(() => {
    const genLine = () =>
      Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 65535)
          .toString(16)
          .padStart(4, "0")
          .toUpperCase()
      ).join(" ");

    setHexLines(Array.from({ length: 25 }, genLine));

    const interval = setInterval(() => {
      setHexLines((prev) => [...prev.slice(1), genLine()]);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hex-matrix">
      <div className="panel-title">MEM_DUMP // LIVE</div>
      {hexLines.map((line, i) => (
        <div key={i} className="hex-line">
          0x{(i * 8).toString(16).padStart(4, "0").toUpperCase()} <span className="hex-data">{line}</span>
        </div>
      ))}
    </div>
  );
};

// 回転するレーダーUI
const Radar = () => (
  <div className="radar-wrapper">
    <div className="panel-title">SYS_RADAR</div>
    <div className="radar">
      <div className="radar-grid"></div>
      <div className="radar-sweep"></div>
      <div className="radar-blip blip-1"></div>
      <div className="radar-blip blip-2"></div>
    </div>
  </div>
);

// ==========================================
// 3. Main Application Component
// ==========================================

export default function App() {
  const [bootPhase, setBootPhase] = useState<"init" | "booting" | "ready">("init");
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>([]);
  
  const [alertMode, setAlertMode] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 時計の更新
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(
        `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")} JST`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 起動シーケンス
  useEffect(() => {
    if (bootPhase === "init") {
      setTimeout(() => setBootPhase("booting"), 500);
    }

    if (bootPhase === "booting") {
      let step = 0;
      const interval = setInterval(() => {
        if (step < BOOT_SEQUENCE.length) {
          setBootLogs((prev) => [...prev, BOOT_SEQUENCE[step]]);
          step++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setBootPhase("ready");
            setLogs([
              {
                id: crypto.randomUUID(),
                type: "system",
                content: "Welcome to Nexus Core. Type 'help' to see available commands.",
              },
            ]);
          }, 800);
        }
      }, 250);
      return () => clearInterval(interval);
    }
  }, [bootPhase]);

  // ログ追加時に一番下へスクロール
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, bootLogs]);

  const resolvePath = (path: string[]) => {
    let current: any = FILE_SYSTEM;
    for (const p of path) {
      if (current && typeof current === "object" && p in current) {
        current = current[p];
      } else return null;
    }
    return current;
  };

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const args = input.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    
    const newLogEntry: LogEntry = {
      id: crypto.randomUUID(),
      type: "cmd",
      cwd: `/${cwd.join("/")}`,
      content: input,
    };

    const nextLogs = [...logs, newLogEntry];

    switch (cmd) {
      case "help":
        nextLogs.push({
          id: crypto.randomUUID(),
          type: "info",
          content: (
            <div className="help-grid">
              <div><span className="text-cyan">help</span> - Show this message</div>
              <div><span className="text-cyan">ls</span> - List directory contents</div>
              <div><span className="text-cyan">cd</span> - Change directory</div>
              <div><span className="text-cyan">cat</span> - Read file content</div>
              <div><span className="text-cyan">clear</span> - Clear terminal output</div>
              <div><span className="text-cyan">whoami</span> - Print user identity</div>
              <div><span className="text-cyan">date</span> - Print system date</div>
              <div><span className="text-alert">sudo</span> - Execute command as superuser</div>
            </div>
          ),
        });
        break;

      case "ls":
        const dir = resolvePath(cwd);
        if (typeof dir === "object" && dir !== null) {
          const items = Object.keys(dir);
          if (items.length === 0) break;
          nextLogs.push({
            id: crypto.randomUUID(),
            type: "info",
            content: (
              <div className="ls-output">
                {items.map((k) => {
                  const isDir = typeof dir[k] === "object";
                  return (
                    <div key={k} className="ls-row">
                      <span className="ls-type">{isDir ? "<DIR>" : "<FILE>"}</span>
                      <span className={`ls-name ${isDir ? "text-cyan glow" : "text-gray"}`}>{k}</span>
                      <span className="ls-size">{isDir ? "---" : `${(dir[k].length * 1.5).toFixed(0)}B`}</span>
                    </div>
                  );
                })}
              </div>
            ),
          });
        } else {
          nextLogs.push({ id: crypto.randomUUID(), type: "error", content: "ls: cannot access: Not a directory" });
        }
        break;

      case "cd":
        const target = args[1];
        if (!target || target === "~" || target === "/") {
          setCwd([]);
        } else if (target === "..") {
          setCwd((p) => p.slice(0, -1));
        } else {
          const nextDir = resolvePath([...cwd, target]);
          if (typeof nextDir === "object" && nextDir !== null) {
            setCwd((p) => [...p, target]);
          } else {
            nextLogs.push({ id: crypto.randomUUID(), type: "error", content: `cd: ${target}: No such directory` });
          }
        }
        break;

      case "cat":
        const fileTarget = args[1];
        if (!fileTarget) {
          nextLogs.push({ id: crypto.randomUUID(), type: "error", content: "cat: missing file operand" });
        } else {
          const file = resolvePath([...cwd, fileTarget]);
          if (typeof file === "string") {
            nextLogs.push({ id: crypto.randomUUID(), type: "info", content: <pre className="cat-output">{file}</pre> });
          } else {
            nextLogs.push({ id: crypto.randomUUID(), type: "error", content: `cat: ${fileTarget}: No such file or is a directory` });
          }
        }
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      case "whoami":
        nextLogs.push({ id: crypto.randomUUID(), type: "info", content: "GHOST_OPERATIVE_#8492" });
        break;
        
      case "date":
        nextLogs.push({ id: crypto.randomUUID(), type: "info", content: new Date().toString() });
        break;

      case "sudo":
        setAlertMode(true);
        setTimeout(() => setAlertMode(false), 3000);
        nextLogs.push({
          id: crypto.randomUUID(),
          type: "error",
          content: "ACCESS DENIED: UNAUTHORIZED PRIVILEGE ESCALATION ATTEMPT LOGGED. TRACING IP...",
        });
        break;

      default:
        nextLogs.push({ id: crypto.randomUUID(), type: "error", content: `command not found: ${cmd}` });
    }

    setLogs(nextLogs);
    setInput("");
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`cyber-root ${alertMode ? "alert-mode" : ""}`} onClick={focusInput}>
      <style>{CSS_STYLES}</style>

      {/* 背景エフェクト */}
      <div className="scanlines" />
      <div className="vignette" />
      <div className="ambient-noise" />

      {bootPhase !== "ready" ? (
        // 起動画面
        <div className="boot-screen">
          <div className="boot-logs">
            {bootLogs.map((log, i) => (
              <div key={i} className="boot-line">{log}</div>
            ))}
            {bootPhase === "booting" && <span className="blink-cursor">_</span>}
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${(bootLogs.length / BOOT_SEQUENCE.length) * 100}%` }} />
          </div>
        </div>
      ) : (
        // メイン画面
        <div className="main-layout fade-in">
          
          {/* 左側パネル (装飾) */}
          <div className="side-panel left-panel">
            <HexMatrix />
          </div>

          {/* 中央ターミナル (Glassmorphism) */}
          <div className="glass-terminal">
            {/* サイバーなコーナー装飾 */}
            <svg className="corner-decor top-left" viewBox="0 0 30 30">
              <path d="M 0 30 L 0 0 L 30 0" fill="none" stroke="var(--theme-color)" strokeWidth="2" />
            </svg>
            <svg className="corner-decor top-right" viewBox="0 0 30 30">
              <path d="M 0 0 L 30 0 L 30 30" fill="none" stroke="var(--theme-color)" strokeWidth="2" />
            </svg>
            <svg className="corner-decor bottom-left" viewBox="0 0 30 30">
              <path d="M 0 0 L 0 30 L 30 30" fill="none" stroke="var(--theme-color)" strokeWidth="2" />
            </svg>
            <svg className="corner-decor bottom-right" viewBox="0 0 30 30">
              <path d="M 30 0 L 30 30 L 0 30" fill="none" stroke="var(--theme-color)" strokeWidth="2" />
            </svg>

            <div className="terminal-header">
              <div className="header-left">
                <span className="pulse-dot" /> NEXUS_OS // TERMINAL
              </div>
              <div className="header-right">{currentTime}</div>
            </div>

            <div className="terminal-logs" ref={logRef}>
              {logs.map((log) => (
                <div key={log.id} className={`log-entry log-type-${log.type} slide-in`}>
                  {log.type === "cmd" && (
                    <span className="prompt-prefix">root@nexus:{log.cwd}# </span>
                  )}
                  <div className="log-content">{log.content}</div>
                </div>
              ))}
            </div>

            <form className="terminal-input-form" onSubmit={handleCommand}>
              <span className="prompt-prefix">root@nexus:/{cwd.join("/")}# </span>
              <input
                ref={inputRef}
                className="terminal-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <span className="input-caret" />
            </form>
          </div>

          {/* 右側パネル (装飾) */}
          <div className="side-panel right-panel">
            <Radar />
            <div className="sys-stats">
              <div className="panel-title">SYS_STATS</div>
              <div className="stat-row"><span>CPU</span> <div className="bar"><div className="fill w-40"></div></div></div>
              <div className="stat-row"><span>RAM</span> <div className="bar"><div className="fill w-70"></div></div></div>
              <div className="stat-row"><span>NET</span> <div className="bar"><div className="fill w-90"></div></div></div>
              <div className="stat-info mt-2 text-cyan">UPLINK: SECURE</div>
              <div className="stat-info text-alert">FIREWALL: BYPASSED</div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. CSS (Scoped & Injected)
// ==========================================

const CSS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  :root {
    --cyan: #22d3ee;
    --cyan-glow: rgba(34, 211, 238, 0.6);
    --alert: #ef4444;
    --alert-glow: rgba(239, 68, 68, 0.6);
    --bg-dark: #020617;
    --glass-bg: rgba(10, 15, 30, 0.5);
    
    --theme-color: var(--cyan);
    --theme-glow: var(--cyan-glow);
  }

  /* Reset & Base */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .cyber-root {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: var(--bg-dark);
    color: var(--theme-color);
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  /* Alert Mode Override */
  .cyber-root.alert-mode {
    --theme-color: var(--alert);
    --theme-glow: var(--alert-glow);
    animation: alert-pulse 1s infinite alternate;
  }
  @keyframes alert-pulse {
    0% { box-shadow: inset 0 0 50px rgba(239, 68, 68, 0.1); }
    100% { box-shadow: inset 0 0 150px rgba(239, 68, 68, 0.4); }
  }

  /* --- Background Effects --- */
  .scanlines {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 50;
  }
  .vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%);
    pointer-events: none;
    z-index: 49;
  }
  .ambient-noise {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* --- Utility Classes --- */
  .text-cyan { color: var(--cyan); }
  .text-alert { color: var(--alert); text-shadow: 0 0 5px var(--alert-glow); }
  .text-gray { color: #94a3b8; }
  .glow { text-shadow: 0 0 8px var(--theme-glow); }
  .mt-2 { margin-top: 0.5rem; }

  /* --- Boot Screen --- */
  .boot-screen {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 10%;
    z-index: 100;
  }
  .boot-logs {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    text-shadow: 0 0 5px var(--theme-glow);
  }
  .boot-line {
    margin-bottom: 0.5rem;
  }
  .blink-cursor {
    animation: blink 1s step-end infinite;
  }
  .progress-bar-container {
    width: 100%;
    max-width: 600px;
    height: 4px;
    background: rgba(34, 211, 238, 0.2);
    position: relative;
  }
  .progress-bar-fill {
    height: 100%;
    background: var(--theme-color);
    box-shadow: 0 0 10px var(--theme-color);
    transition: width 0.2s linear;
  }

  /* --- Main Layout --- */
  .main-layout {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 200px 1fr 250px;
    gap: 1.5rem;
    padding: 1.5rem;
    z-index: 10;
  }
  .fade-in {
    animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); filter: blur(4px); }
    to { opacity: 1; transform: scale(1); filter: blur(0); }
  }

  /* --- Side Panels --- */
  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .panel-title {
    font-size: 0.8rem;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    border-bottom: 1px dashed var(--theme-color);
    padding-bottom: 0.2rem;
    opacity: 0.8;
  }
  
  /* Hex Matrix */
  .hex-matrix {
    font-size: 0.75rem;
    color: rgba(34, 211, 238, 0.5);
  }
  .hex-line { margin-bottom: 0.2rem; display: flex; gap: 0.5rem; }
  .hex-data { color: rgba(255, 255, 255, 0.6); }

  /* Radar */
  .radar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .radar {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px solid var(--theme-color);
    background: rgba(34, 211, 238, 0.05);
    box-shadow: 0 0 15px var(--theme-glow), inset 0 0 15px var(--theme-glow);
    overflow: hidden;
  }
  .radar-grid {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: 
      linear-gradient(90deg, transparent 49%, rgba(34, 211, 238, 0.3) 50%, transparent 51%),
      linear-gradient(0deg, transparent 49%, rgba(34, 211, 238, 0.3) 50%, transparent 51%),
      repeating-radial-gradient(circle at center, transparent 0, transparent 15px, rgba(34, 211, 238, 0.2) 16px);
  }
  .radar-sweep {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg, transparent 70%, rgba(34, 211, 238, 0.6) 100%);
    animation: radar-spin 2s linear infinite;
  }
  @keyframes radar-spin { 100% { transform: rotate(360deg); } }
  .radar-blip {
    position: absolute;
    width: 4px; height: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 5px #fff, 0 0 10px var(--theme-color);
    opacity: 0;
  }
  .blip-1 { top: 30%; left: 60%; animation: blip-flash 2s infinite 0.5s; }
  .blip-2 { top: 70%; left: 30%; animation: blip-flash 2s infinite 1.2s; }
  @keyframes blip-flash {
    0% { opacity: 0; transform: scale(0.5); }
    10% { opacity: 1; transform: scale(1.5); }
    20%, 100% { opacity: 0; transform: scale(1); }
  }

  /* Stats */
  .sys-stats { font-size: 0.8rem; }
  .stat-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
  .stat-row span { width: 30px; }
  .bar { flex: 1; height: 6px; background: rgba(255,255,255,0.1); }
  .fill { height: 100%; background: var(--theme-color); box-shadow: 0 0 5px var(--theme-glow); }
  .w-40 { width: 40%; } .w-70 { width: 70%; } .w-90 { width: 90%; }

  /* --- Glass Terminal Core --- */
  .glass-terminal {
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--glass-bg);
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
    border: 1px solid rgba(34, 211, 238, 0.2);
    border-top: 1px solid rgba(34, 211, 238, 0.6);
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.6),
      inset 0 0 30px rgba(34, 211, 238, 0.05),
      0 0 20px var(--theme-glow);
    border-radius: 4px;
    padding: 1rem;
    overflow: hidden;
  }

  /* Corner Decors */
  .corner-decor {
    position: absolute;
    width: 20px;
    height: 20px;
    opacity: 0.8;
    filter: drop-shadow(0 0 5px var(--theme-glow));
  }
  .top-left { top: -1px; left: -1px; }
  .top-right { top: -1px; right: -1px; }
  .bottom-left { bottom: -1px; left: -1px; }
  .bottom-right { bottom: -1px; right: -1px; }

  /* Terminal Header */
  .terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(34, 211, 238, 0.2);
    font-size: 0.9rem;
    letter-spacing: 1px;
    opacity: 0.9;
  }
  .pulse-dot {
    display: inline-block;
    width: 8px; height: 8px;
    background: var(--theme-color);
    border-radius: 50%;
    margin-right: 8px;
    box-shadow: 0 0 8px var(--theme-color);
    animation: blink 2s infinite;
  }
  @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.3; } }

  /* Terminal Logs */
  .terminal-logs {
    flex: 1;
    overflow-y: auto;
    font-size: 1rem;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 10px;
  }
  .terminal-logs::-webkit-scrollbar { width: 4px; }
  .terminal-logs::-webkit-scrollbar-track { background: transparent; }
  .terminal-logs::-webkit-scrollbar-thumb { background: var(--theme-color); border-radius: 2px; }

  .log-entry { display: flex; flex-direction: column; }
  .slide-in { animation: slideIn 0.2s ease-out forwards; }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .prompt-prefix {
    color: var(--theme-color);
    text-shadow: 0 0 5px var(--theme-glow);
    margin-right: 0.5rem;
    font-weight: bold;
  }
  .log-type-cmd .log-content { display: inline-block; color: #fff; }
  .log-type-info { color: #e2e8f0; }
  .log-type-error { color: var(--alert); text-shadow: 0 0 5px var(--alert-glow); }
  .log-type-system { color: #fde047; text-shadow: 0 0 5px rgba(253, 224, 71, 0.5); }

  /* Custom output styles */
  .ls-output { display: grid; gap: 0.2rem; margin-top: 0.2rem; }
  .ls-row { display: grid; grid-template-columns: 60px 1fr 60px; gap: 1rem; }
  .cat-output { background: rgba(0,0,0,0.3); padding: 0.5rem; border-left: 2px solid var(--theme-color); margin-top: 0.2rem; white-space: pre-wrap; font-family: inherit; }
  .help-grid { display: grid; gap: 0.3rem; margin-top: 0.2rem; }

  /* Terminal Input */
  .terminal-input-form {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(34, 211, 238, 0.2);
    position: relative;
  }
  .terminal-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-family: inherit;
    font-size: 1rem;
    caret-color: transparent; /* Custom caret via span */
  }
  
  /* Custom blinking caret positioned absolutely relative to input text length - simplified version uses native caret with styling for reliability, but let's fake it with a block */
  .terminal-input:focus {
    box-shadow: none;
  }
  .terminal-input::placeholder { color: transparent; }
  
  /* Fallback to simple glowing text for input */
  .terminal-input {
    caret-color: var(--theme-color);
    text-shadow: 0 0 5px rgba(255,255,255,0.5);
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .main-layout { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; }
    .side-panel { display: none; } /* Hide panels on small screens to prioritize terminal */
  }
`;