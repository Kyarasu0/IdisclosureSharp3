// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/getPhotonPlayers.ts
// ======================================

// ================================
// 型（最低限だけ定義）
// ================================
export type PhotonPlayer = {
  actorNr: number;
  name: string;
  isLocal: boolean;
  isMasterClient: boolean;
};

// ================================
// 参加者取得関数
// ================================
export const getPhotonPlayers = (): PhotonPlayer[] => {
  // グローバルに保持しているclientを取得
  const client = (window as any).photonClient;

  // clientが無い場合は空配列
  if (!client) return [];

  // 参加者一覧取得
  const actors = client.myRoomActorsArray?.() || [];

  // 必要な形に整形して返す
  return actors.map((actor: any) => ({
    actorNr: actor.actorNr,
    name: actor.name || `Player${actor.actorNr}`, // 名前が無い場合のフォールバック
    isLocal: actor.isLocal,
    isMasterClient: actor.actorNr === 1, // 今は簡易判定
  }));
};