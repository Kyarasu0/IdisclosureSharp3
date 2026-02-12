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
    if (!roomName) return;
    setIsLoading(true);

    try {
      // サーバー接続
      await photonService.connect();

      if (activeTab === 'create') {
        await photonService.createRoom(roomName);
        alert(`Room "${roomName}" created!`);
        navigate("/waiting");
      } else {
        await photonService.joinRoom(roomName);
        alert(`Joined room "${roomName}"!`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect or join/create room');
    } finally {
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
