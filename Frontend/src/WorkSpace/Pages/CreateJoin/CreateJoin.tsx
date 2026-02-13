import { useEffect, useState } from "react";
import { UserHud } from "../../Components/Misc/UserHud/UserHud";
import { RoomForm } from "../../Components/Misc/RoomForm/RoomForm";
import styles from "./CreateJoin.module.css";
import { photonService } from '../../Functions/PhotonControllers/PhotonService';
import { useNavigate } from "react-router-dom";

export function CreateJoin() {
  const [userData, setUserData] = useState({
    userId: "KYARASU",
    secretId: "****-****",
    score: 12000,
    birthDate: "2099-01-01",
  });

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("registrationData");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const handleAction = async () => {
    if (!roomName || isLoading) return;

    if (!/^[a-zA-Z0-9_-]+$/.test(roomName)) {
      alert("ルーム名は英数字と _ のみ使用可能です");
      return;
    }

    setIsLoading(true);

    try {
      // 接続プロセス開始
      await photonService.connectToRegion("jp");

      if (activeTab === 'create') {
        console.log(`Creating room: ${roomName}`);
        await photonService.createRoom(roomName, { maxPlayers: 8 });
      } else {
        console.log(`Joining room: ${roomName}`);
        await photonService.joinRoom(roomName);
      }
      
      // 🔴 Room入室が State.Joined(8) になるのを内部で待っているので、
      // ここに来たときはすでに名前設定のリクエストも飛んでいます。
      // 🔴 ルーム名を state として渡す
      navigate("/waiting", { state: { roomName: roomName } });
    } catch (err: any) {
      console.error("Error:", err);
      alert(`Failed: ${err.message || "Unknown error"}`);
      setIsLoading(false);
    }
  };


  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <UserHud userData={userData} />

        <RoomForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          roomName={roomName}
          setRoomName={setRoomName}
          handleAction={handleAction}
          isLoading={isLoading}
          userData={userData}
        />
      </div>
    </div>
  );
}
