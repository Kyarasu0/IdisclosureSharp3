import { useState } from "react";
import styles from "./Download.module.css";
// SOFから型を入手
import type { ResultType } from "./../../Pages/SuccessOrFailed/SuccessOrFailed";

import { ProgressBar } from "../../Components/Infomation/ProgressBar/ProgressBar";
import { GlitchText } from "../../Components/Texts/GlitchText/GlitchText";

type ToolInfo = {
  id: number;
  name: string;
  description: string;
  price: number;
  sampleCommand: string;
};

type Props = {
  toolInfo: ToolInfo;
  onNavigate: (path: string, state?: any) => void;
  result: ResultType;
};

export function Download({ toolInfo, onNavigate, result }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDownload = () => {
    setDownloading(true);

    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 20;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);

        setTimeout(() => {
          // ✅ ちゃんと呼ぶ
          onNavigate("/successOrFailed", {
            result: result,
          });
        }, 500);
      }

      setProgress(value);
    }, 200);
  };

  return (
    <div className={styles.container}>

      {/* タイトル */}
      <div className={styles.header}>
        <GlitchText text={toolInfo.name} />
      </div>

      {/* 説明 */}
      <div className={styles.description}>
        {toolInfo.description}
      </div>

      {/* コマンド */}
      <div className={styles.terminal}>
        <div className={styles.command}>
          $ {toolInfo.sampleCommand}
        </div>
      </div>

      {/* 価格 */}
      <div className={styles.price}>
        {toolInfo.price}
      </div>

      {/* ダウンロード */}
      {!downloading ? (
        <button className={styles.button} onClick={startDownload}>
          DOWNLOAD & EXECUTE
        </button>
      ) : (
        <div className={styles.progressArea}>
          <div className={styles.progressLabel}>
            DOWNLOADING...
          </div>
          <ProgressBar value={progress} />
        </div>
      )}
    </div>
  );
}