import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import styles from "./Introduction.module.css";

export const Introduction = () => {
    return (
        <div className={styles.logoWrapper}>
            <Logo size="lg" type="vertical"/>
        </div>
    );
}