// Theme/Appearance/MajorCyber/MajorCyberAppearance.ts
import { PALETTE } from "../ColorPalettes/ColorCertificationPalette";
import { FONT } from "../FontPalettes/MajorFontPalette/MajorFontPalette";
import { EventMap } from "../EventMaps/AsNeededEventMap";

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

    // ----- CustomPropertiesMemo -----
    // duration: 残り時間(初期設定)
    // startTime: 開始時間
    // IPHashList: IPがかぶっていないかを確認するList
    // → 順番シャッフルしないとね
    // ActiveWebList: 現在有効になっているWebとそのIPのリスト
    // → 支払いはそのIPの人を探していたらその人に支払いと失敗通知、いなかったら成功通知で行くか
    // WiFi_X: 各WiFiに保存されている通信履歴のリスト(duration, IP:IP)

    // ----- ActorPropertiesMemo -----
    // playerInfo: {
    //  isAlive: 生存しているか(boolean)
    //  pcIp: PCのIPアドレス
    //  serverIp: ServerのIPアドレス
    //  
    //  userId: 
    //  birthDate:
    //  secretId:
    //  score:
    //
    //  pcBatteryNow: PCのバッテリー
    //  serverBatteryNow: Serverのバッテリー
    //
    //  WiFi: 現在使用しているWiFi
    //  hasItems: 各アイテムを何個持っているかのオブジェクト
    //  isPhishingNow: 現在Phishing中かどうか
    //  pcBlockedIPList: PCで現在ブロックしているIPの配列
    //  serverBlockedIPList: Serverで現在ブロックしているIPの配列
    //  malwareCondition: 現在感染しているウイルスの配列
    // }
    
};