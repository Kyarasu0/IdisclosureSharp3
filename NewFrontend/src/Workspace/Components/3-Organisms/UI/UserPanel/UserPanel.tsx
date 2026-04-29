// ===================================================
// Components/3-Organisms/UI/UserPanel/UserPanel.tsx
// ===================================================

// 他のコンポーネントをインポート
import { CyberFormCard } from "../../../2-Molecules/CyberFormCard/CyberFormCard";
import { PageTitle } from "../../../1-Atoms/UI/PageTitle/PageTitle";
// デザインに関するファイルをインポート
import styles from "./UserPanel.module.css";
import { UserRound } from "lucide-react";
// 表示設定ファイルのインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

type Props = {
  userData: any;
  className?: string;
};

export function UserPanel({ userData, className }: Props) {
  const appearance = useAppearance();
  return (
    <CyberFormCard className={`${styles.cyberFormCard} ${className}`}>
      {/* タイトル */}
      <PageTitle Icon={UserRound} mainTitle={"USER DATA"} subTitle={"Display your information."}/>

      <div className={styles.row}>
        <span>USER ID</span>
        <strong>{userData.userId}</strong>
      </div>

      <div className={styles.row}>
        <span>BIRTH DATE</span>
        <strong>{userData.birthDate}</strong>
      </div>

        <div className={styles.row}>
        <span>SECRET ID</span>
        <strong className={styles.secretId}>{userData.secretId}</strong>
      </div>

      <div className={styles.row}>
        <span>{appearance.scoreName.toUpperCase()}</span>
        <strong className={styles.score}>{userData.score}</strong>
      </div>
    </CyberFormCard>
  );
}