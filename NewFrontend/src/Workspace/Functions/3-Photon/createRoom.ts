// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ================================
// Functions/Photon/createRoom.ts
// ================================

export const createRoom = (
  roomName: string,
  userName: string,
  photonApiKey: string,
  onJoined: () => void,
) => {
  // Photon取得（global）
  const Photon = (window as any).Photon;

  // ====================
  // バリデーション
  // ====================
  if (!Photon?.LoadBalancing) {
    console.error("Photon not loaded");
    return;
  }

  if (!photonApiKey) {
    console.error("Missing API key");
    return;
  }

  // ====================
  // localStorage保存
  // ====================
  localStorage.setItem(
    "photonSettings",
    JSON.stringify({ photonApiKey, roomName })
  );

  // ====================
  // クライアント作成
  // ====================
  const client =
    new Photon.LoadBalancing.LoadBalancingClient(
      Photon.ConnectionProtocol.Wss,
      photonApiKey,
      "1.0"
    );

  // ユーザー名設定
  client.myActor().setName(userName);

  // ====================
  // 状態変化ハンドリング
  // ====================
  client.onStateChange = (state: number) => {

    // 接続完了 → ルーム作成
    if (state === 4) {
      client.createRoom(roomName, { maxPlayers: 8 });
    }

    // ルーム参加完了
    if (state === 8) {
      // グローバル保存（既存設計に合わせる）
      (window as any).photonClient = client;

      // 外から渡された処理を実行（遷移など）
      onJoined();
    }
  };

  // ====================
  // 接続開始
  // ====================
  client.connectToRegionMaster("jp");
};