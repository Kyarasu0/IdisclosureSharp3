// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/setProperties.ts
// ======================================

export const setProperties = (key: string, value: string) => {
  const client = (window as any).photonClient;
  const room = client?.myRoom?.();

  if (!room) {
    console.log("[setProperties] no room");
    return;
  }

  room.setCustomProperties({
    [key]: value,
  });

  console.log(`[setProperties] ${key}: ${value}`);
};