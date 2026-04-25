// ==============================================================
// Components/3-Organisms/Control/UserInfoForm/UserInfoForm.tsx
// ==============================================================

// 他のコンポーネントをインポート
import { ValidatedInputField } from "./../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";
import { CyberFormCard } from "../../../2-Molecules/CyberFormCard/CyberFormCard";
import { PageTitle } from "../../../1-Atoms/UI/PageTitle/PageTitle";
// デザインに関するファイルをインポート
import styles from "./UserInfoForm.module.css";
import { File, User, Calendar, ArrowRight } from "lucide-react";

type UserInfoFormProps = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  birthDate: string;
  setBirthDate: React.Dispatch<React.SetStateAction<string>>;
  onSaveAndMoveClick?: ( userId: string, birthDate: string ) => void;
  className?: string;
};

export const UserInfoForm = ({
    userId,
    setUserId,
    birthDate,
    setBirthDate,
    onSaveAndMoveClick = () => alert("onSaveAndMoveClick is not assigned"),
    className,
}: UserInfoFormProps) => {
    return(
        <CyberFormCard className={`${styles.cyberFormCard} ${className}`}>

            {/* タイトル */}
            <PageTitle Icon={File} mainTitle={"USER SETUP"} subTitle={"Please enter your information."}/>

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
            
        </CyberFormCard>
    );
}
