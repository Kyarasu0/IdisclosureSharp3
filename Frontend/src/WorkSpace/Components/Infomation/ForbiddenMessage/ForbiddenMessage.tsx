// ForbiddenMessage.tsx
import { Prohibit } from 'phosphor-react';
import styles from './ForbiddenMessage.module.css';

type ForbiddenMessageProps = {
  message: string;
};

export const ForbiddenMessage = ({ message }: ForbiddenMessageProps) => {
  return (
    <div className={styles.forbiddenMessageBox}>
      <Prohibit size={14} className={styles.forbiddenMessageIcon} />
      <p className={styles.forbiddenMessageText}>
        FORBIDDEN:
        <br />
        {message}
      </p>
    </div>
  );
};
