// ==============================================================
// Components/3-Organisms/Control/UserInfoForm/UserInfoForm.tsx
// ==============================================================

// 他のコンポーネントをインポート
import { ValidatedInputField } from "./../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { GlitchText } from "../../../1-Atoms/UI/GlitchText/GlitchText";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";
// デザインに関するファイルをインポート
import styles from "./UserInfoForm.module.css";
import { ShieldCheck, User, Calendar, ArrowRight } from "lucide-react";
// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

type UserInfoFormProps = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  birthDate: string;
  setBirthDate: React.Dispatch<React.SetStateAction<string>>;
  onSaveAndMoveClick?: ( userId: string, birthDate: string ) => void;
};

export const UserInfoForm = ({
    userId,
    setUserId,
    birthDate,
    setBirthDate,
    onSaveAndMoveClick = () => alert("onSaveAndMoveClick is not assigned"),
}: UserInfoFormProps) => {

    const { palette, font } = useAppearance();

    return(
        <div 
            className={styles.card}
            style={{
                "--black-glass": palette.blackGlass,
                "--cyan": palette.cyan,
                "--cyan-shadow": palette.cyanShadow,
                "--pink": palette.pink,
            } as React.CSSProperties}
        >
            {/* 四つ角飾り */}
            <div className={styles.rightTop}></div>
            <div className={styles.rightBottom}></div>
            <div className={styles.leftTop}></div>
            <div className={styles.leftBottom}></div>

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

            <form 
                className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    onSaveAndMoveClick?.(userId, birthDate);
                }}    
            >

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

                {/* 登録ボタン */}
                <SubmitButton type="submit">
                    Register
                    <ArrowRight />
                </SubmitButton>

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
