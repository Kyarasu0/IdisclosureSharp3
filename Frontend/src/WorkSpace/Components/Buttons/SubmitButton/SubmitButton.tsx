// SubmitButton.tsx
import type { ReactNode } from 'react';
import styles from './SubmitButton.module.css';

type SubmitButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  isLoading: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

export const SubmitButton = ({
  type = 'button',
  isLoading,
  disabled,
  onClick,
  children,
}: SubmitButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={styles.button}
    >
      {!isLoading && (
        <span className={styles.buttonContent}>
          {children}
        </span>
      )}

      {isLoading && (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader} />
        </div>
      )}
    </button>
  );
};
