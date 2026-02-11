// ==========================================
// メインコンポーネント: App
// ==========================================
import { useState } from 'react';
import { Introduction } from './WorkSpace/Pages/Introduction/Introduction';
import { Registration } from './WorkSpace/Pages/Registration/Registration';
import { CyberBackground } from './WorkSpace/Animation/CyberBackground';
import { TapRipple } from './WorkSpace/Effects/TapEffect';

export default function App() {
  const [started, setStarted] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  // STARTボタンクリック時の遷移処理
  const handleStart = () => {
    setStarted(true);
    // アニメーション時間に合わせて画面切り替え
    setTimeout(() => {
      setShowRegistration(true);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1e] text-white overflow-x-hidden font-sans selection:bg-pink-500 selection:text-white">
      
      {/* 共通の背景エフェクト */}
      <CyberBackground />
      <TapRipple />

      {/* カスタムアニメーション定義 */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>

      {/* メインコンテンツ */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center">
        
        {!showRegistration ? (
          // 画面1: イントロ
          <Introduction onStart={handleStart} isExiting={started} />
        ) : (
          // 画面2: 登録フォーム
          <Registration />
        )}

      </main>
    </div>
  );
}