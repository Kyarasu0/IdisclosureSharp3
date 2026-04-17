// =================================================================
// Components/3-Organisms/UI/Logo/Logo.tsx
// =================================================================

// デザインに関連するファイルをインポート
import symbolMark from "./../../../../Theme/Images/IdisclosureS3.png";
import styles from "./Logo.module.css";
// 設定ファイルをインポート
import { useAppearance } from "../../../../../Core/Contexts/AppearanceContext";

type LogoProps = {
    type?: "horizontal" | "vertical"
    size?: "sm" | "md" | "lg";
}

export const Logo = ({ type = "horizontal", size = "md" }: LogoProps ) => {
    // ロゴタイプとタグラインの設定
    const logoType: string[] = ["Id", "isclosure", "#3"];
    const tagLine: string = "EXPOSE OR BE EXPOSED";
    let scale = 1.5;
    switch(size){
        case "sm": scale *= 2/3; break;
        case "lg": scale *= 2; break;
    }
    const { palette, font } = useAppearance();
    return (
        <div 
            className={`${type === "horizontal" ? styles.horizontal : styles.vertical} ${styles[size]}`}
            style={{
                "--cyan": palette.cyan,
                "--cyan-shadow": palette.cyanShadow,
            } as React.CSSProperties}
        >
            {/* シンボルマーク */}
            <div className={styles.symbolMarkWrapper}>
                <img
                    src={symbolMark}
                    alt="Idisclosure#3_SymbolMark"
                    className={styles.icon}
                    style={{width: `${scale * 2}rem`, height: `${scale * 2}rem`}}
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                    }}
                />
            </div>

            {/* タイトル */}
            <div className={styles.title}>
                {/* ロゴタイプ */}
                <div className={styles.logoType}>
                    <span style={{
                        color: palette.pink,
                        fontSize: `${scale}rem`,
                        letterSpacing: `${scale * 1/5}rem`,
                        textShadow: `0 0 20px ${palette.pink}`
                    }}>{logoType[0]}</span>

                    <span style={{
                        color: palette.cyan,
                        fontSize: `${scale}rem`,
                        letterSpacing: `${scale * 1/5}rem`,
                        textShadow: `0 0 20px ${palette.cyan}`
                    }}>{logoType[1]}</span>

                    <span style={{
                        color: palette.green,
                        fontSize: `${scale * 2/3}rem`,
                        letterSpacing: `${scale * 1/5}rem`,
                        textShadow: `0 0 20px ${palette.green}`
                    }}>{logoType[2]}</span>
                </div>
                
                {/* タグライン */}
                <div className={styles.tagLine} style={{fontSize: `${scale / 2}rem`}}>{tagLine}</div>
            </div>
        </div>
    );
}
