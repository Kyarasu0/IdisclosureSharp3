// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/subscribePhotonPlayers.ts
// ======================================

import type { PhotonPlayer } from "./getPhotonPlayers";
import { getPhotonPlayers } from "./getPhotonPlayers";

// ================================
// 購読関数
// ================================
export const subscribePhotonPlayers = (
  setParticipants: (players: PhotonPlayer[]) => void
) => {
  const client = (window as any).photonClient;
  if (!client || !client.myRoom?.()) return () => {};

  // ====================
  // 更新処理
  // ====================
  const update = () => {
    setParticipants(getPhotonPlayers());
  };

  // ====================
  // 初期取得
  // ====================
  update();

  // ====================
  // イベント登録
  // ====================
  client.onActorJoin = update;
  client.onActorLeave = update;
  client.onActorPropertiesChange = update;

  // ====================
  // クリーンアップ
  // ====================
  return () => {
    client.onActorJoin = undefined;
    client.onActorLeave = undefined;
    client.onActorPropertiesChange = undefined;
  };
};