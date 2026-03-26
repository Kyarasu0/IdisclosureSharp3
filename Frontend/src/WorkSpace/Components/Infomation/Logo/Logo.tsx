import React from "react";
import ICON_PATH from "../../../Images/IdisclosureIcon.png";
import styles from "./Logo.module.css";

interface LogoProps {
  titleId?: string;
  titleMain?: string;
  version?: string;
  subTitle?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  titleId = "Id",
  titleMain = "isclosure",
  version = "#3",
  subTitle = "SYSTEM BREACH PROTOCOL",
  size = "md",
}) => {
  return (
    <div className={`${styles.logo} ${styles[size]}`}>
      {/* アイコン */}
      <div className={styles.iconWrapper}>
        <div className={styles.iconGlow}></div>
        <img
          src={ICON_PATH}
          alt="Lock Icon"
          className={styles.iconImage}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* タイトル */}
      <div>
        <div className={styles.gameTitle}>
          <span className={styles.titleId}>{titleId}</span>
          <span className={styles.titleIsclosure}>{titleMain}</span>
          <span className={styles.titleHash}>{version}</span>
        </div>

        <div className={styles.gameSub}>{subTitle}</div>
      </div>
    </div>
  );
};