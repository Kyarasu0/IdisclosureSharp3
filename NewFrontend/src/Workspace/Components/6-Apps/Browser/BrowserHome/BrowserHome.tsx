// ============================================================================
// BrowserHome.tsx
// 検索前ホーム画面
// ============================================================================

import styles from "./BrowserHome.module.css";

type Tool = {
  toolName: string;
  toolWebIp: string;
};

type Props = {
  activeWebList: Tool[];
  mainColor: string;
};

export const BrowserHome = ({
  activeWebList,
  mainColor
}: Props) => {

  return (
    <div
      className={styles.browserHome}
      style={{
        color: mainColor,
        textShadow: `0 0 10px ${mainColor}`
      }}
    >

      {activeWebList.map((tool) => (
        <div key={tool.toolWebIp}>
          {tool.toolName}: {tool.toolWebIp}
        </div>
      ))}

    </div>
  );
};