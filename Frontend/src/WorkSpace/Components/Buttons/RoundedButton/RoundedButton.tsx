import type { ReactNode } from 'react';
import styles from './RoundedButton.module.css';

type StartButtonProps = {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode; // optional
};

export const RoundedButton = ({ onClick, children, icon }: StartButtonProps) => {
  return (
    <div className={styles.startButtonWrapper}>
      <button className={styles.startButton} onClick={onClick}>
        <div className={styles.startButtonBg}></div>
        <div className={styles.startButtonOverlay}></div>
        <span className={`${icon ? styles.contentWithIcon : styles.contentNoIcon} relative z-10`}>
          {children}
          {icon && icon}
        </span>
      </button>
    </div>
  );
};
