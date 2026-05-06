
// 他のコンポーネントをインポート
import { Logo } from "./../../3-Organisms/UI/Logo/Logo";
import { GlassWindow } from "../../2-Molecules/Windows/GlassWindow/GlassWindow";
import { ApplicationIcon } from "../../1-Atoms/Control/ApplicationIcon/ApplicationIcon";

// デザインに関するファイルをインポート
import styles from "./PCDesktop.module.css";
import { Terminal } from "lucide-react";

export const PCDesktop = () => {
    return(
        <div className={styles.pcDesktopContainer}>
            {/*==========  LEFT ========== */}
            <div className={styles.left}>
                <Logo />
                <ApplicationIcon
                    icon={<Terminal size={20} />}
                    label="Terminal"
                    hover={false}
                    variant="cut"
                    color="#00f0ff"
                />
                <ApplicationIcon
                    icon={<Terminal size={20} />}
                    label="Terminal"
                    variant="diamond"
                    color="#00f0ff"
                />
                <ApplicationIcon
                    icon={<Terminal size={20} />}
                    label="Terminal"
                    variant="hex"
                    color="#00f0ff"
                />
                <ApplicationIcon
                    icon={<Terminal size={20} />}
                    label="Terminal"
                    variant="square"
                    color="#00f0ff"
                />
            </div>
            {/*==========  CENTER ========== */}
            <div className={styles.center}>
                <GlassWindow
                    icon={Terminal}
                    title="SYSTEM LOG"
                    subTitle="ACTIVE SESSION"
                >
                    <Logo />
                    <Logo />
                    <Logo />
                    <Logo />
                    <Logo />
                    <Logo />
                    <Logo />
                    <Logo />
                    <Logo />
                    <Logo />
                </ GlassWindow>
            </div>
            {/*========== RIGHT ========== */}
            <div className={styles.right}>
                <Logo />
            </div>
        </div>
    );
}