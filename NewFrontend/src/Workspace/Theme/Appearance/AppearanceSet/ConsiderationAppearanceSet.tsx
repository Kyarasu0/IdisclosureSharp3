// Theme/Appearance/MajorCyber/MajorCyberAppearance.ts
import { PALETTE } from "../ColorPalettes/ColorCertificationPalette";
import { FONT } from "../FontPalettes/MajorFontPalette/MajorFontPalette";
import { EventMap } from "../EventMaps/AsNeededEventMap";
import { SimpleWifiSet } from "../WiFis/SimpleWifiSet";

export const ConsiderationAppearanceSet = {

    palette: PALETTE,
    font: FONT,
    scoreName: "Blue Shard",
    // 裕福層: 10000 ~ 25000
    // 準裕福層: 5000 ~ 7000
    // ノーマル: 3000 ~ 4000
    // 1個600円くらいにすれば(5 ~ 7, 8 ~ 11, 17 ~ 41)
    initialScore: 100000,
    userIdCost: 10,
    birthYearCost: 15,
    birthDayCost: 15,
    noiseCost: 5,
    // イベントマップ
    eventMap: EventMap,
    // WiFiセット
    wifiSet: SimpleWifiSet,

    // ----- CustomPropertiesMemo -----
    // 全体
    // duration: 残り時間(初期設定)
    // startTime: 開始時間
    // ipList: IPがかぶっていないかを確認するList
    // playerList: ゲーム開始時点で作成されたプレイヤーのList
    // activeWebList: 現在有効になっているWebとそのIPのリスト
    // → 支払いはそのIPの人を探していたらその人に支払いと失敗通知、いなかったら成功通知で行くか
    // wifi_X: 各WiFiに保存されている通信履歴のオブジェクト{duration, IP:IP}
    // snsPosts: SNSに投稿されている内容

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
    
};