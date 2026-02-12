// ==========================================
// Component: TimeDial
// ==========================================
import './TimeDial.module.css';

export const TimeDial = ({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) => {
  const radius = 55;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - ((value - 5) / 10) * circumference;

  return (
    <div className="dial-section">
      <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
        <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
          <circle stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
          <circle stroke="var(--c-cyan)" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset: offset, transition: '0.3s' }} strokeLinecap="round" fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--c-cyan)' }}>{value}</div>
          <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>MINS</div>
        </div>
      </div>
      <div style={{ marginTop: '12px', fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1px' }}>MISSION DURATION</div>
      {!disabled && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <button onClick={() => value > 5 && onChange(value - 1)} style={{ background: 'none', border: '1px solid var(--c-cyan)', color: 'var(--c-cyan)', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>-</button>
          <button onClick={() => value < 15 && onChange(value + 1)} style={{ background: 'none', border: '1px solid var(--c-cyan)', color: 'var(--c-cyan)', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>+</button>
        </div>
      )}
    </div>
  );
};