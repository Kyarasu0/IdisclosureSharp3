// ==============================================================
// Components/3-Organisms/Control/UserInfoForm/UserInfoForm.tsx
// ==============================================================

// 基本的な関数のインポート
import { useState } from "react";
// 他のコンポーネントをインポート
import { ValidatedInputField } from "./../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { GlitchText } from "../../../1-Atoms/UI/GlitchText/GlitchText";
// デザインに関するファイルをインポート
import styles from "./UserInfoForm.module.css";
import { ShieldCheck, User, Calendar } from "lucide-react";
// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

export const UserInfoForm = () => {
    const [userId, setUserId] = useState("");
    const [birthDate, setBirthDate] = useState("2000-01-01");

    const { palette, font } = useAppearance();

    return(
        <div 
            className={styles.card}
            style={{
                "--black-glass": palette.blackGlass,
                "--cyan": palette.cyan,
                "--pink": palette.pink,
            } as React.CSSProperties}
        >
            {/* スキャンライン */}
            <div 
                className={styles.scanLine} 
                style={{ 
                    top: 0,
                    "--deg": "90deg",
                } as React.CSSProperties}
            />

            {/* タイトル */}
            <div className={styles.header}>
                <ShieldCheck size={80} strokeWidth={1} />
                <div className={styles.title}>
                    <GlitchText content={"REGISTRATION"} className={styles.mainTitle}/>
                    <p 
                        className={styles.subTitle}
                        style={{ fontFamily: font.secondary }}
                    >
                        Please enter your information.
                    </p>
                </div>
            </div>

            <form className={styles.form}> {/* onSubmit={handleSubmit} */}

                {/* User Name */}
                <div className={styles.userIdWrapper}>
                    <ValidatedInputField
                        label="USER ID"
                        icon={<User />}
                        type="text"
                        value={userId}
                        onChange={setUserId}
                        placeholder="Enter your user id"
                        required={true}
                        pattern={/^[a-zA-Z0-9_]{1,15}$/}   // 3〜15文字の英数字＋_
                        htmlPattern="^[a-zA-Z0-9_]{1,15}$"
                        showStatusDot={true}
                    />
                </div>

                {/* BirthYear/BirthDate */}
                <div className={styles.birthDateWrapper}>
                    <ValidatedInputField
                        label="DATE OF BIRTH"
                        icon={<Calendar />}
                        type="date"
                        value={birthDate}
                        onChange={setBirthDate}
                        placeholder="Enter your date of birth"
                        required={true}
                    />
                </div>
            </form>

            {/* スキャンライン */}
            <div 
                className={styles.scanLine} 
                style={{ 
                    bottom: 0,
                    "--deg": "-90deg",
                } as React.CSSProperties}
            />
        </div>
    );
}
