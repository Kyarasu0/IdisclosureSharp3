import styles from './AppIcon.module.css';

type Props = {
  icon: React.ReactNode;
  label: string;
  color?: string; // ← 変更（自由色）
  onClick?: () => void;
};

export const AppIcon = ({ icon, label, color = "#22d3ee", onClick }: Props) => {
  return (
    <div
      className={styles.wrapper}
      style={
        {
          "--accent": color,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <div className={styles.icon}>{icon}</div>
      <span className={styles.label}>{label}</span>
    </div>
  );
};