// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/getProperties.ts
// ======================================

export const getProperties = (key: string): string | null => {
    const client = (window as any).photonClient;
    if (!client || !client.myRoom?.()) return null;

    const props = client.myRoom().getCustomProperties();
    return props?.[key] ?? null;
};