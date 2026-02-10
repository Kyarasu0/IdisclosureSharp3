// // ==========================================
// // ページ1: イントロダクション画面
// // ==========================================
// import { Zap } from 'lucide-react';
// import ICON_PATH from '../Images/IdisclosureIcon.png';

// export const IntroScreen = ({ onStart, isExiting }: { onStart: () => void; isExiting: boolean }) => {
//   return (
//     <div className={`flex flex-col items-center justify-center min-h-screen transition-all duration-700 ${isExiting ? 'opacity-0 scale-110 blur-sm' : 'opacity-100 scale-100'}`}>
      
//       {/* ヒーローロゴエリア */}
//       <div className="flex flex-col items-center justify-center mb-12 relative z-10">
        
//         {/* アイコン画像 (指定パス) */}
//         <div className="relative mb-8 group">
//           <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />
//           <img 
//             src={ICON_PATH} 
//             alt="Lock Icon" 
//             className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] relative z-10"
//             onError={(e) => {
//                 // 画像読み込みエラー時のフォールバック（SVG）
//                 e.currentTarget.style.display = 'none';
//                 e.currentTarget.nextElementSibling?.classList.remove('hidden');
//             }}
//           />
//           {/* 画像が見つからない場合のフォールバックアイコン */}
//           <div className="hidden w-32 h-32 flex items-center justify-center border-2 border-cyan-500 rounded-2xl bg-slate-900/50 backdrop-blur">
//              <span className="text-cyan-500 text-xs">NO IMAGE</span>
//           </div>
//         </div>

//         {/* タイトルテキスト */}
//         <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-anonymous text-center leading-tight">
//           {/* Id (Pink & Glow) */}
//           <span className="font-anonymous text-transparent tracking-widest bg-clip-text bg-gradient-to-b from-[#ff00ff] to-[#d600d6] drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
//             Id
//           </span>
//           {/* isclosure (Cyan & Glow) */}
//           <span className="font-anonymous text-transparent tracking-widest bg-clip-text bg-gradient-to-b from-[#00f3ff] to-[#00c0cc] drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
//             isclosure
//           </span>
//           {/* #3 */}
//           <span className="font-anonymous ml-2 text-lime-400 tracking-widest drop-shadow-[0_0_8px_rgba(163,230,53,0.8)] text-4xl md:text-6xl align-top">
//             #3
//           </span>
//         </h1>
//         <p className="mt-4 text-cyan-200/70 text-sm tracking-[0.5em] font-mono animate-pulse">
//           SYSTEM BREACH PROTOCOL
//         </p>
//       </div>

//       {/* STARTボタン */}
//       <div className="mt-4">
//         <button
//           onClick={onStart}
//           className="group relative px-16 py-5 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
//         >
//           <div className="absolute inset-0 border border-cyan-500/50 rounded-full group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_#00f3ff] transition-all duration-300" />
//           <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-sm rounded-full" />
          
//           <span className="relative flex items-center gap-3 text-xl font-bold tracking-widest text-cyan-300 group-hover:text-white transition-colors font-mono">
//             PRESS TO START
//             <Zap size={20} className="group-hover:fill-current group-hover:text-pink-500 transition-colors" />
//           </span>
//         </button>
        
//         <div className="mt-8 text-center">
//           <div className="animate-bounce text-cyan-500/50 text-xl">▼</div>
//         </div>
//       </div>
//     </div>
//   );
// };