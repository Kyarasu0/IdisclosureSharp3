// ==========================================
// メインコンポーネント: SecretEntryApp
// ==========================================

import { useState, useMemo } from "react";
import { Lock, Zap } from "lucide-react";
import styles from "./SecretEntry.module.css";

import { RulesPanel } from "../../Components/Misc/RulesPanel/RulesPanel";
import { ScoreDisplay } from "../../Components/Misc/ScoreDisplay/ScoreDisplay";

import { NormalInputField } from '../../Components/InputFields/NormalInputField/NormalInputField';
import { SubmitButton } from '../../Components/Buttons/SubmitButton/SubmitButton';

export function SecretEntry() {
  const [secretId, setSecretId] = useState("");
  const [score, setScore] = useState(0);
  const [glitchTrigger, setGlitchTrigger] = useState(false);

  // SecretID とスコアを localStorage に保存する関数
  const saveSecretData = (secretId: string, score: number) => {
    const raw = localStorage.getItem("registrationData");
    const baseData = raw ? JSON.parse(raw) : { userId: "", birthDate: "" };

    const dataToSave = { ...baseData, secretId, score };

    // 保存
    localStorage.setItem("registrationData", JSON.stringify(dataToSave));
};


  // ==========================================
  // localStorage からユーザーデータを取得
  // ==========================================
  const USER_DATA = useMemo(() => {
    const raw = localStorage.getItem("registrationData");
    if (!raw) return { userId: "", birthDate: "" };
    return JSON.parse(raw);
  }, []);

  // ==========================================
  // ルール定義（C# ロジックを JS に移植）
  // ==========================================
  const rules = useMemo(() => [
    {
      id: "userid",
      label: "UserID included",
      check: (input: string) => {
        const regex = new RegExp(USER_DATA.userId, "g");
        const count = (input.match(regex) || []).length;
        return { valid: count > 0, count, cost: count * 10 };
      },
    },
    {
        id: "birthyear",
        label: "Birthyear(YYYY) included",
        check: (input: string) => {
            if (!USER_DATA.birthDate) return { valid: false, count: 0, cost: 0 };

            // "2005-01-01" から年だけ取り出す
            const year = USER_DATA.birthDate.split("-")[0] || "";
            const regex = new RegExp(year, "g");
            const count = (input.match(regex) || []).length;
            return { valid: count > 0, count, cost: count * 15 };
        },
    },
    {
        id: "birthday",
        label: "Birthday(MMDD) included",
        check: (input: string) => {
            if (!USER_DATA.birthDate) return { valid: false, count: 0, cost: 0 };

            // "2005-01-01" から月日だけ取り出す → "0101"
            const parts = USER_DATA.birthDate.split("-");
            const mmdd = (parts[1] || "") + (parts[2] || "");
            const regex = new RegExp(mmdd, "g");
            const count = (input.match(regex) || []).length;
            return { valid: count > 0, count, cost: count * 15 };
        },
    },
    {
        id: "noize",
        label: "Noise characters",
        check: (input: string) => {
            const birthYear = USER_DATA.birthDate?.split("-")[0] || "";
            const birthday = USER_DATA.birthDate ? USER_DATA.birthDate.split("-")[1] + USER_DATA.birthDate.split("-")[2] : "";

            const filtered = input.replace(
            new RegExp(`${USER_DATA.userId}|${birthYear}|${birthday}`, "g"),
            ""
            );

            const count = filtered.length;
            return { valid: count > 0, count, cost: count > 0 ? Math.pow(5, count) : 0 };
        },
    }

  ], [USER_DATA]);

  // ==========================================
  // 入力ハンドラ
  // ==========================================
  const handleSecretIdChange = (value: string) => {
    setSecretId(value);

    // 総コスト計算
    const totalCost = rules.reduce((sum, r) => sum + r.check(value).cost, 0);

    // スコア計算（C# ロジックに近い）
    const rawScore = totalCost > 0 ? Math.floor(100000 / totalCost) : 0;
    setScore(rawScore);

    // グリッチ
    setGlitchTrigger(true);
    setTimeout(() => setGlitchTrigger(false), 100);
  };


  const validations = rules.map(r => r.check(secretId));
  const allValid = validations.every(v => v.valid);

  return (
    <div className={styles.wrapper}>
      <div className={styles.scanline} />

      <div className={styles.mainContainer}>
        <div className={styles.panel}>
          {/* 左カラム */}
          <div className={styles.leftColumn}>
            <RulesPanel validations={validations.map((v, i) => ({
              id: rules[i].id,
              label: rules[i].label,
              valid: v.valid,
              cost: v.cost
            }))} />
          </div>

          {/* 右カラム */}
          <div className={styles.rightColumn}>
            {/* スコア */}
            <div className={styles.scoreArea}>
              <ScoreDisplay score={score} text="BLUE SHARD" />
            </div>

            {/* フォーム */}
            <div className={styles.formArea}>

              <div className={`${styles.inputWrapper} ${glitchTrigger ? styles.glitch : ""}`}>
                <NormalInputField
                    label="SECRET ID"
                    icon={<Lock size={12} />}
                    value={secretId}
                    required = {true}
                    onChange={handleSecretIdChange}
                    placeholder="ENTER SECRET ID"
                    showStatusDot={true}
                    // JS/TS 側の正規表現
                    pattern={/^[A-Za-z0-9!#$%&'\-=^~|@`;+:*,<.>\/?_\\[\](){}"]+$/}
                    // HTML pattern 属性用（エスケープ済み）
                    htmlPattern="[A-Za-z0-9!#$%&'\-=^~|@`;+:*,<.>/?_\\[\](){}\u0022]+"
                />
                <div style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: allValid ? "#00f0ff" : "#555555"
                }}>
                </div>
              </div>

              {/* Progress */}
              <div className={styles.progressWrapper}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${Math.min(score * 100 / 20000, 100)}%` }}
                />
              </div>

              {/* Submit */}
              <SubmitButton
              type="button"
              isLoading={false} // 今はローディングは使わない場合
              onClick={() => {
                saveSecretData(secretId, score); // 保存
              }}
              >
              {allValid ? <Zap size={18} /> : <Lock size={18} />}
              &nbsp;Confirm Secret ID
              </SubmitButton>
            </div>

            {/* Footer */}
            <div className={styles.footerInfo}>
              UserID: {USER_DATA.userId} <br />
              Birth Date: {USER_DATA.birthDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
