// ======================================
// Functions/5-Daemons/handleSnsLeak.ts
// ======================================
import { getCustomProperties } from "../3-Photon/getCustomProperties";
import type { Participant } from "../2-Utils/initGame"; // 型をインポート
import { sendData } from "../3-Photon/sendData";

type SnsPost = {
  id: number;
  type: "me" | "other" | "system";
  userId?: string;
  text: string;
};

export const snsLeak = (
    targetPlayerId: string, // リーク対象の internalUserId
    leakStep: number,       // 1〜6 の段階
    setCustomPropertiesFn: (key: string, value: string) => void,
    participants: Participant[],
    eventMap: any
) => {
    const client = (window as any).photonClient;
    if (!client) return;

    const myActorNr = client.myActor().actorNr;
    const sorted = [...participants].sort((a, b) => a.actorNr - b.actorNr);

    // 自分のインデックスを取得
    const index = sorted.findIndex(p => p.actorNr === myActorNr);
    if (index === -1) return;

    // ─── [本来のリーク処理] ───
    const playerInfo = JSON.parse(getCustomProperties(targetPlayerId) || "{}");
    const pcIp = playerInfo.pcIp || "123.123.123.123";
    const pcInfo = JSON.parse(getCustomProperties(pcIp) || "{}");
    
    if (playerInfo.userId) {
        let leakText = "";
        switch (leakStep) {
            case 1: leakText = `[ALERT] Profile Name Leaked -> Code: ${playerInfo.userId}`; break;
            case 2: leakText = `[ALERT] User "${playerInfo.userId}" Current Score: ${playerInfo.score}`; break;
            case 3:
                const birthYear = playerInfo.birthDate ? playerInfo.birthDate.split("/")[0] : "UNKNOWN";
                leakText = `[ALERT] User "${playerInfo.userId}" Birth Year: ${birthYear}`;
                break;
            case 4:
                const birthMd = playerInfo.birthDate ? playerInfo.birthDate.split("/").slice(1).join("/") : "UNKNOWN";
                leakText = `[ALERT] User "${playerInfo.userId}" Birthday: ${birthMd}`;
                break;
            case 5: leakText = `[ALERT] User "${playerInfo.userId}" PC Battery Level: ${pcInfo.batteryNow}%`; break;
            case 6: leakText = `[CRITICAL] Network Address Exposed -> User "${playerInfo.userId}" PC: ${playerInfo.pcIp} / Server: ${playerInfo.serverIp}`; break;
        }

        if (leakText) {
            // タイムラインに追加
            const currentPosts: SnsPost[] = JSON.parse(getCustomProperties("snsPosts") || "[]");
            currentPosts.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                type: "other",
                userId: playerInfo.userId,
                text: leakText
            });
            setCustomPropertiesFn("snsPosts", JSON.stringify(currentPosts));

            // ローカルログに追記
            const currentLogs: string[] = playerInfo.systemLog || [];
            currentLogs.push(`[CRITICAL] TARGET PROFILE LEAK DETECTED: ${leakText}`);
            playerInfo.systemLog = currentLogs;
            setCustomPropertiesFn(targetPlayerId, JSON.stringify(playerInfo));
        }
    }

    // ─── [🔥 ここからリレー・通知処理] ───
    const isLast = index === sorted.length - 1;

    if (isLast) {
        // 🎯 最後の人の場合: 全員に対して「更新されたよ！」と通知を出す
        console.log("[snsLeak] Last player finished. Sending sync event to all.");
        sendData(eventMap.EVENT_ACTIVE_WEB_CHANGED, null, { receivers: 1 }); // 1: 全員
    } else {
        // ➡️ 途中の人の場合: 次のプレイヤーに対して「君の番だよ」とシグナルを送る
        const next = sorted[index + 1];
        if (next) {
            console.log(`[snsLeak] Relay to next actor: ${next.actorNr}`);
            // ここ用の新しいイベントコード（例: EVENT_SNS_LEAK_RELAY）を用意して通知する
            sendData(eventMap.EVENT_SNS_LEAK_RELAY, { leakStep: leakStep }, {
                targetActors: [next.actorNr],
            });
        }
    }
};