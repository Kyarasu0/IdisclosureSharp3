// 型読み込み
/// <reference path="../../../types/photon-realtime.d.ts" />

import { useEffect, useState } from "react";
import { UserHud } from "../../Components/Misc/UserHud/UserHud";
import { RoomForm } from "../../Components/Misc/RoomForm/RoomForm";
import styles from "./CreateJoin.module.css";
import { useNavigate } from "react-router-dom";
import { usePhoton } from "../../Contexts/PhotonContext";

// Photon を直接参照
const Photon = window.Photon;

export function CreateJoin() {
  // Photon引き継ぎ用
  const { setClient } = usePhoton();
  // ===========================
  // LocalStrageから取得する情報
  // ===========================
  const [userData, setUserData] = useState({
    userId: "KYARASU",
    secretId: "****-****",
    score: 12000,
    birthDate: "2099-01-01",
  });

  // カードの裏表情報
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  // 入力されたルーム名
  const [roomName, setRoomName] = useState("");

  // GameServerへ接続中かどうか
  const [isLoading, setIsLoading] = useState(false);

  // navigate関数の準備
  const navigate = useNavigate();

  // ===========================
  // LocalStrageからの情報取得
  // ===========================
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
      // ===========================
      // 1. LoadBalancingClient を作成
      // ===========================
      const appId = import.meta.env.VITE_PHOTON_APP_ID as string;
      const appVersion = "1.0";
      const photonClient = new Photon.LoadBalancing.LoadBalancingClient(
        Photon.ConnectionProtocol.Wss,
        appId,
        appVersion
      );
      // Nameを設定
      photonClient.myActor().setName(userData.userId);
      setClient(photonClient);

      // ===========================
      // 2. MasterServer と接続
      // ===========================
      photonClient.connectToRegionMaster("jp"); // 例: jp リージョン
      console.log("[CreateJoin] Master Server 接続開始");

      // ===========================
      // 3. ルーム作成 / 参加
      // ===========================
      photonClient.onStateChange = (state: any) => {
        console.log("Photon state1:", state);

        // ConnectedToMaster になったらルーム作成/参加
        if (state === 4) { // ConnectedToMaster
          if (activeTab === "create") {
            console.log("Creating room...");
            photonClient.createRoom(roomName, { maxPlayers: 8 });
          } else {
            console.log("Joining room...");
            photonClient.joinRoom(roomName);
          }
        }

        console.log("Photon state2:", state);

        // Joined になったらページ遷移
        if (state === 8) { // Joined
          console.log("Room joined, navigating...");
          setIsLoading(false);
          navigate("/waiting", { state: { roomName } });
        }
      };

    } catch (err: any) {
      console.error(err);
      alert(`接続に失敗しました: ${err.message}`);
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
