export const WifisRegistry = {
    "WiFi_1",
    "WiFi_2",
    "WiFi_3",
} as const;

export type WifiKey = keyof typeof WifisRegistry;