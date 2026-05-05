// ======================================
// Functions/Photon/initGame.ts
// ======================================
import { getProperties } from "../Photon/getProperties";
import { setProperties } from "../Photon/setProperties";
import { sendData } from "../Photon/sendData";

// ================================
// 型
// ================================
export type Participant = {
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

// ================================
// Actor初期化（共通化）
// ================================
export const initActor = (
  participants: Participant[],
  getLocalStorage: <T>(key: string) => T,
  eventCode?: number,
) => {
  const client = (window as any).photonClient;
  if (!client) return;

  // Startup Log(Function)
  const logOwner = "initActor";
  console.log(`\n${logOwner}-Function is running!\n`);

  // ★修正① isLocal依存をやめて actorNr基準にする
  const myActorNr = client.myActor().actorNr;
  const sorted = [...participants].sort((a, b) => a.actorNr - b.actorNr);

  const local = sorted.find(p => p.actorNr === myActorNr);
  if (!local) {
    console.log("localが見つからなかった", JSON.stringify(participants));
    return;
  }

  const registrationData = getLocalStorage<registrationData>("registrationData");

  const raw = getProperties("IPList");
  let ipList: string[] = raw ? JSON.parse(raw) : [];

  // PC / Server IP生成（重複回避）
  let pcIp = "";
  let serverIp = "";

  // PCのIPを生成
  while (true) {
    const ip = generateIP();
    if (!ipList.includes(ip)) {
      pcIp = ip;
      ipList.push(ip);
      break;
    }
  }

  // ServerのIPを生成
  while (true) {
    const ip = generateIP();
    if (!ipList.includes(ip)) {
      serverIp = ip;
      ipList.push(ip);
      break;
    }
  }

  // Set Log(本番は消す)
  console.log("IPList: ", ipList);
  setProperties("IPList", JSON.stringify(ipList));

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

  // ================================
  // 🔥 ターン進行（追加）
  // ================================
  if (!sendData || !eventCode) return;

  const index = sorted.findIndex(p => p.actorNr === myActorNr);
  if (index === -1) return;

  const isLast = index === sorted.length - 1;

  // 最後の人ならリレーしない
  if (isLast) {
    console.log(`[${logOwner}] This is last actor. Stop relay.`);
    return;
  }

  const next = sorted[index + 1];
  if (!next) return;

  sendData(eventCode, { nextActorNr: next.actorNr }, {
    targetActors: [next.actorNr],
  });

  // Shutdown Log
  console.log(`\n[${logOwner}] Shutdown!\n`);
};

// ================================
// メイン関数
// ================================
export const initGame = (
  participants: Participant[],
  getLocalStorage: <T>(key: string) => T,
  eventCode: number,
) => {
  const client = (window as any).photonClient;
  if (!client) return;

  // ================================
  // 自分のインデックス
  // ================================
  const myActorNr = client.myActor().actorNr;
  const sorted = [...participants].sort((a, b) => a.actorNr - b.actorNr);

  const local = sorted.find(p => p.actorNr === myActorNr);
  if (!local) return;

  const index = sorted.findIndex(p => p.actorNr === myActorNr);

  // Startup Log(Function)
  const logOwner = `initGame_${index}`;
  console.log(`\n${logOwner}-Function is running!\n`);

  // ================================
  // マスター処理
  // ================================
  if (local.isMasterClient) {

    // 初期時間・開始時間
    setProperties("startTime", String(Date.now()));

    // ActiveWebList生成
    let ipList: string[] = [];
    const activeWebList: Record<string, string> = {};

    // SNSServerの初期化
    const ip = generateIP();
    ipList.push(ip);
    activeWebList["SNSServer"] = ip;
    setProperties("IPList", JSON.stringify(ipList));
    setProperties("ActiveWebList", JSON.stringify(activeWebList));

    // 自分のActor初期化
    initActor(participants, getLocalStorage);

    // 次に回す
    const next = sorted[index + 1];
    if (next) {
      sendData(eventCode, { nextActorNr: next.actorNr }, {
        targetActors: [next.actorNr],
      });
    }
  }

  // Shutdown Log
  console.log(`\n[${logOwner}] Shutdown!\n`);
};