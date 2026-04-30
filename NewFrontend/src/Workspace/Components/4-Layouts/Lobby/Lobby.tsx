// ==========================================
// Components/4-Layouts/Lobby/Lobby.tsx
// ==========================================

// ReactNode = 文字・アイコンなど自由に入れられる型
import type { ReactNode } from "react";

// 他のコンポーネントをインポート
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { RoundedButton } from "./../../1-Atoms/Control/RoundedButton/RoundedButton";

// デザインに関するファイルをインポート
import styles from "./Lobby.module.css";
import { ArrowBigLeft } from "lucide-react";

type Props = {
  onReturnClick: () => void;
  children: ReactNode;
};

export const Lobby = ({
  onReturnClick,
  children,
}: Props) => {
  return(
    <div className={styles.lobbyContainer}>
      <header className={styles.lobbyHeader}>
          {/* ロゴマーク */}
          <Logo size="md" type="horizontal"/>
      </header>
      <main className={styles.lobbyMain}>
          {children}
      </main>
      <footer className={styles.lobbyFooter}>
          {/* 戻るボタン */}
          <RoundedButton 
              size="lg"
              icon={ArrowBigLeft}
              onClick={onReturnClick}
          />
      </footer>
  </div>
  );
}