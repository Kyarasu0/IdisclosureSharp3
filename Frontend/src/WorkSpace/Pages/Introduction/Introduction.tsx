// ==========================================
// ページ1: イントロダクション画面
// ==========================================
import { useNavigate } from "react-router-dom";
// import ICON_PATH from "../../Images/IdisclosureIcon.png";
import ICON_PATH from "../../Images/IdisS3Icon.png";
import styles from "./Introduction.module.css";
import { RoundedButton } from "../../Components/Buttons/RoundedButton/RoundedButton";

type IntroductionProps = {
  onStart?: () => void;
  isExiting?: boolean;
};

// Introduction (STARTボタン押下時に /register へ遷移するページ)
export const Introduction = ({ onStart, isExiting }: IntroductionProps) => {
  // navigate関数を使う
  const navigate = useNavigate();
  const containerClassName = [styles.container, isExiting ? styles.exiting : ''].filter(Boolean).join(' ');

  // STARTボタン押下時の処理
  const handleStart = () => {
    onStart?.();
    navigate("/register");
  };

  return (
    <div className={containerClassName}>
      
      {/* 1. アイコン画像・ロゴ・サブタイトル */}
      <div className={styles.logoArea}>

        {/* 1.1. アイコン画像 */}
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow}></div>
          <img
            src={ICON_PATH}
            alt="Lock Icon"
            className={styles.iconImage}
            onError={(e) => {
              // 画像読み込み失敗時のフォールバック処理
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* 1.2. タイトルテキスト */}
        <h1 className={styles.title}>
          <span className={styles.titleId}>Id</span>
          <span className={styles.titleIsclosure}>isclosure</span>
          <span className={styles.titleHash}>#3</span>
        </h1>

        {/* 1.3. サブタイトル */}
        <p className={styles.subTitle}>
          SYSTEM BREACH PROTOCOL
        </p>
      </div>

      {/* 2. STARTボタン */}
      <RoundedButton onClick={handleStart} size="lg">
        PRESS TO START
      </RoundedButton>

      {/* 3. 下部バウンス矢印 */}
      <div className={styles.bounceArrow}>▼</div>

    </div>
  );
};
