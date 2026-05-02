// 型読み込み
/// <reference path="../../../types/photon.d.ts" />

// ======================================
// Functions/Photon/subscribeProperties.ts
// ======================================

import { getProperties } from "./getProperties";

export const subscribeProperties = <T>(
  key: string,
  setValue: (v: T) => void,
  parser: (v: unknown) => T,
) => {
  const client = (window as any).photonClient;

  console.log("🟢 [subscribeProperties] INIT", {
    key,
    clientExists: !!client,
    roomExists: !!client?.myRoom?.(),
  });

  if (!client?.myRoom?.()) {
    console.warn("⚠️ [subscribeProperties] no client or room -> abort");
    return () => {};
  }

  const updateFromProps = (props?: any, source = "manual") => {
    console.log("📦 [updateFromProps]", {
      source,
      props,
      key,
    });

    // ==============================
    // ① 初期 or ポーリング用
    // ==============================
    if (!props) {
      const current = getProperties(key);

      console.log("🔍 [initial getProperties]", {
        key,
        current,
      });

      if (current !== null && current !== undefined) {
        const parsed = parser(current);
        console.log("➡️ [setValue INITIAL]", parsed);
        setValue(parsed);
      } else {
        console.warn("⚠️ [initial] value is null/undefined");
      }

      return;
    }

    // ==============================
    // ② イベント更新
    // ==============================
    console.log("📡 [event props keys]", Object.keys(props));

    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const value = props[key];

      console.log("🎯 [KEY HIT]", {
        key,
        value,
      });

      const parsed = parser(value);

      console.log("➡️ [setValue EVENT]", parsed);
      setValue(parsed);
    } else {
      console.log("❌ [KEY MISS]", key);
    }
  };

  // ==============================
  // 初回同期
  // ==============================
  console.log("🚀 [subscribeProperties] initial sync start");
  updateFromProps(undefined, "initial");

  // ==============================
  // イベントフック（安全版）
  // ==============================
  const prev = client.onRoomPropertiesUpdate;

  console.log("🧩 [subscribeProperties] attach event handler", {
    hasPrevious: !!prev,
  });

  client.onRoomPropertiesUpdate = (props: any) => {
    console.log("🔥 [Photon EVENT FIRED]", props);

    // 既存処理を壊さない
    if (typeof prev === "function") {
      console.log("🔁 [call previous handler]");
      prev(props);
    }

    updateFromProps(props, "event");
  };

  // ==============================
  // fallback polling（保険）
  // ==============================
  const interval = setInterval(() => {
    console.log("⏱️ [polling tick]");
    updateFromProps(undefined, "polling");
  }, 1000);

  // ==============================
  // cleanup
  // ==============================
  return () => {
    console.log("🧹 [subscribeProperties] cleanup start");

    clearInterval(interval);

    client.onRoomPropertiesUpdate = prev;

    console.log("✅ [subscribeProperties] cleanup done");
  };
};