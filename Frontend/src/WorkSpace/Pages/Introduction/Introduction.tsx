import { Zap } from 'lucide-react';
import ICON_PATH from '../../Images/IdisclosureIcon.png';
import styles from './Introduction.module.css';
import { RoundedButton } from '../../Components/RoundedButton';

// Introduction(STARTボタンを押したときに呼び出される関数, 画面がフェードアウト中かどうかを判定するフラグ)
export const Introduction = ({ onStart, isExiting,}: { onStart: () => void; isExiting: boolean; }) => {
  return (
    // container + isExitingによってはcontainerExitingも追加
    <div className={`${styles.container} ${isExiting ? styles.containerExiting : ''}`}>
      {/* アイコン画像とロゴとサブタイトル */}
      <div className={styles.logoArea}>

        {/* アイコン画像 */}
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow}></div>
          <img
            src={ICON_PATH}
            alt="Lock Icon"
            className={styles.iconImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* <div className={styles.iconFallback}>NO IMAGE</div> */}
        </div>

        {/* タイトルテキスト */}
        <h1 className={styles.title}>
          <span className={styles.titleId}>Id</span>
          <span className={styles.titleIsclosure}>isclosure</span>
          <span className={styles.titleHash}>#3</span>
        </h1>

        {/* サブタイトル */}
        <p className={styles.subTitle}>SYSTEM BREACH PROTOCOL</p>

      </div>

      {/* STRATボタン */}
      <RoundedButton onClick={onStart} >
        PRESS TO START
      </RoundedButton>

        <div className={styles.bounceArrow}>▼</div>
      </div>
  );
};
