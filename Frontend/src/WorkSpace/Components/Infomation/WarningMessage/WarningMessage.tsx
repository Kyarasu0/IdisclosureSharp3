// WarningMessage.tsx
import { Warning } from 'phosphor-react';
import styles from './WarningMessage.module.css';

type WarningMessageProps = {
  message: string;
};

export const WarningMessage = ({ message }: WarningMessageProps) => {
  return (
    <div className={styles.warningMessageBox}>
      <Warning
        size={16}
        weight="regular"
        className={styles.warningMessageIcon}
      />
      <p className={styles.warningMessageText}>
        WARNING:
        <br />
        {message}
      </p>
    </div>
  );
};
