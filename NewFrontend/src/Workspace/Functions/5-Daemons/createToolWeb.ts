// ======================================
// Functions/Daemon/createToolWeb.ts
// ======================================

import { ToolsRegistry } from "../../../Core/Registries/DesktopRegistries/ToolsRegistry";
import { generateIP } from "../2-Utils/initGame";
import { getCustomProperties } from "../3-Photon/getCustomProperties";
import { setCustomProperties } from "../3-Photon/setCustomProperties";
import { sendData } from "../3-Photon/sendData";

// ======================================
// 型
// ======================================

type ActiveWeb = {
    toolName: string;
    toolWebIp: string;
    phishingOwner?: string;
};

// ======================================
// ToolWeb生成
// ======================================

export const createToolWeb = (
    eventCode: number,
    spawnProbability: number
) => {

    // ======================================
    // 確率判定
    // ======================================
    const success = Math.random() < spawnProbability;
    // 外れ
    if (!success) return;

    // ======================================
    // 現在の状態取得
    // ======================================

    const activeWebList: ActiveWeb[] = JSON.parse( getCustomProperties("activeWebList") || "[]" );
    const ipList: string[] = JSON.parse( getCustomProperties("ipList") || "[]" );

    // ======================================
    // Tool一覧取得
    // ======================================

    const allTools = Object.keys(ToolsRegistry).filter(tool => tool !== "SNSSite");

    // ======================================
    // まだ出ていないToolのみ抽出
    // ======================================

    const activeToolNames =
        activeWebList.map(
            web => web.toolName
        );

    const inactiveTools =
        allTools.filter(
            tool =>
                !activeToolNames.includes(tool)
        );

    // 全部出現済み
    if (inactiveTools.length === 0) {
        return;
    }

    // ======================================
    // Tool決定
    // ======================================

    const toolName =
        inactiveTools[
            Math.floor(
                Math.random() * inactiveTools.length
            )
        ];

    // ======================================
    // IP生成
    // ======================================

    let toolWebIp = "";

    while (true) {
        const ip = generateIP();
        if (!ipList.includes(ip)) {
            toolWebIp = ip;
            ipList.push(ip);
            break;
        }
    }

    // ======================================
    // Active化
    // ======================================

    activeWebList.push({ toolName, toolWebIp });
    // 保存
    setCustomProperties( "activeWebList", JSON.stringify(activeWebList) );
    setCustomProperties( "ipList", JSON.stringify(ipList) );

    // ======================================
    // 全員へ通知
    // ======================================

    sendData(eventCode, activeWebList, { receivers: 1 });

    console.log( `[createToolWeb] ${toolName} created` );
};