// ======================================
// Functions/Photon/initGame.ts
// ======================================
import { getCustomProperties } from "../3-Photon/getCustomProperties";
import { setCustomProperties } from "../3-Photon/setCustomProperties";
import { sendData } from "../3-Photon/sendData";

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

type ActiveWeb = {
  toolName: string;
  toolWebIp: string;
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

  const raw = getCustomProperties("ipList");
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

  // 個人
  // internalUserId: {
  //      === 個人ステータス ===
  //      isAlive: 生存しているか(boolean)
  //      postLimit: SNSServerに投稿できる上限回数
  //      hasTools: 各アイテムを何個持っているかのオブジェクト
  //      malwareCondition: 現在自分が仕掛けたウイルスが感染しているIPの配列
  //      pcIp: PCのIP
  //      serverIp: ServerのIP
  //      wifi: 現在使用しているwifi
  //      systemLog: PCに表示するSystemLogの配列
  //
  //      === 個人プロフィール ===
  //      birthDate:
  //      secretId:
  //      score:
  // }
  //
  // pcIp: PCのIPアドレス: {
  //     batteryNow: PCのバッテリー
  //     blockedIpList: PCで現在ブロックしているIPの配列
  //     terminalLog: PCのターミナルでの実行結果のログ
  // }
  //
  // serverIp: ServerのIPアドレス: {
  //     batteryNow: Serverのバッテリー
  //     isPhishingNow: 現在Phishing中かどうか
  //     blockedIpList: Serverで現在ブロックしているIPの配列
  //     terminalLog: Serverのターミナルでの実行結果のログ
  // }

  // Set Log(本番は消す)
  console.log("ipList: ", ipList);
  setCustomProperties("ipList", JSON.stringify(ipList));

  // ==============================
  // 最新構成でプレイヤー情報を保存
  // ==============================
  // 1. プレイヤー情報の登録
  const internalUserId = crypto.randomUUID();
  const playerInfo = {
    // ステータス
    isAlive: true,
    postLimit: 3,
    // 状態
    wifi: "",
    hasTools: {},
    malwareCondition: [],
    systemLog: ["[root] System Log initialized."],
    // IPs
    pcIp: pcIp,
    serverIp: serverIp,
    // プロフィール
    userId: registrationData.userId,
    birthDate: registrationData.birthDate,
    secretId: registrationData.secretId,
    score: registrationData.score,
  }
  setCustomProperties(internalUserId, JSON.stringify(playerInfo));
  // 2. PCのIPに関する情報の登録
  const pcIpInfo = {
    internalUserId: internalUserId,
    batteryNow: 100,
    blockedIpList: [],
    terminalLog: []
  }
  setCustomProperties(pcIp, JSON.stringify(pcIpInfo));
  // 3. ServerのIPに関する情報の登録
  const serverIpInfo = {
    internalUserId: internalUserId,
    batteryNow: 100,
    blockedIpList: [],
    terminalLog: []
  }
  setCustomProperties(serverIp, JSON.stringify(serverIpInfo));
  // 4. ゲーム開始時点でのプレイヤーのリスト登録
  const playerList = JSON.parse(getCustomProperties("playerList") || "[]");
  playerList.push(internalUserId);
  setCustomProperties("playerList", JSON.stringify(playerList));
  // 5. 内部的なuserIdをローカルストレージに保存
  localStorage.setItem("internalUserId", internalUserId);

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
    setCustomProperties("startTime", String(Date.now()));

    // ActiveWebList生成
    let ipList: string[] = [];
    const activeWebList: ActiveWeb[] = [];

    // SNSServerの初期化
    const ip = generateIP();
    ipList.push(ip);
    activeWebList.push({toolName: "SNSSite", toolWebIp: ip});
    setCustomProperties("ipList", JSON.stringify(ipList));
    setCustomProperties("activeWebList", JSON.stringify(activeWebList));

    // 自分のActor初期化
    initActor(participants, getLocalStorage, eventCode);
  }

  // Shutdown Log
  console.log(`\n[${logOwner}] Shutdown!\n`);
};