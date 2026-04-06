import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import styles from './SuccessOrFailed.module.css';
import { Terminal, Unlock, Lock, Loader2 } from 'lucide-react';

type ResultType = 'success' | 'failed';

const generateIP = () =>
  `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*10)}.${Math.floor(Math.random()*255)}`;

const generateHex = () =>
  Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join('');

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

export function SuccessOrFailed() {
  const location = useLocation();
  const navigate = useNavigate();

  const result: ResultType | undefined = location.state?.result;
  const from: string = location.state?.from || "/";

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const [phase, setPhase] = useState<'boot'|'hacking'|'suspense'|'result'>('boot');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("5.00");

  const logRef = useRef<HTMLDivElement>(null);

  // ==============================
  // ① boot → hacking
  // ==============================
  useEffect(() => {
    if (phase !== 'boot') return;

    const t = setTimeout(() => {
      setPhase('hacking');
    }, 800);

    return () => clearTimeout(t);
  }, [phase]);

  // ==============================
  // ② hacking（ログ + プログレス）
  // ==============================
  useEffect(() => {
    if (phase !== 'hacking') return;

    const duration = 5000;
    const start = Date.now();

    const logInterval = setInterval(() => {
      setLogs(prev =>
        [...prev, generateLogEntry(), generateLogEntry()].slice(-80)
      );
    }, 30);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;

      const p = Math.min((elapsed / duration) * 100, 100);
      const left = Math.max((duration - elapsed) / 1000, 0).toFixed(2);

      setProgress(p);
      setTimeLeft(left);

      if (elapsed >= duration) {
        clearInterval(logInterval);
        clearInterval(progressInterval);
        setPhase('suspense');
      }
    }, 50);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [phase]);

  // ==============================
  // ③ suspense（ログ追加）
  // ==============================
  useEffect(() => {
    if (phase !== 'suspense') return;

    setLogs(prev => [
      ...prev,
      "",
      ">>> CRITICAL OPERATION IN PROGRESS...",
      ">>> AWAITING SERVER RESPONSE...",
      ""
    ]);
  }, [phase]);

  // ==============================
  // ④ suspense → result
  // ==============================
  useEffect(() => {
    if (phase !== 'suspense') return;

    const t = setTimeout(() => {
      setPhase('result');
    }, 1500);

    return () => clearTimeout(t);
  }, [phase]);

  // ==============================
  // ⑤ スクロール追従
  // ==============================
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  // ==============================
  // ⑥ result → 元画面へ戻る
  // ==============================
  useEffect(() => {
    if (phase !== 'result') return;

    const t = setTimeout(() => {
      navigate(from, { replace: true });
    }, 4000);

    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className={styles.overlay}>
      <div className={`${styles.terminal} ${phase === 'boot' ? styles.boot : styles.full}`}>

        <div className={styles.header}>
          <div className={styles.title}>
            <Terminal size={18}/>
            ROOT_ACCESS_TERMINAL
          </div>

          {(phase === 'hacking' || phase === 'suspense') && (
            <div className={styles.loader}>
              <Loader2 size={16} className={styles.spin}/>
              {phase === 'suspense' ? 'VERIFYING' : 'PROCESSING'}
            </div>
          )}
        </div>

        {(phase === 'hacking' || phase === 'suspense') && (
          <div className={styles.progressWrap}>
            <div className={styles.progressText}>
              <span>
                {phase === 'suspense'
                  ? 'FINALIZING...'
                  : 'BYPASSING FIREWALL...'}
              </span>
              <span>{timeLeft}s</span>
            </div>

            <div className={styles.progressBar}>
              <div
                style={{ width: `${progress}%` }}
                className={styles.progressFill}
              />
            </div>
          </div>
        )}

        <div className={styles.body}>
          <div
            ref={logRef}
            className={`${styles.log} ${phase === 'result' ? styles.fadeOut : ''}`}
          >
            {logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>

          {phase === 'result' && (
            <div className={styles.result}>
              <h2 style={{color:'white'}}>DEBUG RESULT</h2>
              {result === 'success' ? (
                <>
                  <Unlock size={80} className={styles.success}/>
                  <h2>SUCCESS</h2>
                </>
              ) : (
                <>
                  <Lock size={80} className={styles.failed}/>
                  <h2>FAILED</h2>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}