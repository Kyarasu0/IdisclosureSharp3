// ======================================
// Functions/Photon/initGame.ts
// ======================================
import { getProperties } from "../Photon/getProperties";
import { setProperties } from "../Photon/setProperties";
import { sendData } from "../Photon/sendData";
import { receiveData } from "../Photon/receiveData";

import { useAppearance } from "../../../Core/Contexts/AppearanceContext";

// ================================
// 型
// ================================
type Participant = {
  actorNr: number;
  name: string;
  isLocal: boolean;
  isMasterClient: boolean;
};

type registrationData = {
  userId: string;
  birthDate: string;
  secretId: string;
  score: number;
};

// ================================
// ユーティリティ
// ================================

// ランダムIP生成
const generateIP = (): string => {
  const rand = () => Math.floor(Math.random() * 254) + 1;
  return `${rand()}.${rand()}.${rand()}.${rand()}`;
};

// 簡易Hash
const hashIP = (ip: string) => {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

// ================================
// メイン関数
// ================================
export const initGame = (
  participants: Participant[],
  getLocalStorage: <T>(key: string) => T,
) => {
  const appearance = useAppearance();

  const client = (window as any).photonClient;
  if (!client) return;

  const local = participants.find(p => p.isLocal);
  if (!local) return;

  // ================================
  // 自分のインデックス
  // ================================
  const index = participants.findIndex(p => p.actorNr === local.actorNr);

  // ================================
  // Actor初期化
  // ================================
  const initActor = () => {
    const registrationData = getLocalStorage<registrationData>("registrationData");

    const raw = getProperties("IPHashList");
    let ipHashList: number[] = raw ? JSON.parse(raw) : [];

    // PC / Server IP生成（重複回避）
    let pcIp = "";
    let serverIp = "";

    // PCのIPを生成
    while (true) {
      const ip = generateIP();
      const h = hashIP(ip);
      if (!ipHashList.includes(h)) {
        pcIp = ip;
        ipHashList.push(h);
        break;
      }
    }

    // ServerのIPを生成
    while (true) {
      const ip = generateIP();
      const h = hashIP(ip);
      if (!ipHashList.includes(h)) {
        serverIp = ip;
        ipHashList.push(h);
        break;
      }
    }

    setProperties("IPHashList", JSON.stringify(ipHashList));

    client.myActor().setCustomProperties({
      playerInfo: {
        isAlive: true,
        pcIp,
        serverIp,

        userId: registrationData.userId,
        birthDate: registrationData.birthDate,
        secretId: registrationData.secretId,
        score: registrationData.score,

        pcBatteryNow: 100,
        serverBatteryNow: 100,

        WiFi: "WiFi_1",
        hasItems: {},
        isPhishingNow: false,
        pcBlockedIPList: [],
        serverBlockedIPList: [],
        malwareCondition: [],
      }
    });
  };

  // ================================
  // マスター処理
  // ================================
  if (local.isMasterClient) {

    // 初期時間・開始時間
    setProperties("startTime", String(Date.now()));

    // ActiveWebList生成
    let ipHashList: number[] = [];
    const activeWebList: Record<string, string> = {};

    const ip = generateIP();
    const hash = hashIP(ip);

    ipHashList.push(hash);
    activeWebList["SNSServer"] = ip;

    setProperties("IPHashList", JSON.stringify(ipHashList));
    setProperties("ActiveWebList", JSON.stringify(activeWebList));

    // 自分のActor初期化
    initActor();

    // 次に回す
    const next = participants[index + 1];
    if (next) {
      sendData(appearance.eventMap.EVENT_START, { nextActorNr: next.actorNr }, {
        targetActors: [next.actorNr],
      });
    }

  }

  // ================================
  // 受信処理
  // ================================
  const unsubscribe = receiveData<{ nextActorNr: number }>(
  appearance.eventMap.EVENT_START,
  ({ nextActorNr }) => {
    if (nextActorNr !== local.actorNr) return;

    initActor();

    const next = participants[index + 1];
    if (next) {
      sendData(appearance.eventMap.EVENT_START, { nextActorNr: next.actorNr }, {
        targetActors: [next.actorNr],
      });
    }

    // ★一回で解除
    unsubscribe();
  }
);
};