// ==========================================================================
//  NewFrontend/src/Workspace/Components/6-Apps/Browser/Browser/Browser.tsx
// ==========================================================================

// Reactの標準モジュール
import { useState } from "react";
// Components
import { ValidatedInputField } from "../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";
import { BrowserHome } from "./../BrowserHome/BrowserHome";
import type { Post } from "../SNSSite/SNSSite";
// Styles
import styles from "./Browser.module.css";
// Icons
import { Search } from "lucide-react";
// Registry
import { ToolsRegistry } from "../../../../../Core/Registries/DesktopRegistries/ToolsRegistry";

// =========================
//  Types
// =========================
// Tool検索用タイプ
export type Tool = {
  toolName: string;
  toolWebIp: string;
};
// ブラウザに必要な配列を引数受取
export type BrowserProps = {
  mainColor?: string;
  subColor?: string;
  showSOF: (
      result: "success" | "failed",
      title?: string
  ) => void;
  activeWebList: Tool[];
  snsPosts: Post[];
};

// =========================
//  Main Component
// =========================
export const Browser = ({
  mainColor = "var(--cyan)",
  subColor = "var(--pink)",
  showSOF,
  activeWebList,
  snsPosts
}: BrowserProps) => {
  // ==========================
  //  Stateの準備
  // ==========================
  // 検索文字列
  const [searchWord, setSearchWord] = useState("");
  // 現在表示中Tool
  const [activeTool, setActiveTool] = useState("");

  // ==========================
  //  検索
  // ==========================
  const handleSearch = () => {
    // 検索文字列を正規化
    const normalizedSearch = searchWord.trim().toLowerCase();
    // 一致するWebが存在するか
    const exists = activeWebList.find((web) =>
      web.toolName.toLowerCase() === normalizedSearch ||
      web.toolWebIp.toLowerCase() === normalizedSearch
    );
    // 無ければHome
    if (!exists) {
      setActiveTool("");
      return;
    }
    // Registryに存在するか
    const matchedToolKey = Object.keys(ToolsRegistry).find(
      (key) => key.toLowerCase() === exists.toolName.toLowerCase()
    );
    // 存在したら画面遷移
    if (matchedToolKey) setActiveTool(matchedToolKey);
  };

  // ==========================
  //  現在表示しているTool
  // ==========================
  const CurrentTool = ToolsRegistry[activeTool as keyof typeof ToolsRegistry]?.Component;

  // ==========================
  //  Return
  // ==========================
  return (
    <div className={styles.browserContainer}>
      {/* Header */}
      <form 
        className={styles.browserHeader} 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >

        {/* 要素1: 検索欄 */}
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

        {/* 要素2: HomeボタンとSearchボタン */}
        <div className={styles.browserController}>
          {/* ボタン1: Homeボタン */}
          <SubmitButton
            type="button"
            className={styles.browserSubmitButton}
            mainColor={mainColor}
            onClick={() => setActiveTool("")}
          >
            Home
          </SubmitButton>
          {/* ボタン2: Searchボタン */}
          <SubmitButton
            type="button"
            className={styles.browserSubmitButton}
            mainColor={mainColor}
            onClick={handleSearch}
          >
            Search
          </SubmitButton>
        </div>
      </form>

      {/* Main */}
      <div className={styles.browserContent}>
        {/* Tool or Home画面の表示 */}
        {CurrentTool ? (
          <CurrentTool
            mainColor={mainColor}
            subColor={subColor}
            showSOF={showSOF}
            snsPosts={snsPosts}
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