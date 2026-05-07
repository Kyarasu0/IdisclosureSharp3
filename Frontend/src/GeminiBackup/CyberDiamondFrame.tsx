<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber IP Frames</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <style>
    /* ベース設定 */
    :root {
      --cyber-cyan: #00f0ff;
      --cyber-cyan-glow: rgba(0, 240, 255, 0.5);
      --cyber-dark: #0a0f18;
      --cyber-bg: #111827;
    }

    body {
      background-color: var(--cyber-dark);
      background-image: 
        linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
      background-size: 30px 30px;
      font-family: 'Share Tech Mono', monospace;
      color: white;
    }

    /* 共通ユーティリティ */
    .text-glow {
      text-shadow: 0 0 8px var(--cyber-cyan-glow);
    }
    .neon-text {
      color: var(--cyber-cyan);
      text-shadow: 0 0 5px var(--cyber-cyan), 0 0 10px var(--cyber-cyan);
    }

    /* =========================================
       Type 1: Chamfered Box (角切り落とし)
    ========================================= */
    .cyber-box-1-outer {
      padding: 2px;
      background: var(--cyber-cyan);
      /* 左上と右下を切り落とした六角形 */
      clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
      transition: all 0.3s ease;
    }
    .cyber-box-1-inner {
      background: var(--cyber-bg);
      clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
    }
    .cyber-box-1-outer:hover {
      box-shadow: 0 0 20px var(--cyber-cyan-glow);
      filter: drop-shadow(0 0 10px var(--cyber-cyan));
    }

    /* =========================================
       Type 2: HUD Brackets (照準器風)
    ========================================= */
    .cyber-box-2 {
      position: relative;
      border: 1px solid rgba(0, 240, 255, 0.2);
      background: rgba(0, 240, 255, 0.05);
    }
    /* 四隅のL字型ブラケットを背景で描画 */
    .cyber-box-2::before {
      content: '';
      position: absolute;
      top: -3px; left: -3px; right: -3px; bottom: -3px;
      background:
        linear-gradient(to right, var(--cyber-cyan) 12px, transparent 12px) 0 0,
        linear-gradient(to bottom, var(--cyber-cyan) 12px, transparent 12px) 0 0,
        linear-gradient(to left, var(--cyber-cyan) 12px, transparent 12px) 100% 0,
        linear-gradient(to bottom, var(--cyber-cyan) 12px, transparent 12px) 100% 0,
        linear-gradient(to right, var(--cyber-cyan) 12px, transparent 12px) 0 100%,
        linear-gradient(to top, var(--cyber-cyan) 12px, transparent 12px) 0 100%,
        linear-gradient(to left, var(--cyber-cyan) 12px, transparent 12px) 100% 100%,
        linear-gradient(to top, var(--cyber-cyan) 12px, transparent 12px) 100% 100%;
      background-repeat: no-repeat;
      background-size: 15px 15px; /* ブラケットの太さ/長さ調整 */
      pointer-events: none;
      transition: all 0.3s ease;
    }
    .cyber-box-2:hover::before {
      background-size: 20px 20px;
    }

    /* =========================================
       Type 3: Velocity Skew (斜行スタイル)
    ========================================= */
    .cyber-box-3 {
      transform: skewX(-15deg);
      border-left: 4px solid var(--cyber-cyan);
      border-right: 2px solid var(--cyber-cyan);
      background: linear-gradient(90deg, rgba(0, 240, 255, 0.15) 0%, transparent 100%);
      position: relative;
      overflow: hidden;
    }
    /* 背景のストライプ模様 */
    .cyber-box-3::after {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 5px,
        rgba(0, 240, 255, 0.05) 5px,
        rgba(0, 240, 255, 0.05) 10px
      );
      z-index: 0;
    }
    .cyber-box-3-content {
      transform: skewX(15deg); /* 中身を元に戻す */
      position: relative;
      z-index: 1;
    }

    /* =========================================
       Type 4: Tech Data Panel (情報パネル風)
    ========================================= */
    .cyber-box-4 {
      position: relative;
      border-top: 2px solid var(--cyber-cyan);
      border-bottom: 1px solid rgba(0, 240, 255, 0.3);
      background: linear-gradient(180deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%);
    }
    /* 左側の装飾ブロック */
    .cyber-box-4::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 6px; height: 100%;
      background: var(--cyber-cyan);
    }
    /* 右下の斜めカット装飾 */
    .cyber-box-4::after {
      content: '';
      position: absolute;
      bottom: -1px; right: -1px;
      width: 25px; height: 25px;
      background: var(--cyber-bg);
      border-top: 1px solid rgba(0, 240, 255, 0.3);
      border-left: 1px solid rgba(0, 240, 255, 0.3);
      clip-path: polygon(100% 0, 0 100%, 100% 100%);
    }

    /* =========================================
       Type 5: Neon Scanline (ネオンスキャンライン)
    ========================================= */
    .cyber-box-5 {
      border: 1px solid var(--cyber-cyan);
      box-shadow: 
        0 0 10px rgba(0, 240, 255, 0.2), 
        inset 0 0 15px rgba(0, 240, 255, 0.1);
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 240, 255, 0.03),
        rgba(0, 240, 255, 0.03) 2px,
        transparent 2px,
        transparent 4px
      );
      position: relative;
    }
    /* 上下の点線ボーダー */
    .cyber-box-5::before, .cyber-box-5::after {
      content: '';
      position: absolute;
      left: 10%; width: 80%; height: 2px;
      background: linear-gradient(90deg, var(--cyber-cyan) 50%, transparent 50%);
      background-size: 10px 2px;
    }
    .cyber-box-5::before { top: -2px; }
    .cyber-box-5::after { bottom: -2px; }
  </style>
</head>
<body class="min-h-screen p-8 md:p-12 flex flex-col items-center">

  <div class="max-w-4xl w-full">
    <header class="mb-12 border-b border-[#00f0ff] pb-4 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold neon-text uppercase tracking-widest">System_Nodes</h1>
        <p class="text-[#00f0ff] text-sm opacity-70 mt-1 tracking-widest">Select target IP interface >></p>
      </div>
      <div class="hidden sm:flex gap-1">
        <div class="w-3 h-3 bg-[#00f0ff] animate-pulse"></div>
        <div class="w-3 h-3 bg-[#00f0ff] opacity-50"></div>
        <div class="w-3 h-3 border border-[#00f0ff]"></div>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">

      <!-- Type 1: Chamfered Box -->
      <div class="flex flex-col gap-2">
        <span class="text-xs text-[#00f0ff] opacity-80 uppercase tracking-widest">Type_01 // Chamfered</span>
        
        <div class="cyber-box-1-outer cursor-pointer">
          <div class="cyber-box-1-inner px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- アイコン風SVG -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="1.5">
                <path d="M4 10 L10 4 H20 V14 L14 20 H4 Z" />
                <circle cx="12" cy="12" r="2" fill="#00f0ff"/>
              </svg>
              <div>
                <div class="text-[10px] text-[#00f0ff] tracking-widest mb-1">NODE_IP_ADDR</div>
                <div class="text-2xl text-[#00f0ff] font-bold tracking-wider text-glow">123.123.123.123</div>
              </div>
            </div>
            <div class="text-[10px] text-[#00f0ff] opacity-50 text-right">
              STATUS<br><span class="text-white">ONLINE</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Type 2: HUD Brackets -->
      <div class="flex flex-col gap-2">
        <span class="text-xs text-[#00f0ff] opacity-80 uppercase tracking-widest">Type_02 // HUD Brackets</span>
        
        <div class="cyber-box-2 px-6 py-4 flex items-center justify-center cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="flex flex-col items-end">
              <span class="text-[10px] text-[#00f0ff] opacity-70 tracking-widest">TARGET_LOCK</span>
              <span class="text-xs text-white bg-[#00f0ff]/20 px-1 mt-1">IPv4</span>
            </div>
            <div class="h-10 w-[1px] bg-[#00f0ff] opacity-30"></div>
            <div class="text-3xl text-white font-light tracking-widest group-hover:text-glow transition-all">
              <span class="text-[#00f0ff]">123.</span>123.123.123
            </div>
          </div>
        </div>
      </div>

      <!-- Type 3: Velocity Skew -->
      <div class="flex flex-col gap-2">
        <span class="text-xs text-[#00f0ff] opacity-80 uppercase tracking-widest">Type_03 // Slanted / Skew</span>
        
        <div class="cyber-box-3 cursor-pointer group hover:bg-[#00f0ff]/10 transition-colors">
          <div class="cyber-box-3-content px-8 py-4 flex items-center justify-between">
            <div>
              <div class="flex gap-1 mb-1">
                <div class="w-2 h-1 bg-[#00f0ff]"></div>
                <div class="w-6 h-1 bg-[#00f0ff]"></div>
              </div>
              <div class="text-2xl text-[#00f0ff] font-bold tracking-widest group-hover:text-white transition-colors">
                123.123.123.123
              </div>
            </div>
            <div class="opacity-50 group-hover:opacity-100 transition-opacity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Type 4: Tech Data Panel -->
      <div class="flex flex-col gap-2">
        <span class="text-xs text-[#00f0ff] opacity-80 uppercase tracking-widest">Type_04 // Data Panel</span>
        
        <div class="cyber-box-4 px-6 py-5 cursor-pointer hover:shadow-[0_5px_15px_rgba(0,240,255,0.1)] transition-shadow">
          <div class="flex justify-between items-start mb-2">
            <span class="text-[10px] text-[#00f0ff] tracking-widest px-2 border border-[#00f0ff]/30">SECURE_LINK</span>
            <span class="text-[10px] text-white/50 tracking-widest">ms: 24</span>
          </div>
          <div class="text-3xl text-white font-bold tracking-widest drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
            123.123.123.123
          </div>
          <div class="absolute right-0 bottom-0 text-[8px] text-[#00f0ff] p-1 z-10">SYS.OK</div>
        </div>
      </div>

      <!-- Type 5: Neon Scanline -->
      <div class="flex flex-col gap-2 md:col-span-2 mt-4">
        <span class="text-xs text-[#00f0ff] opacity-80 uppercase tracking-widest text-center">Type_05 // Neon Scanline (Wide)</span>
        
        <div class="cyber-box-5 px-8 py-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-[#00f0ff]/5 transition-colors group">
          
          <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="w-12 h-12 border border-[#00f0ff] flex items-center justify-center relative">
              <div class="absolute inset-1 bg-[#00f0ff]/20 group-hover:bg-[#00f0ff]/40 transition-colors"></div>
              <span class="text-[#00f0ff] text-xs z-10">NET</span>
            </div>
            <div>
              <div class="text-[10px] text-[#00f0ff] tracking-widest">GLOBAL_IP_ROUTING</div>
              <div class="flex gap-1 mt-1">
                <div class="h-1 w-2 bg-[#00f0ff]"></div>
                <div class="h-1 w-2 bg-[#00f0ff]"></div>
                <div class="h-1 w-2 bg-[#00f0ff] opacity-30"></div>
              </div>
            </div>
          </div>

          <div class="text-4xl md:text-5xl text-[#00f0ff] font-bold tracking-widest text-glow">
            123.123.123.123
          </div>

          <div class="hidden md:flex flex-col items-end gap-1">
            <span class="text-[10px] text-white/60 tracking-widest">AUTH: GRANTED</span>
            <span class="text-[10px] text-white/60 tracking-widest">ENCRYPT: AES256</span>
          </div>

        </div>
      </div>

    </div>
  </div>

</body>
</html>