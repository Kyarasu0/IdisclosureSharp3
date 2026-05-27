// ============================================================================
// DownloadSite.tsx
// 単一ツール ダウンロードページ
// ============================================================================

import styles from "./DownloadSite.module.css";

// Button
import { RoundedButton } from "../../../1-Atoms/Control/RoundedButton/RoundedButton";

type Props = {
    toolName: string;
    toolDescription: string;
    mainColor: string;
    subColor: string;
};

export const DownloadSite = ({
    toolName,
    toolDescription,
    mainColor,
    subColor,
}: Props) => {

  // ダウンロード
  const handleDownload = () => {
    alert("Downloading...");
  };

    return (
        <div
        className={styles.container}
        style={
            {
            "--main-color": mainColor,
            "--sub-color": subColor,
            } as React.CSSProperties
        }
        >

            {/* タイトル */}
            <div className={styles.title}>
                {toolName}
            </div>

            {/* 説明 */}
            <div className={styles.description}>
                {toolDescription}
            </div>

            {/* ボタン */}
            <RoundedButton
                label="DOWNLOAD"
                size="lg"
                onClick={handleDownload}
                mainColor={mainColor}
            />

        </div>
    );
};