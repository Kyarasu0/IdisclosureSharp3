import { useEffect, useState } from "react";
import { UserHud } from "../../Components/Misc/UserHud/UserHud";
import { RoomForm } from "../../Components/Misc/RoomForm/RoomForm";
import styles from "./CreateJoin.module.css";

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

  useEffect(() => {
    const stored = localStorage.getItem("registrationData");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const handleAction = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setIsLoading(false);
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
