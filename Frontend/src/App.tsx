// ==========================================
// メインコンポーネント: App (Router + Animation)
// ==========================================
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Introduction } from "./WorkSpace/Pages/Introduction/Introduction";
import { Registration } from "./WorkSpace/Pages/Registration/Registration";
import { SecretEntry } from "./WorkSpace/Pages/SecretEntry/SecretEntry";
import { CreateJoin } from "./WorkSpace/Pages/CreateJoin/CreateJoin";
import { CyberBackground } from "./WorkSpace/Animation/CyberBackground";
import { TapRipple } from "./WorkSpace/Effects/TapEffect";
import styles from "./App.module.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Introduction />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Registration />
            </PageWrapper>
          }
        />
        <Route
        path="/secret-entry"
        element={
            <PageWrapper>
                <SecretEntry />
            </PageWrapper>
        }
        />
        <Route
        path="/create-join"
        element={
            <PageWrapper>
                <CreateJoin />
            </PageWrapper>
        }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <CyberBackground />
        <TapRipple />

        <main className={styles.main}>
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}
