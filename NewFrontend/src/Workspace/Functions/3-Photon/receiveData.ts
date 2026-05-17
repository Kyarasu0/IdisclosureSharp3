// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/receiveData.ts
// ======================================

// ================================
// 受信関数（購読）
// ================================
export const receiveData = <T>(
  eventCode: number,
  onReceive: (data: T, actorNr: number) => void,
) => {
  // グローバルclient取得
  const client = (window as any).photonClient;
  if (!client) return () => {};

  // ================================
  // 既存ハンドラ保持
  // ================================
  const prevHandler = client.onEvent;

  // ================================
  // 新しいハンドラ
  // ================================
  const handler = (code: number, content: T, actorNr: number) => {
    // 既存ハンドラも呼ぶ（破壊しない）
    prevHandler?.(code, content, actorNr);
    // eventCode一致時のみ処理
    if (code === eventCode) {
      onReceive(content, actorNr);
    }
  };

  // ハンドラ上書き
  client.onEvent = handler;

  // ================================
  // クリーンアップ（購読解除）
  // ================================
  return () => {
    client.onEvent = prevHandler;
  };
};