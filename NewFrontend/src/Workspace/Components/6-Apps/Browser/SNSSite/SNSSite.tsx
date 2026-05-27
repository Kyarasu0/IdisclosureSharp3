// ============================================================================
// SNSServer.tsx
// SNS Tool
// - Browser Tool 用
// - Photon置換しやすい構成
// - 自分でデータ取得する構成
// ============================================================================

// =========================================================
// Mock Data
// =========================================================
const mockPosts: Post[] = [
  {
    id: 1,
    type: "system",
    userId: "SYSTEM",
    text: "Secure connection established."
  },
  {
    id: 2,
    type: "other",
    userId: "admin",
    text: "Anyone online?"
  },
  {
    id: 3,
    type: "me",
    userId: "player01",
    text: "I'm here."
  },
  {
    id: 4,
    type: "other",
    userId: "admin",
    text: "Target server IP was updated."
  },
  {
    id: 5,
    type: "me",
    userId: "player01",
    text: "Send new address."
  },
  {
    id: 6,
    type: "system",
    userId: "SYSTEM",
    text: "WARNING : Unauthorized access detected."
  },
  {
    id: 7,
    type: "other",
    userId: "ghost",
    text: "Too late."
  },
];

import { useEffect, useRef, useState } from "react";

// Functions
import { getCustomProperties } from "../../../../Functions/3-Photon/getCustomProperties";

// Styles
import styles from "./SNSSite.module.css";

// =========================
// Browser 共通Props
// =========================
type Props = {
  mainColor: string;
  subColor?: string;
};

// =========================
// 投稿型
// =========================
export type Post = {
  id: number;

  // 投稿タイプ
  type: "me" | "other" | "system";

  // 投稿者
  userId?: string;

  // 本文
  text: string;
};

// ============================================================================
// Main Component
// ============================================================================
export const SNSSite = ({
  mainColor,
  subColor,
}: Props) => {

  // =========================================================
  // 投稿一覧
  // Photon化時はここを置き換える
  // =========================================================
  const [posts, setPosts] = useState<Post[]>([]);

  // =========================================================
  // スクロール対象
  // =========================================================
  const chatRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // 初期ロード
  // Window表示時
  // =========================================================
  useEffect(() => {

    // 保存データ取得
    // const savedPosts = JSON.parse(getCustomProperties("snsPosts") || "[]");
    const savedPosts = mockPosts;

    // データが無い場合
    if (savedPosts.length <= 0) {
      setPosts([
        {
          id: 1,
          type: "system",
          userId: "SYSTEM",
          text: "Not found..."
        }
      ]);
      return;
    }

    // 投稿セット
    setPosts(savedPosts);

  }, []);

  // =========================================================
  // 投稿更新時
  // 最下部へスクロール
  // =========================================================
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [posts]);

  return (
    <div 
      className={styles.container}
      style={{ "--main-color": mainColor, "--sub-color": subColor} as React.CSSProperties }
    >

      {/* ================================================= */}
      {/* Chat Area */}
      {/* ================================================= */}
      <div
        ref={chatRef}
        className={styles.chatBox}
      >
        {posts.map((post) => {
          // =================================================
          // System Message
          // =================================================
          if (post.type === "system") {
            return (
              <div
                key={post.id}
                className={styles.system}
              >
                {post.text}
              </div>
            );
          }

          // 自分投稿か
          const isMe = post.type === "me";

          return (
            <div
              key={post.id}
              className={ isMe ? styles.right : styles.left }
            >

              {/* 投稿本体 */}
              <div className={ isMe ? `${styles.post} ${styles.me}` : `${styles.post} ${styles.other}` }>

                {/* 投稿者 */}
                {post.userId && (
                  <span className={styles.userId}>
                    {post.userId}
                  </span>
                )}

                {/* 本文 */}
                <span className={styles.text}>
                  {post.text}
                </span>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};