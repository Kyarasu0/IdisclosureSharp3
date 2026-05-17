// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/disconnectPhoton.ts
// ======================================

export const disconnectPhoton = () => {
  const client = (window as any).photonClient;

  // ====================
  // 存在チェック
  // ====================
  if (!client) {
    console.warn("No Photon client found");
    return;
  }

  try {
    // ====================
    // ルーム退出（入っている場合のみ）
    // ====================
    if (client.isJoinedToRoom?.()) {
      client.leaveRoom?.();
    }

    // ====================
    // サーバー切断
    // ====================
    client.disconnect?.();

  } catch (e) {
    console.error("Disconnect failed:", e);
  }

  // ====================
  // グローバル参照削除
  // ====================
  (window as any).photonClient = null;
};