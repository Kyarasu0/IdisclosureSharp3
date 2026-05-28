// ======================================
// Functions/5-Daemons/handleSnsLeak.ts
// ======================================
import { getCustomProperties } from "../3-Photon/getCustomProperties";

// SNSSite.tsxのPost型に準拠した型定義
type SnsPost = {
  id: number;
  type: "me" | "other" | "system"; // ※保存時は仮の値を入れ、取得側で再判定しても良いですが、ここでは識別用データとして書き込みます
  userId?: string;
  text: string;
};

export const snsLeak = (
    targetPlayerId: string, // リーク対象の internalUserId
    leakStep: number,       // 1〜6 の段階
    setCustomPropertiesFn: (key: string, value: string) => void
) => {
    const playerInfo = JSON.parse(getCustomProperties(targetPlayerId) || "{}");
    const pcIp = playerInfo.pcIp || "123.123.123.123";
    const pcInfo = JSON.parse(getCustomProperties(pcIp) || "{}");
    
    if (!playerInfo.userId) return;

    // ─── 1. ステップに応じたテキスト生成 ───
    let leakText = "";
    switch (leakStep) {
        case 1:
            leakText = `[ALERT] Profile Name Leaked -> Code: ${playerInfo.userId}`;
            break;
        case 2:
            leakText = `[ALERT] User "${playerInfo.userId}" Current Score: ${playerInfo.score}`;
            break;
        case 3:
            const birthYear = playerInfo.birthDate ? playerInfo.birthDate.split("/")[0] : "UNKNOWN";
            leakText = `[ALERT] User "${playerInfo.userId}" Birth Year: ${birthYear}`;
            break;
        case 4:
            const birthMd = playerInfo.birthDate ? playerInfo.birthDate.split("/").slice(1).join("/") : "UNKNOWN";
            leakText = `[ALERT] User "${playerInfo.userId}" Birthday: ${birthMd}`;
            break;
        case 5:
            leakText = `[ALERT] User "${playerInfo.userId}" PC Battery Level: ${pcInfo.batteryNow}%`;
            break;
        case 6:
            leakText = `[CRITICAL] Network Address Exposed -> User "${playerInfo.userId}" PC: ${playerInfo.pcIp} / Server: ${playerInfo.serverIp}`;
            break;
        default:
            return;
    }

    // ─── 2. snsPosts構造に合わせたタイムライン追加 ───
    // SNSSite.tsxに合わせてキー名を "snsPosts" に統一
    const currentPosts: SnsPost[] = JSON.parse(getCustomProperties("snsPosts") || "[]");
    
    currentPosts.push({
        id: Date.now() + Math.floor(Math.random() * 1000), // 重複回避用の一意なID
        type: "other", // デフォルトは other。閲覧側(SNSSite.tsx)で自分のデータなら me に置換させる
        userId: playerInfo.userId, // リークされたユーザーの公開ID
        text: leakText
    });
    setCustomPropertiesFn("snsPosts", JSON.stringify(currentPosts));

    // ─── 3. 対象プレイヤーのローカルシステムログにも警告を追記 ───
    const currentLogs: string[] = playerInfo.systemLog || [];
    currentLogs.push(`[CRITICAL] TARGET PROFILE LEAK DETECTED: ${leakText}`);
    playerInfo.systemLog = currentLogs;
    setCustomPropertiesFn(targetPlayerId, JSON.stringify(playerInfo));
};