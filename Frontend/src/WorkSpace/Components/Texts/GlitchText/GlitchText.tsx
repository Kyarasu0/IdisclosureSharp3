import styles from "./GlitchText.module.css";

type Props = {
  text: string;
  className?: string;
};

export const GlitchText = ({ text, className = "" }: Props) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <span className={styles.main}>{text}</span>
      <span className={`${styles.layer} ${styles.cyan}`}>{text}</span>
      <span className={`${styles.layer} ${styles.pink}`}>{text}</span>
    </div>
  );
};
