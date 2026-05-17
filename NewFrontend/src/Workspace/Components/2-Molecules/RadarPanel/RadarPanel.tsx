import { useMemo } from "react";

import styles from "./RadarPanel.module.css";

type RadarTarget = {
    id: string;
    alive: boolean;
};

type RadarPanelProps = {
    targets: RadarTarget[];
    mainColor: string;
};

export const RadarPanel = ({
    targets,
    mainColor,
}: RadarPanelProps) => {

    // ===================================================
    // blip位置生成
    // useMemoで固定化
    // ===================================================
    const blips = useMemo(() => {

        return targets.map((target, index) => {

            const angle = (360 / targets.length) * index;

            const distance = 150 + Math.random() * 300;

            return {
                ...target,
                angle,
                distance,
            };
        });

    }, [targets]);

    const text = mainColor;
    const chars = text.split("");
    chars.pop();
    const mainColor_opMid = `${chars.join("")}_opMid)`;
    const mainColor_opWeak = `${chars.join("")}_opWeak)`;

    return (
        <div 
            className={styles.radar}
            style={{ 
                "--main-color": mainColor,
                "--main-color-opMid": mainColor_opMid,
                "--main-color-opWeak": mainColor_opWeak
            } as React.CSSProperties }
        >

            <div className={styles.grid} />

            <div className={styles.sweep} />

            {blips.map((blip) => (

                <div
                    key={blip.id}
                    className={styles.blip}
                    style={{
                        backgroundColor:
                            blip.alive
                                ? mainColor
                                : "var(--red)",

                        transform: `
                            rotate(${blip.angle}deg)
                            translateY(-${blip.distance}%)
                        `,
                    }}
                />

            ))}

        </div>
    );
};