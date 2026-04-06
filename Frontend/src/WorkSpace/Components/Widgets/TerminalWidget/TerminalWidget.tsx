import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';
import styles from './TerminalWidget.module.css';
// SOF用
import { useNavigate, useLocation } from 'react-router-dom';

const cx = (...classNames: Array<string | undefined | null | false>) =>
  classNames.filter((c): c is string => Boolean(c)).join(' ');

// ==============================
// Types & Constants
// ==============================
type LogType = 'cmd' | 'info' | 'error' | 'success' | 'system';

interface LogEntry {
  id: string;
  type: LogType;
  cwd?: string;
  content: ReactNode;
}

const FILE_SYSTEM: any = {
  mission: {
    'target_info.txt': 'TARGET: Project Chimera\nSTATUS: Active',
  },
  tools: {
    'net_scan.sh': 'Scanning LAN...\n[OK]',
  },
};

// ==============================
// Radar Decoration Component
// ==============================
const Radar = () => (
  <div className={styles['radar-wrapper']}>
    <div className={styles['panel-title-deco']}>SYS_RADAR</div>
    <div className={styles.radar}>
      <div className={styles['radar-grid']} />
      <div className={styles['radar-sweep']} />
      <div className={cx(styles['radar-blip'], styles.blip1)} />
      <div className={cx(styles['radar-blip'], styles.blip2)} />
    </div>
  </div>
);

// ==============================
// Main Application
// ==============================
export function TerminalWidget() {
  const [bootState, setBootState] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<string[]>([]);
  const [alertMode, setAlertMode] = useState(false);
  // SOF用
  const navigate = useNavigate();
  const location = useLocation();

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setBootState(1), 300);
    const t2 = setTimeout(() => setBootState(2), 700);
    const t3 = setTimeout(() => {
      setBootState(3);
      setLogs([
        { id: crypto.randomUUID(), type: 'system', content: '--- NEXUS CORE OS v4.0.2 ---' },
        { id: crypto.randomUUID(), type: 'system', content: 'ESTABLISHING SECURE UPLINK...' },
        { id: crypto.randomUUID(), type: 'success', content: 'CONNECTION ENCRYPTED. READY.' },
      ]);
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Backspace") {
          setInput((prev) => prev.slice(0, -1));
        } else if (e.key === "Enter") {
          handleCommand(e as any);
        } else if (e.key.length === 1) {
          setInput((prev) => prev + e.key);
        }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [input]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const resolvePath = (path: string[]) => {
    let current: any = FILE_SYSTEM;
    for (const p of path) {
      if (current[p]) current = current[p];
      else return null;
    }
    return current;
  };

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const args = input.trim().split(' ');
    const cmd = args[0].toLowerCase();

    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      type: 'cmd',
      cwd: `/${cwd.join('/')}`,
      content: input,
    };

    const updatedLogs = [...logs, newLog];
    let nextLogs = updatedLogs;

    switch (cmd) {
      case 'ls': {
        const dir = resolvePath(cwd);
        if (typeof dir === 'object') {
          nextLogs = [...updatedLogs, { id: crypto.randomUUID(), type: 'info', content: Object.keys(dir).join('  ') }];
        }
        break;
      }
      case 'cd': {
        const target = args[1];
        if (!target || target === '/') {
          setCwd([]);
        } else if (target === '..') {
          setCwd((p) => p.slice(0, -1));
        } else if (resolvePath([...cwd, target])) {
          setCwd([...cwd, target]);
        } else {
          nextLogs = [...updatedLogs, { id: crypto.randomUUID(), type: 'error', content: `no such directory: ${target}` }];
        }
        break;
      }
      case 'clear': {
        setLogs([]);
        setInput('');
        return;
      }
      case 'sudo': {
        setAlertMode(true);
        setTimeout(() => setAlertMode(false), 1500);
        nextLogs = [...updatedLogs, { id: crypto.randomUUID(), type: 'error', content: 'ACCESS DENIED: UNAUTHORIZED PRIVILEGE ESCALATION' }];
        break;
      }
      case 'help': {
        nextLogs = [...updatedLogs, { id: crypto.randomUUID(), type: 'info', content: 'AVAILABLE: ls, cd [dir], clear, sudo, help, exit' }];
        break;
      }
      case 'sof': {
        const arg = args[1];

        if (arg === 'success' || arg === 'failed') {
          navigate('/sof', {
            state: {
              result: arg,
              from: location.pathname
            }
          });
        } else {
          nextLogs = [
            ...updatedLogs,
            {
              id: crypto.randomUUID(),
              type: 'error',
              content: 'usage: sof [success | failed]'
            }
          ];
        }
        break;
      }
      default: {
        nextLogs = [...updatedLogs, { id: crypto.randomUUID(), type: 'error', content: `command not found: ${cmd}` }];
      }
    }

    setLogs(nextLogs);
    setInput('');
  };

  return (
    <div className={cx(styles['app-container'], alertMode && styles['alert-active'])}>
      <div className={styles['panel-wrapper']}>
        <div className={cx(styles['glass-panel'], bootState === 1 && styles['animating-line'], bootState >= 2 && styles['animating-expand'])}>
          <div className={cx(styles['corner'], styles['corner-tl'])} />
          <div className={cx(styles['corner'], styles['corner-tr'])} />
          <div className={cx(styles['corner'], styles['corner-bl'])} />
          <div className={cx(styles['corner'], styles['corner-br'])} />

          <div className={cx(styles['panel-content'], bootState >= 2 && styles.show)}>
            <div className={styles['terminal-header']}>
              <div className={styles['header-left']}>
                <Terminal size={14} className={styles['icon-pulse']} />
                <span className={styles['header-title']}>TERMINAL_STATION_01</span>
              </div>
            </div>

            <div className={styles['main-layout']}>
              <div className={styles['terminal-body']} onClick={() => inputRef.current?.focus()}>
                <div className={styles['logs-area']} ref={logRef}>
                  {logs.map((log) => (
                    <div key={log.id} className={cx(styles['log-entry'], styles[`log-${log.type}`])}>
                      {log.type === 'cmd' && <span className={styles['prompt-prefix']}>root@nx:{log.cwd}# </span>}
                      {log.type === 'system' && <span className={styles['system-tag']}>[SYS] </span>}
                      {log.type === 'error' && <ShieldAlert size={12} style={{ marginRight: '6px' }} />}
                      <span className={styles['log-text']}>{log.content}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCommand} className={styles['input-row']}>
                    <span className={styles['prompt-prefix']}>
                        root@nx:/{cwd.join('/')}#
                    </span>

                    <span className={styles['fake-input']}>
                        {input}
                        <span className={styles['cursor-block']} />
                    </span>
                </form>
              </div>

              <div className={styles['side-panel']}>
                <Radar />
                <div className={styles['side-deco-list']}>
                  <div className={styles['side-deco-item']}>
                    <div className={styles['deco-bar-label']}>ENCRYPTION</div>
                    <div className={styles['deco-bar-bg']}>
                      <div className={styles['deco-bar-fill']} style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className={styles['side-deco-item']}>
                    <div className={styles['deco-bar-label']}>MEMORY</div>
                    <div className={styles['deco-bar-bg']}>
                      <div className={styles['deco-bar-fill']} style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
