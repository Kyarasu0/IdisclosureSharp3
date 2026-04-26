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
import { ProgressBar } from "../../../1-Atoms/UI/ProgressBar/ProgressBar";

import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

// ==============================================
// 型
// ==============================================
type Props = {
    secretId: string;
    setSecretId: React.Dispatch<React.SetStateAction<string>>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    onConfirmClick?: ( registrationData: Record<string, string> ) => void;
    calculateScoreFn?: (
        secretId: string,
        registrationData: any
    ) => {
        userIdTotalCost: number;
        birthYearTotalCost: number;
        birthDayTotalCost: number;
        noiseTotalCost: number;
        score: number;
        progress: number;
    };
    getLocalStorage?: (key: string) => Record<string, string>
};

// ==============================================
// SecretInfoForm
// ==============================================
export function SecretInfoForm({
    secretId,
    score,
    setSecretId,
    setScore,
    onConfirmClick = () => alert("onConfirmClick is not assigned"),
    calculateScoreFn = (secretId = "not_found", registrationData) => {
        alert(`${secretId}${registrationData}: calculateScoreFn is not assigned`)
        return {
            userIdTotalCost: 0,
            birthYearTotalCost: 0,
            birthDayTotalCost: 0,
            noiseTotalCost: 0,
            score: 0,
            progress: 0,
        }
    },
    getLocalStorage = (key = "not_found") => { return {[key]: "getLocalStorage is not assigned"}},

}: Props) {
    const appearance = useAppearance();

  // --------------------------------------------
  // 保存済みデータ取得
  // --------------------------------------------
  const registrationData = useMemo(() => getLocalStorage("registrationData"), []);

  // --------------------------------------------
  // 点数計算関数を呼ぶ
  // --------------------------------------------
  const result = useMemo(() => {
    const base = calculateScoreFn(secretId, registrationData);
    setScore(base.score);
    return base;
}, [secretId, registrationData, calculateScoreFn]);

  // --------------------------------------------
    // Score詳細表示用データ
    // --------------------------------------------
    // 判定リストを作る
    const ruleItems = [
        {
            id: "userId",
            label: "UserID included",
            valid: result.userIdTotalCost > 0,
            value: result.userIdTotalCost,
        },
        {
            id: "year",
            label: "Birthyear included",
            valid: result.birthYearTotalCost > 0,
            value: result.birthYearTotalCost,
        },
        {
            id: "birthday",
            label: "Birthday included",
            valid: result.birthDayTotalCost > 0,
            value: result.birthDayTotalCost,
        },
        {
            id: "noise",
            label: "Noise characters included",
            valid: result.noiseTotalCost > 0,
            value: result.noiseTotalCost,
        },
    ];

  // ==============================================
  // JSX
  // ==============================================
  return (
    <CyberFormCard className={styles.cyberFormCard}>
        {/* Header */}
        <div className={styles.secretSetupHeader}>
            {/* タイトル */}
            <div className={styles.pageTitleWrapper}>
                <PageTitle Icon={FileLock} mainTitle={"SECRET SETUP"} subTitle={"Please enter your secret id."}/>
            </div>
            {/* スコア */}
            <div className={styles.scoreBox}>
                <span className={styles.scoreLabel}>{appearance.scoreName}</span>
                <strong className={styles.score}>{result.score}</strong>
            </div>
        </div>

        {/* Main */}
        <div className={styles.secretSetupMain}>
            {/* 左側 */}
            <div className={styles.scoreDetail}>
                <CyberList items={ruleItems} />
            </div>
            {/* 右側 */}
            <form 
                className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!/^[A-Za-z0-9!#$%&'\-=^~|@`;+:*,<.>\/?_\\[\](){}"]{1,15}$/.test(secretId)) return;
                    onConfirmClick?.({ 
                        userId: registrationData.userId,
                        birthDate: registrationData.birthDate,
                        secretId,
                        score: String(score)
                    });
                }}    
            >
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
                        htmlPattern="^[A-Za-z0-9!#$%&'\-=^~|@`;+:*,<.>/?_\\[\](){}\u0022]{1,15}$"
                    />
                </div>

                <CyberMessageBox
                    title="WARNING"
                    message="Secret ID can use a-z, A-Z, 1-9, and symbols. It must be 1 to 15 characters long."
                    icon={<TriangleAlert size={16} />}
                    variant="warning"
                    className={styles.warning}
                />

                <ProgressBar
                    progress={result.progress}
                    color="linear-gradient(90deg, var(--cyan), var(--pink))"
                />

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

        {/* footer */}
        <div className={styles.secretSetupFooter}>
            <div className={styles.pulse}>
                <p>Total Cost : {
                    result.userIdTotalCost
                    + result.birthYearTotalCost
                    + result.birthDayTotalCost 
                    + result.noiseTotalCost
                }</p>
                <p>Blue Shard : 100000 / Total Cost</p>
            </div>
            <div className={styles.info}>
                <p>UserID : {registrationData.userId}</p>
                <p>BirthDate : {registrationData.birthDate}</p>
            </div>
        </div>
    </CyberFormCard>
  );
}