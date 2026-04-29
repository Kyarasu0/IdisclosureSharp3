// =================================================
// Components/1-Atoms/UI/PageTitle/PageTitle.tsx
// =================================================

// 基本的な関数をインポート
import type { LucideIcon } from "lucide-react";
// デザインに関連する情報をインポート
import styles from "./PageTitle.module.css";
// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";
// 他のコンポーネントをインポート
import { GlitchText } from '../GlitchText/GlitchText';

type PageTitleProps = {
    Icon?: LucideIcon;
    mainTitle: string;
    subTitle: string;
    className?: string;
}

export const PageTitle = ({
    Icon,
    mainTitle,
    subTitle,
    className,
}: PageTitleProps) => {
    const { font } = useAppearance();

    return (
        <div className={`${styles.header} ${className}`}>
            {Icon && <Icon size={80} strokeWidth={1} className={styles.icon}/>}
            <div className={styles.title}>
                <GlitchText content={mainTitle} className={styles.mainTitle}/>
                <p 
                    className={styles.subTitle}
                    style={{ fontFamily: font.secondary }}
                >
                    {subTitle}
                </p>
            </div>
        </div>
    );
}