import React from "react";
import styles from "./SNSWidget.module.css";

export type Message = {
  id: number;
  type: "me" | "other" | "system";
  name?: string;
  text: string;
};

type Props = {
  messages: Message[];
};

export const SNSServer: React.FC<Props> = ({ messages }) => {

  const sampleChat: Message[] = 
        [
            {
                "id": 1,
                "type": "system",
                "text": "SECURE CONNECTION ESTABLISHED"
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
            {
                "id": 3,
                "type": "me",
                "name": "KYARASU",
                "text": "I'm in."
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
            {
                "id": 2,
                "type": "other",
                "name": "ENIGMA",
                "text": "Firewall is active."
            },
        ]

  return (
    <div className={styles.container}>
      <div className={styles.chatBox}>
        {messages.map((msg) => {
          if (msg.type === "system") {
            return (
              <div key={msg.id} className={styles.system}>
                {msg.text}
              </div>
            );
          }

          const isMe = msg.type === "me";

          return (
            <div
              key={msg.id}
              className={`${styles.row} ${
                isMe ? styles.right : styles.left
              }`}
            >
              <div
                className={`${styles.bubble} ${
                  isMe ? styles.me : styles.other
                }`}
              >
                {msg.name && (
                  <div className={styles.name}>{msg.name}</div>
                )}
                <div className={styles.text}>{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};