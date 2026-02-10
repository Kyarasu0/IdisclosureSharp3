// ==========================================
// コンポーネント: 背景アニメーション (Canvas)
// ==========================================
/**
 * 背景に表示するサイバーなパーティクルネットワークを描画します。
 * ハッカーがネットワークに潜入しているような浮遊感を演出します。
 */
import { useRef, useEffect } from 'react';
import { COLORS } from '../Data/Colors';

export const CyberBackground = () => {
  // Canvas DOMを直接触るためのref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Canvasの初期化
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 描画エンジンの取得
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvasサイズの設定と変数への代入
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // パーティクルの設定
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 60; // パーティクルの数

    // パーティクルの生成
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, // ゆったりとした動き
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      // 画面のクリア
      ctx.clearRect(0, 0, width, height);
      
      // ========== グリッド線の描画設定（薄い背景のメッシュ）==========
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      const gridSize = 50;

      // 描画開始
      for (let x = 0; x < width; x += gridSize) {
        // グリッド線の描画開始
        ctx.beginPath();
        // 開始位置と終了位置の指定
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        // 実際に見えるようにする
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        // グリッド線の描画開始
        ctx.beginPath();
        // 開始位置と終了位置の指定
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        // 実際に見えるようにする
        ctx.stroke();
      }
      // ============================================================

      // ========== パーティクルの描画 ==========
      // 点の色設定
      ctx.fillStyle = COLORS.cyan;
      particles.forEach((p, i) => {
        // 位置の更新 (x = vx * t + x0)
        p.x += p.vx;
        p.y += p.vy;

        // 画面端で跳ね返る処理
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // 点の描画
        ctx.beginPath();
        // arc(x座標, y座標, 半径, 開始角度(0), 終了角度(2π))
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        // 塗りつぶし
        ctx.fill();

        // 近くの点同士を線で結ぶ
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = COLORS.cyan;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // 次のフレームでのanimationの呼び出し要求
      requestAnimationFrame(animate);
    };

    animate();

    // リサイズ対応
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};