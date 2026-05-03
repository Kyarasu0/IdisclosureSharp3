// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/sendData.ts
// ======================================
// 自分以外に送る
// sendData(1, data);
// 全員に送る
// sendData(1, data, { receivers: 1 });
// マスターに送る
// sendData(1, data, { receivers: 2 });
// 特定のプレイヤーに送る
// sendData(1, data, { targetActors: [3, 5] });
// キャッシュ付きで送る
// sendData(1, data, { cache: 4 });

// ================================
// 型（送信オプション）
// ================================
export type SendOptions = {
  receivers?: 0 | 1 | 2; // Others / All / MasterClient
  targetActors?: number[];
  cache?: number; // 例: 4 = AddToRoomCache
};

// ================================
// 送信関数
// ================================
export const sendData = <T>(
  eventCode: number,
  data: T,
  options?: SendOptions,
) => {
  // グローバルclient取得
  const client = (window as any).photonClient;
  if (!client) return;

  // ================================
  // デフォルト設定
  // ================================
  const sendOptions = {
    receivers: 0, // デフォルト: Others
    ...options,
  };

  // ================================
  // 送信
  // ================================
  client.raiseEvent?.(eventCode, data, sendOptions);
};