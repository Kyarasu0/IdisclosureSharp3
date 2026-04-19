// 基本的な関数をインポート
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
// 各Registryをインポート
import { PagesRegistry } from "./Core/Registries/PagesRegistry";
import { BackgroundsRegistry } from "./Core/Registries/BackgroundsRegistry";
import { CursorsRegistry } from "./Core/Registries/CursorsRegistry";
import { AppearancesRegistry } from "./Core/Registries/AppearancesRegistry";
import { TransitionsRegistry } from "./Core/Registries/TransitionsRegistry";
import { FunctionsRegistry } from "./Core/Registries/FunctionsRegistry";
// Contextをインポート
import { AppearanceContext } from "./Core/Contexts/AppearanceContext";
// ページ用のアウトラインをインポート
import { MainOutline } from "./Core/Outlines/Outline-v1";
// デザインに関するファイルをインポート
import styles from "./App.module.css";

// =============================
// AnimatedRoutes（構造そのまま）
// =============================
function AnimatedRoutes({
  Transition,
}: {
  Transition: React.ElementType;
}) {
  // 関数のレジストリの適応
  const functions = FunctionsRegistry();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {MainOutline.map((route) => {
          const Page = PagesRegistry[route.page];

          // --- 関数差し替え処理 ---
          const props = { ...(route.props || {}) };
          // props内の文字列キーを関数へ変換
          Object.keys(props).forEach((key) => {
            const value = props[key];
            if (
              // その引数が関数レジストリに存在するかを検知
              typeof value === "string" &&
              value in functions
            ) {
              // 存在した場合は関数名文字列から実際の関数に差し替え
              props[key] = functions[value as keyof typeof functions];
            }
          });

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Transition>
                   <Page {...props} />
                </Transition>
              }
            />
          );
        })}
      </Routes>
    </AnimatePresence>
  );
}

// =============================
// App（最終形）
// =============================
export default function App() {
  // ここで全体の構造を操作する
  const Background = BackgroundsRegistry.MajorCyberBackground;
  const Cursor = CursorsRegistry.TapRipple;
  const Transition = TransitionsRegistry.FadeBlur;
  const Appearance = AppearancesRegistry.MajorCyber;

  return (
    <AppearanceContext.Provider value={Appearance}>
      <BrowserRouter>
        <div
          className={styles.app}
          style={
            {
              "--color": Appearance.palette.cyan,
              "--background-color": Appearance.palette.black,

              // 必要なら増やせる
              "--accent": Appearance.palette.cyan,
              "--sub-color": Appearance.palette.gray,

              fontFamily: Appearance.font.primary,
            } as React.CSSProperties
          }
        >
          <Background />
          <Cursor />
          <main className={styles.main}>
            {/* 子要素のwidth, heightを上手く効かせる */}
            <AnimatedRoutes Transition={Transition} />
          </main>

        </div>
      </BrowserRouter>
    </AppearanceContext.Provider>
  );
}