// ==========================================
// TapEffect.tsx
// ==========================================
import { useEffect, useState } from 'react';

export const TapRipple = () => {
  // ripples = [{ x, y, id }, { x, y, id }, ...] 
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    // 関数設定
    const handleClick = (e: MouseEvent) => {
      // idに日にちを設定
      const id = Date.now();
      // 現在の配列の最後尾に追加
      setRipples((prev) => [...prev, { x: e.clientX, y: e.clientY, id }]);
      // setTimeout( ()=>{}, s )でs秒後に()=>{}を実行する
      // 以下は1秒後にrippleを消す役割
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };
    // マウント時に実行
    window.addEventListener('click', handleClick);
    // アンマウント時に実行
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full border border-cyan-400 animate-ping opacity-75"
          style={{
            left: r.x,
            top: r.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};