import styles from './AppIcon.module.css';

type Props = {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
  isActive?: boolean; // ← 追加
};

export const AppIcon = ({
  icon,
  label,
  color = "#22d3ee",
  onClick,
  isActive = false,
}: Props) => {
  return (
    <div
      className={`${styles.wrapper} ${isActive ? styles.active : ""}`}
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