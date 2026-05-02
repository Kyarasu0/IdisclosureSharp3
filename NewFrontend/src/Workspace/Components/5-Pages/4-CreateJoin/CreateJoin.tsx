// ================================================
// Components/5-Pages/4-CreateJoin/CreateJoin.tsx
// ================================================

// Memo
// 関数指定は必須にしましょう
// 関数は極力ページ内で実行できるものはしましょう
// getLocalStorageはUserDataに指定しましょう

// 基本的な関数をインポート
import { useState, useEffect } from "react";
// 他のコンポーネントをインポート
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { RoundedButton } from "./../../1-Atoms/Control/RoundedButton/RoundedButton";
import { UserPanel } from "../../3-Organisms/UI/UserPanel/UserPanel";
import { RoomForm } from "../../3-Organisms/Control/RoomForm/RoomForm";
// デザインに関するファイルをインポート
import styles from "./CreateJoin.module.css";
import { ArrowBigLeft } from "lucide-react";

type UserData = {
  userId: string;
  birthDate: string;
  secretId: string;
  score: number;
};

type Props = {
  isNavigationBlocked?: boolean;
  // 前ページに遷移
  onReturnClick: () => void;
  // ページガード
  onGuard: () => void;
  // 次ページに遷移
  onCreateRoom: (room: string, user: string, photonApiKey: string, onSaveAndMoveClick: () => void) => void;
  onJoinRoom: (room: string, user: string, photonApiKey: string, onSaveAndMoveClick: () => void) => void;
  onSaveAndMoveClick: () => void,

  // ローカルストレージから情報を取得
  getLocalStorage: <T>(key: string) => T;
};

type PhotonSettings = {
  photonApiKey: string;
  roomName: string;
};

export const CreateJoin = ({
    isNavigationBlocked = false,
    // 前ページに遷移
    onReturnClick,
    // ページガード
    onGuard,
    // 次ページに遷移
    onCreateRoom,
    onJoinRoom,
    onSaveAndMoveClick,

    // ローカルストレージから情報を取得
    getLocalStorage,
}: Props) => {
    const [userData, setUserData] = useState({
        userId: "",
        birthDate: "",
        secretId: "",
        score: 0
    });
    const [mode, setMode] = useState<"create" | "join">("create");
    const [activeMode, setActiveMode] = useState<"create" | "join">("create");
    const [roomName, setRoomName] = useState("");
    const [photonApiKey, setPhotonApiKey] = useState(() => {
        const saved = getLocalStorage<PhotonSettings>("photonSettings");
        return saved?.photonApiKey ?? "";
    });

    const handleStart = () => {
        if (!roomName) return;

        if (mode === "create") {
            onCreateRoom(roomName, userData.userId, photonApiKey, onSaveAndMoveClick);
        } else {
            onJoinRoom(roomName, userData.userId, photonApiKey, onSaveAndMoveClick);
        }
    };

    // useEffect(() => {
    //     return () => {
    //         onDisconnectPhoton();
    //     };
    // }, []);

    // 遷移元を確認し遷移を許可するかを管理
    useEffect(() => {
        setUserData(getLocalStorage<UserData>("registrationData"));
        if (!isNavigationBlocked) return;
        // onGuardが存在するなら実行
        onGuard?.();
    }, [isNavigationBlocked]);

    return(
        <div className={styles.createJoinContainer}>
            <header className={styles.createJoinHeader}>
                {/* ロゴマーク */}
                <Logo size="md" type="horizontal"/>
            </header>
            <main className={styles.createJoinMain}>
                <UserPanel userData={userData} className={styles.userPanel}/>
                <RoomForm
                  mode={mode}
                  setMode={setMode}
                  activeMode={activeMode}
                  setActiveMode={setActiveMode}
                  photonApiKey={photonApiKey}
                  setPhotonApiKey={setPhotonApiKey}
                  roomName={roomName}
                  setRoomName={setRoomName}
                  onStart={handleStart}
                  getLocalStorage={getLocalStorage}
                  className={styles.roomForm}
                />
            </main>
            <footer className={styles.createJoinFooter}>
                {/* 戻るボタン */}
                <RoundedButton 
                    size="lg"
                    icon={ArrowBigLeft}
                    onClick={onReturnClick}
                />
            </footer>
        </div>
    );
}