import React, { useState, useEffect } from 'react';

/**
 * プロップスの型定義
 */
interface CyberTimerPanelProps {
  /** 全体のスケール調整用 (0.5〜2.0など) */
  scale?: number;
  /** ダイヤルの初期値 (5-15) */
  initialValue?: number;
  /** 値変更時のコールバック */
  onValueChange?: (val: number) => void;
  /** 表示ラベル */
  label?: string;
}

/**
 * サイバーパンク・デジタルタイマーパネル コンポーネント
 */
const CyberTimerPanel: React.FC<CyberTimerPanelProps> = ({
  scale = 1.0,
  initialValue = 10,
  onValueChange,
  label = "MISSION_TIMER_v1.0"
}) => {
  // --- ステート管理 ---
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [dialValue, setDialValue] = useState<number>(initialValue);
  
  // --- 時計の更新処理 ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 時刻のフォーマット処理 ---
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');

  // --- ダイヤルの操作処理 ---
  const handleUpdate = (increment: boolean) => {
    const nextValue = increment ? dialValue + 1 : dialValue - 1;
    if (nextValue >= 5 && nextValue <= 15) {
      setDialValue(nextValue);
      if (onValueChange) onValueChange(nextValue);
    }
  };

  // --- SVGゲージの計算 (半径34, 円周 約213) ---
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = (dialValue - 5) / (15 - 5);
  const offset = circumference - progress * circumference;

  return (
    <div 
      className="ctp-container" 
      style={{ transform: `scale(${scale})` } as React.CSSProperties}
    >
      <style>{`
        /* サイバータイマーパネル スタイル */

        .ctp-container {
          /* 大きさ設定: 横幅や縦幅を設定する(width/height) */
          width: fit-content;
          height: auto;
          /* 文字設定: 文字の色やフォントなど */
          color: #00f3ff;
          font-family: 'Share Tech Mono', 'Courier New', monospace;
          /* 配置基準設定: (static, relative, absolute) */
          position: relative;
          transform-origin: center center;
          user-select: none;
        }

        .ctp-mainPanel {
          /* 大きさ設定: 横幅や縦幅を設定する(width/height) */
          width: 460px;
          height: 160px;
          /* バックグラウンド設定: 背景色など */
          background: rgba(10, 25, 47, 0.7);
          /* 要素配置設定: (display, justify-content, align-items) */
          display: flex;
          align-items: center;
          justify-content: space-around;
          /* 余白設定: (margin, padding) */
          padding: 0 25px;
          /* 装飾設定: 影など */
          border: 1px solid rgba(0, 243, 255, 0.3);
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          border-radius: 4px;
          /* 配置基準設定: (static, relative, absolute) */
          position: relative;
          overflow: hidden;
        }

        /* --- 時計エリア --- */
        .ctp-clockArea {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
        }

        .ctp-systemTag {
          font-size: 10px;
          letter-spacing: 1px;
          color: rgba(0, 243, 255, 0.6);
          margin-bottom: 4px;
        }

        .ctp-digitalDisplay {
          display: flex;
          align-items: baseline;
          text-shadow: 0 0 10px rgba(0, 243, 255, 0.6);
        }

        .ctp-timeDigit {
          font-size: 3.5rem;
          font-weight: bold;
        }

        .ctp-timeSeparator {
          font-size: 2.5rem;
          margin: 0 4px;
          animation: ctp-blink 1s steps(1) infinite;
        }

        .ctp-timeSeparatorSmall {
          font-size: 1.5rem;
          opacity: 0.5;
        }

        .ctp-secondsDigit {
          font-size: 1.8rem;
          color: rgba(0, 243, 255, 0.8);
          margin-left: 5px;
        }

        .ctp-dataLog {
          font-size: 9px;
          opacity: 0.5;
          margin-top: 5px;
        }

        /* --- ダイヤルエリア --- */
        .ctp-dialArea {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .ctp-labelHeader {
          font-size: 11px;
          text-align: center;
          background: rgba(0, 243, 255, 0.1);
          padding: 2px 10px;
          margin-bottom: 8px;
          border-left: 3px solid #00f3ff;
        }

        .ctp-gaugeContainer {
          width: 100px;
          height: 100px;
          position: relative;
        }

        .ctp-gaugeSvg {
          transform: rotate(-90deg);
        }

        .ctp-gaugeTrack {
          fill: none;
          stroke: rgba(0, 243, 255, 0.05);
          stroke-width: 6;
        }

        .ctp-gaugeBar {
          fill: none;
          stroke: #00f3ff;
          stroke-width: 6;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ctp-gaugeValue {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ctp-valueNumber {
          font-size: 2.2rem;
          font-weight: bold;
          line-height: 1;
          text-shadow: 0 0 15px rgba(0, 243, 255, 0.5);
        }

        .ctp-valueUnit {
          font-size: 9px;
          letter-spacing: 1px;
        }

        /* --- ボタン --- */
        .ctp-buttonOverlay {
          width: 130%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }

        .ctp-adjustBtn {
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.6);
          color: #00f3ff;
          font-size: 1.2rem;
          border: 1px solid #00f3ff;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          transition: all 0.2s;
        }

        .ctp-adjustBtn:hover:not(:disabled) {
          background: #00f3ff;
          color: #000;
          box-shadow: 0 0 15px #00f3ff;
        }

        .ctp-adjustBtn:disabled {
          color: #444;
          border-color: #444;
          cursor: not-allowed;
        }

        /* --- 装飾系 --- */
        .ctp-verticalDivider {
          width: 1px;
          height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(0, 243, 255, 0.5), transparent);
        }

        .ctp-cornerDecor {
          width: 8px;
          height: 8px;
          border: 1px solid #00f3ff;
          position: absolute;
        }
        .ctp-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .ctp-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
        .ctp-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
        .ctp-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }

        .ctp-bottomStatus {
          font-size: 9px;
          letter-spacing: 1px;
          opacity: 0.6;
          margin-top: 10px;
        }

        .ctp-scanlineOverlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 3px 100%;
          pointer-events: none;
          z-index: 10;
        }

        /* --- アニメーション --- */
        @keyframes ctp-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* メインのガラス風パネル筐体 */}
      <div className="ctp-mainPanel">
        
        {/* 装飾: 四隅のボルト/センサーパーツ */}
        <div className="ctp-cornerDecor ctp-tl" />
        <div className="ctp-cornerDecor ctp-tr" />
        <div className="ctp-cornerDecor ctp-bl" />
        <div className="ctp-cornerDecor ctp-br" />

        {/* --- セクション1: デジタル時計 --- */}
        <div className="ctp-clockArea">
          <div className="ctp-systemTag">SYSTEM_CLOCK_READY</div>
          <div className="ctp-digitalDisplay">
            <span className="ctp-timeDigit">{hours}</span>
            <span className="ctp-timeSeparator">:</span>
            <span className="ctp-timeDigit">{minutes}</span>
            <span className="ctp-timeSeparatorSmall">:</span>
            <span className="ctp-secondsDigit">{seconds}</span>
          </div>
          <div className="ctp-dataLog">
            LATENCY: 12ms / STATUS: STABLE
          </div>
        </div>

        {/* 境界線 */}
        <div className="ctp-verticalDivider" />

        {/* --- セクション2: インタラクティブ・ダイヤル --- */}
        <div className="ctp-dialArea">
          <div className="ctp-labelHeader">{label}</div>
          
          <div className="ctp-gaugeContainer">
            {/* ゲージSVG */}
            <svg className="ctp-gaugeSvg" width="100" height="100" viewBox="0 0 100 100">
              <circle
                className="ctp-gaugeTrack"
                cx="50" cy="50" r={radius}
              />
              <circle
                className="ctp-gaugeBar"
                cx="50" cy="50" r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            
            {/* 中央の数値表示 */}
            <div className="ctp-gaugeValue">
              <div className="ctp-valueNumber">{dialValue}</div>
              <div className="ctp-valueUnit">MIN</div>
            </div>

            {/* 操作用オーバーレイボタン */}
            <div className="ctp-buttonOverlay">
              <button 
                className="ctp-adjustBtn" 
                onClick={() => handleUpdate(false)}
                disabled={dialValue <= 5}
              >
                <span>-</span>
              </button>
              <button 
                className="ctp-adjustBtn" 
                onClick={() => handleUpdate(true)}
                disabled={dialValue >= 15}
              >
                <span>+</span>
              </button>
            </div>
          </div>

          <div className="ctp-bottomStatus">
            RANGE_SAFE: 05_15
          </div>
        </div>

      </div>
      
      {/* 背後の走査線エフェクトレイヤー */}
      <div className="ctp-scanlineOverlay" />
    </div>
  );
};

// メインのAppコンポーネントとしてエクスポート
const App = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: '#050a14' 
    }}>
      <CyberTimerPanel />
    </div>
  );
};

export default App;