// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ==============================
// Functions/Photon/joinRoom.ts
// ==============================

export const joinRoom = (
  roomName: string,
  userName: string,
  photonApiKey: string,
  onJoined: () => void
) => {
  // Photon取得
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

    // 接続完了 → ルーム参加
    if (state === 4) {
      client.joinRoom(roomName);
    }

    // 参加成功
    if (state === 8) {
      (window as any).photonClient = client;

      // 外から渡された処理（遷移など）
      onJoined();
    }
  };

  // ====================
  // 接続開始
  // ====================
  client.connectToRegionMaster("jp");
};