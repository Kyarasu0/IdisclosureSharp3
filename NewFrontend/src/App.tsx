// ==========================================
// メインコンポーネント: App (Router + Animation)
// ==========================================
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Introduction } from "./Workspace/Components/5-Pages/1-Introduction/Introduction";
import { UserSetup } from "./Workspace/Components/5-Pages/2-UserSetup/UserSetup";
// import { Registration } from "./WorkSpace/Pages/Registration/Registration";
// import { SecretEntry } from "./WorkSpace/Pages/SecretEntry/SecretEntry";
// import { CreateJoin } from "./WorkSpace/Pages/CreateJoin/CreateJoin";
// import { Waiting } from "./WorkSpace/Pages/Waiting/Waiting";
// import { GameScreen } from "./WorkSpace/Pages/GameScreen/GameScreen";
// import { SuccessOrFailed } from "./WorkSpace/Pages/SuccessOrFailed/SuccessOrFailed";

// Themeのインポート
import { PALETTE } from "./Workspace/Theme/Palettes/MajorCyberPalette";
import { MajorCyberBackground } from "./Workspace/Theme/Backgrounds/MajorCyberBackground/MajorCyberBackground";
import { TapRipple } from "./Workspace/Theme/CursorEffects/TapRipple/TapRipple";
import styles from "./App.module.css";

// function AnimatedRoutes() {
//   const location = useLocation();

//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route
//           path="/"
//           element={
//             <PageWrapper>
//               <Introduction />
//             </PageWrapper>
//           }
//         />
//         <Route
//           path="/register"
//           element={
//             <PageWrapper>
//               <Registration />
//             </PageWrapper>
//           }
//         />
//         <Route
//         path="/secret-entry"
//         element={
//             <PageWrapper>
//                 <SecretEntry />
//             </PageWrapper>
//         }
//         />
//         <Route
//         path="/create-join"
//         element={
//             <PageWrapper>
//                 <CreateJoin />
//             </PageWrapper>
//         }
//         />
//         <Route
//         path="/waiting"
//         element={
//             <PageWrapper>
//                 <Waiting />
//             </PageWrapper>
//         }
//         />
//         <Route
//           path="/game-screen"
//           element={
//               <PageWrapper>
//                   <GameScreen />
//               </PageWrapper>
//           }
//         />
//         <Route
//           path="/sof"
//           element={
//               <PageWrapper>
//                   <SuccessOrFailed />
//               </PageWrapper>
//           }
//         />
//       </Routes>
//     </AnimatePresence>
//   );
// }

// ===================================
// 出現、消滅時のアニメーション付与関数
// ===================================
// childrenは子要素、React.ReactNodeは表示できるもの全部を表す型
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    // motion.div: アニメーション付きのdiv
    <motion.div
      className={styles.main}
      initial={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ===================================
// メインのApp関数
// ===================================
export default function App() {
  return (
    // URL監視や履歴管理、ルーティング機能の有効化などURL系の土台を担当
    <BrowserRouter>
      <div className={styles.app} style={{"--color": PALETTE.cyan, "--background-color": PALETTE.black}  as React.CSSProperties }>
        <MajorCyberBackground />
        <TapRipple />

        {/* <main className={styles.main}>
          // URLのパスに対して何を描画するか決める部分を担当
          <AnimatedRoutes />
        </main> */}

        <UserSetup isNavigationBlocked={false}/>
      </div>
    </BrowserRouter>
  );
}
