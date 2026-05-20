// ============================================================================
// Browser.tsx
// Browser Main Component
// ============================================================================

import { useEffect, useState } from "react";

// Components
import { ValidatedInputField } from "../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";
import { BrowserHome } from "./../BrowserHome/BrowserHome";

// Registry
import { ToolsRegistry } from "../../../../../Core/Registries/DesktopRegistries/ToolsRegistry";

// Functions
import { getCustomProperties } from "../../../../Functions/3-Photon/getCustomProperties";

// Styles
import styles from "./Browser.module.css";

// Icons
import { Search } from "lucide-react";

// =========================
// Types
// =========================
type Tool = {
  toolName: string;
  toolWebIp: string;
};

type Props = {
  mainColor?: string;
  subColor?: string;
  currentDevice: "PC" | "Server";
};

// ============================================================================
// Main Component
// ============================================================================
export const Browser = ({
  currentDevice,
  mainColor = "var(--cyan)",
  subColor = "var(--pink)"
}: Props) => {

  // 検索文字列
  const [searchWord, setSearchWord] = useState("");

  // 現在表示中Tool
  const [activeTool, setActiveTool] = useState("");

  // 接続可能Web一覧
  const [activeWebList, setActiveWebList] = useState<Tool[]>([]);

  // =========================================================
  // 初期ロード
  // =========================================================
  useEffect(() => {
    setActiveWebList(JSON.parse(getCustomProperties("activeWebList") || "[]"));
  }, []);

  // =========================================================
  // 検索
  // =========================================================
  // =========================================================
// 検索
// =========================================================
  const handleSearch = () => {

    // 検索文字列を正規化
    const normalizedSearch = searchWord.trim().toLowerCase();

    // 一致するWebが存在するか
    const exists = activeWebList.find((web) =>
      web.toolName.toLowerCase() === normalizedSearch ||
      web.toolWebIp.toLowerCase() === normalizedSearch
    );

    // 無ければ戻る
    if (!exists) {
      setActiveTool("");
      return;
    }

    // Registryに存在するか
    const matchedToolKey = Object.keys(ToolsRegistry).find(
      (key) => key.toLowerCase() === exists.toolName.toLowerCase()
    );

    if (matchedToolKey) {
      setActiveTool(matchedToolKey);
    }
  };

  // =========================================================
  // 現在表示Tool
  // =========================================================
  const CurrentTool =
    ToolsRegistry[activeTool as keyof typeof ToolsRegistry];

  return (
    <div className={styles.browserContainer}>

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}
      <form 
        className={styles.browserHeader} 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}>

        <ValidatedInputField
          label="SEARCH"
          value={searchWord}
          onChange={setSearchWord}
          required={true}
          placeholder="ENTER TARGET WEB NAME"
          icon={<Search size={18} />}
          className={styles.browserInput}
          mainColor={mainColor}
        />

        <div className={styles.browserController}>

          <SubmitButton
            type="button"
            className={styles.browserSubmitButton}
            mainColor={mainColor}
            onClick={() => setActiveTool("")}
          >
            Home
          </SubmitButton>

          <SubmitButton
            type="button"
            className={styles.browserSubmitButton}
            mainColor={mainColor}
            onClick={handleSearch}
          >
            Confirm
          </SubmitButton>
        </div>
      </form>

      {/* ================================================= */}
      {/* Main */}
      {/* ================================================= */}
      <div className={styles.browserContent}>

        {/* Tool表示 */}
        {CurrentTool ? (

          <CurrentTool
            currentDevice={currentDevice}
            mainColor={mainColor}
            subColor={subColor}
          />

        ) : (

          <BrowserHome
            activeWebList={activeWebList}
            mainColor={mainColor}
          />

        )}

      </div>
    </div>
  );
};