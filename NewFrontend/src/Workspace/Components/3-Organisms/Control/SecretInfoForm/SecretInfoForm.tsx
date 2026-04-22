// ==================================================================
// Components/3-Organisms/Control/SecretInfoForm/SecretInfoForm.tsx
// ==================================================================

import { useMemo } from "react";
import styles from "./SecretInfoForm.module.css";

import { Lock, Zap, FileLock } from "lucide-react";

import { ValidatedInputField } from "../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";
import { CyberFormCard } from "../../../2-Molecules/CyberFormCard/CyberFormCard";
import { PageTitle } from "../../../1-Atoms/UI/PageTitle/PageTitle";

// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

// 外部関数
import { calculateScore } from "../../../../Functions/Utils/calculateScore";

// ==============================================
// 型
// ==============================================
type Props = {
    secretId: string;
    setSecretId: React.Dispatch<React.SetStateAction<string>>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    onSaveAndMoveClick?: ( secretId: string, score: number ) => void;
};

// ==============================================
// SecretInfoForm
// ==============================================
export function SecretInfoForm({ 
    secretId,
    setSecretId,
    onSaveAndMoveClick = () => alert("onSaveAndMoveClick is not assigned")
}: Props) {
    const { palette, font } = useAppearance();

  // --------------------------------------------
  // 保存済みデータ取得
  // --------------------------------------------
  const registrationData = useMemo(() => {
    const raw = localStorage.getItem("registrationData");

    if (!raw) {
      return {
        userId: "",
        birthDate: "",
      };
    }

    return JSON.parse(raw);
  }, []);

  // --------------------------------------------
  // 点数計算関数を呼ぶ
  // --------------------------------------------
  const result = useMemo(() => {
    return calculateScore(secretId, registrationData);
  }, [secretId, registrationData]);

  // ==============================================
  // JSX
  // ==============================================
  return (
    <CyberFormCard 
        className={styles.cyberFormCard}
    >
        {/* 左側 */}
        <div 
            className={styles.left}
            style={{
                "--cyan": palette.cyan,
                "--white-glass": palette.whiteGlass,
                "--pink": palette.pink,
            } as React.CSSProperties }
        >
            {/* タイトル */}
            <PageTitle Icon={FileLock} mainTitle={"SECRET SETUP"} subTitle={"Please enter your secret id."}/>

            <div className={styles.scoreDetail}>
                <ul className={styles.ruleList}>
                    <li className={result.hasUserId ? styles.ok : styles.ng}>
                    UserID included
                    </li>
                    <li className={result.hasYear ? styles.ok : styles.ng}>
                    Birthyear included
                    </li>
                    <li className={result.hasBirthday ? styles.ok : styles.ng}>
                    Birthday included
                    </li>
                    <li className={result.hasNoise ? styles.ok : styles.ng}>
                    Noise characters
                    </li>
                </ul>

                <div className={styles.info}>
                    <p>UserID : {registrationData.userId}</p>
                    <p>Birth : {registrationData.birthDate}</p>
                </div>
            </div>
        </div>

        {/* 右側 */}
        <div className={styles.right}>
            <div className={styles.scoreBox}>
                <span className={styles.scoreLabel}>SECRET SCORE</span>
                <strong className={styles.score}>{result.score}</strong>
            </div>

            <ValidatedInputField
                label="SECRET ID"
                value={secretId}
                onChange={setSecretId}
                required={true}
                placeholder="ENTER SECRET ID"
                icon={<Lock size={18} />}
            />

            <div className={styles.progress}>
                <div
                className={styles.progressBar}
                style={{ width: `${result.progress}%` }}
                />
            </div>

            <SubmitButton
                type="button"
                isLoading={false}
                onClick={() =>
                    onSaveAndMoveClick?.(secretId, result.score)
                }
            >
                {result.isValid ? <Zap size={18} /> : <Lock size={18} />}
                &nbsp;Confirm Secret ID
            </SubmitButton>
        </div>
    </CyberFormCard>
  );
}