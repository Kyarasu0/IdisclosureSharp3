// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/setCustomProperties.ts
// ======================================

export const setCustomProperties = (key: string, value: string) => {
  const client = (window as any).photonClient;
  const room = client?.myRoom?.();

  if (!room) {
    console.log("[setCustomProperties] no room");
    return;
  }

  room.setCustomProperties({
    [key]: value,
  });

  console.log(`[setCustomProperties] ${key}: ${value}`);
};