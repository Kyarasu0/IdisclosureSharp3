// ==================================================================
// Components/3-Organisms/Control/SecretInfoForm/SecretInfoForm.tsx
// ==================================================================

import { useMemo } from "react";
import styles from "./SecretInfoForm.module.css";

import { Lock, ArrowRight, FileLock, TriangleAlert } from "lucide-react";

import { ValidatedInputField } from "../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";
import { CyberFormCard } from "../../../2-Molecules/CyberFormCard/CyberFormCard";
import { PageTitle } from "../../../1-Atoms/UI/PageTitle/PageTitle";
import { CyberMessageBox } from "../../../2-Molecules/CyberMessageBox/CyberMessageBox";
import { CyberList } from "../../../2-Molecules/CyberList/CyberList";

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

  // --------------------------------------------
    // Score詳細表示用データ
    // --------------------------------------------
    // 判定リストを作る
    const ruleItems = [
        {
            id: "userId",
            label: "UserID included",
            valid: result.hasUserId,
        },
        {
            id: "year",
            label: "Birthyear included",
            valid: result.hasYear,
        },
        {
            id: "birthday",
            label: "Birthday included",
            valid: result.hasBirthday,
        },
        {
            id: "noise",
            label: "Noise characters",
            valid: result.hasNoise,
        },
    ];

  // ==============================================
  // JSX
  // ==============================================
  return (
    <CyberFormCard className={styles.cyberFormCard}>
        {/* 左側 */}
        <div className={styles.left}>
            {/* タイトル */}
            <PageTitle Icon={FileLock} mainTitle={"SECRET SETUP"} subTitle={"Please enter your secret id."}/>

            <div className={styles.scoreDetail}>
                <CyberList items={ruleItems} />

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

            <form className={styles.form}>
                <div className={styles.secretIdWrapper}>
                    <ValidatedInputField
                        label="SECRET ID"
                        value={secretId}
                        onChange={setSecretId}
                        required={true}
                        placeholder="ENTER SECRET ID"
                        icon={<Lock size={18} />}
                        showStatusDot={true}
                        // JS/TS 側の正規表現
                        pattern={/^[A-Za-z0-9!#$%&'\-=^~|@`;+:*,<.>\/?_\\[\](){}"]{1,15}$/}
                        // HTML pattern 属性用（エスケープ済み）
                        htmlPattern="[A-Za-z0-9!#$%&'\-=^~|@`;+:*,<.>/?_\\[\](){}\u0022]{1,15}$"
                    />
                </div>

                <CyberMessageBox
                    title="WARNING"
                    message="Secret ID can use a-z, A-Z, 1-9, and symbols. It must be 1 to 15 characters long."
                    icon={<TriangleAlert size={16} />}
                    variant="warning"
                    className={styles.warning}
                />

                <div className={styles.progress}>
                    <div
                    className={styles.progressBar}
                    style={{ width: `${result.progress}%` }}
                    />
                </div>

                {/* 登録ボタン */}
                <SubmitButton 
                    type="submit"
                    className={styles.submitButton}
                >
                    Comfirm
                    <ArrowRight />
                </SubmitButton>
            </form>
        </div>
    </CyberFormCard>
  );
}