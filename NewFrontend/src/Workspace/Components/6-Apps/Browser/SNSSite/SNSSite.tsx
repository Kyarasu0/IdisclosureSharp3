// ==========================================================================
//  NewFrontend/src/Workspace/Components/6-Apps/Browser/SNSSite/SNSSite.tsx
// ==========================================================================

// =========================
//  SNS Post用
// =========================
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

// Reactの標準モジュール
import { useEffect, useRef, useState } from "react";
// Styles
import styles from "./SNSSite.module.css";
// Functions
import { getCustomProperties } from "../../../../Functions/3-Photon/getCustomProperties";

// =========================
//  Types
// =========================
type SNSProps = {
  mainColor?: string;
  subColor?: string;
  showSOF: (
      result: "success" | "failed",
      title?: string
  ) => void;
  snsPosts?: Post[];
};

// =========================
//  SNS Post用
// =========================
export type Post = {
  // ID
  id: number;
  // 投稿タイプ
  type: "me" | "other" | "system";
  // 投稿者
  userId?: string;
  // 本文
  text: string;
};

// =========================
//  Main
// =========================
export const SNSSite = ({
  mainColor,
  subColor,
  snsPosts = [],
}: SNSProps) => {
  // =======================
  //  Stateの準備
  // =======================
  const [posts, setPosts] = useState<Post[]>(snsPosts);

  // =======================
  //  スクロール制御
  // =======================
  const chatRef = useRef<HTMLDivElement>(null);

  // =======================
  //  ユーザー情報の取得
  // =======================
  const internalUserId = String(localStorage.getItem("internalUserId"));
  const userId = internalUserId ? JSON.parse(getCustomProperties(internalUserId) || "{}").userId : "";

  // =======================
  //  初期ロード
  // =======================
  useEffect(() => {
    // データが無い場合
    if (posts.length <= 0) {
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
    setPosts(posts);
  }, []);

  // =======================
  //  最下部への画面制御
  // =======================
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [posts]);

  // ==========================
  //  Return
  // ==========================
  return (
    <div 
      className={styles.container}
      style={{ "--main-color": mainColor, "--sub-color": subColor} as React.CSSProperties }
    >
      <div
        ref={chatRef}
        className={styles.chatBox}
      >
        {posts.map((post) => {
          // ==========================
          //  System表示
          // ==========================
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

          // ==========================
          //  自分or他人メッセージ表示
          // ==========================
          // 自分投稿か
          const isMe = post.type === userId;
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