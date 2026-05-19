// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/getCustomProperties.ts
// ======================================

export const getCustomProperties = (key: string): string | null => {
    const client = (window as any).photonClient;
    if (!client || !client.myRoom?.()) return null;

    const props = client.myRoom().getCustomProperties();
    console.log(`[getCustomProperties] ${key}: ${props?.[key]}`);
    return props?.[key] ?? null;
};