// ==========================================
// ページ1: イントロダクション画面
// ==========================================
import { useNavigate } from "react-router-dom";
import ICON_PATH from "../../Images/IdisclosureIcon.png";
import styles from "./Introduction.module.css";
import { RoundedButton } from "../../Components/Buttons/RoundedButton/RoundedButton";

// Introduction (STARTボタン押下時に /register へ遷移するページ)
export const Introduction = () => {
  const navigate = useNavigate();

  // STARTボタン押下時の処理
  const handleStart = () => {
    navigate("/register");
  };

  return (
    // container
    <div className={styles.container}>
      
      {/* アイコン画像・ロゴ・サブタイトル */}
      <div className={styles.logoArea}>

        {/* アイコン画像 */}
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

        {/* タイトルテキスト */}
        <h1 className={styles.title}>
          <span className={styles.titleId}>Id</span>
          <span className={styles.titleIsclosure}>isclosure</span>
          <span className={styles.titleHash}>#3</span>
        </h1>

        {/* サブタイトル */}
        <p className={styles.subTitle}>
          SYSTEM BREACH PROTOCOL
        </p>
      </div>

      {/* STARTボタン */}
      <RoundedButton onClick={handleStart}>
        PRESS TO START
      </RoundedButton>

      {/* 下部バウンス矢印 */}
      <div className={styles.bounceArrow}>▼</div>

    </div>
  );
};
