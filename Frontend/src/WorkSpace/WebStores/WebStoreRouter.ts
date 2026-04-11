// WebStores/WebStoreRouter.tsx
import { Download } from "./Download/Download"; // ← パスは適宜

export const WebStoreRouter = {
  TestItem: {
    component: Download,
    args: {
      "id": 1,
      "name": "TestInfo",
      "description": "これはテストデータです",
      "price": 300,
      "sampleCommand": "testinfo [IP] \n example: testinfo 123.123.123.123",
    },
    label: "TestItem",
  },
} as const;

export type WebStoreKey = keyof typeof WebStoreRouter;