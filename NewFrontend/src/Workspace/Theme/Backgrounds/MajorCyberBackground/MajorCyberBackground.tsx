// =================================================================
// Theme/Backgrounds/MajorCyberBackground/MajorCyberBackground.tsx
// =================================================================

// 基本的な関数のインポート
import { useRef, useEffect } from 'react';
// デザインに関連する情報をインポート
import styles from './MajorCyberBackground.module.css';
import { PALETTE } from '../../Appearance/ColorPalettes/MajorCyberPalette';

// パーティクルの型定義
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export const MajorCyberBackground = () => {
  // canvasを直接操作するための参照(毎フレーム描画などの処理はDOMを直接触ったほうが動作が軽い)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ================================
    // 初期設定
    // ================================
    // canvas(紙)を取得
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // canvasの描画用エンジン(ペン)を取得
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 画面サイズを取得してcanvasに反映
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // ================================
    // パーティクル生成
    // ================================
    // Array.from({ length: n }, () => {});
    // Array.from(<配列の長さ>, <1要素ごとに実行する関数>);
    // パーティクル数
    const particleCount = 60;
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }
    });

    // ================================
    // 描画ループ
    // ================================
    const animate = () => {
      // 画面をクリア
      ctx.clearRect(0, 0, width, height);

      // ----------------------------
      // グリッド描画
      // ----------------------------
      // 色の設定
      ctx.strokeStyle = PALETTE.gray;
      // 細さの設定
      ctx.lineWidth = 1;
      // 間隔の設定
      const gridSize = 50;

      // 縦線
      for (let x = 0; x < width; x += gridSize) {
        // 書きはじめの宣言(strokeが現在あるすべてのpathを全部書くので1本ずつリセット)
        ctx.beginPath();
        // 開始点を指定
        ctx.moveTo(x, 0);
        // 終了点の指定
        ctx.lineTo(x, height);
        // 実際に線を描画
        ctx.stroke();
      }

      // 横線
      for (let y = 0; y < height; y += gridSize) {
        // 書きはじめの宣言(strokeが現在あるすべてのpathを全部書くので1本ずつリセット)
        ctx.beginPath();
        // 開始点を指定
        ctx.moveTo(0, y);
        // 終了点の指定
        ctx.lineTo(width, y);
        // 実際に線を描画
        ctx.stroke();
      }

      // ----------------------------
      // パーティクル更新・描画
      // ----------------------------
      // 塗りつぶしの色の設定
      ctx.fillStyle = PALETTE.cyan;
      // 線の色の設定
      ctx.strokeStyle = PALETTE.cyan;
      // 細さの設定
      ctx.lineWidth = 0.5;

      particles.forEach((p, i) => {
        // 位置更新(速さの考慮)
        p.x += p.vx;
        p.y += p.vy;

        // 壁反射
        if (p.x < 0 || width < p.x) p.vx *= -1;
        if (p.y < 0 || height < p.y) p.vy *= -1;

        // 点描画
        ctx.beginPath();
        // ctx.arc(中心x, 中心y, 半径, 開始角度, 終了角度);
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // 線描画
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // 次のフレームでもこの関数を呼び出すという予約
      requestAnimationFrame(animate);
    };

    animate();

    // ================================
    // リサイズ対応（常に全画面）
    // ================================
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // 画面のサイズが変わったらwidth/heightを設定し直し
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};