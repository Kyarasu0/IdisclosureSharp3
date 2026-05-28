import { useEffect, useMemo, useRef, useState } from "react";

import { GlassWindow } from "../../../2-Molecules/Windows/GlassWindow/GlassWindow";

import styles from "./SOF.module.css";

import {
    Terminal,
    Loader2,
    Unlock,
    Lock
} from "lucide-react";

type Props = {
    result: "success" | "failed";
    title?: string;
};

const LOG_TEMPLATES = [
    "Injecting payload...",
    "Decrypting packets...",
    "Establishing secure tunnel...",
    "Bypassing firewall...",
    "Extracting session tokens...",
    "Escalating privileges...",
    "Masking connection route...",
];

const generateHex = () =>
    Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16)
            .toString(16)
            .toUpperCase()
    ).join("");

const generateIP = () =>
    `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

const generateLog = () => {

    const template =
        LOG_TEMPLATES[
            Math.floor(Math.random() * LOG_TEMPLATES.length)
        ];

    return `[${generateHex()}] ${template} (${generateIP()})`;
};

export const SOF = ({
    result,
    title = "SYSTEM ACCESS",
}: Props) => {

    const [phase, setPhase] = useState<"loading" | "result" | "closing">("loading");

    const [logs, setLogs] = useState<string[]>([]);

    const logRef = useRef<HTMLDivElement>(null);

    const duration = useMemo(() => {
        return 5000 + Math.random() * 2000;
    }, []);

    // =====================================
    // Log Generate
    // =====================================
    useEffect(() => {

        const start = Date.now();

        const interval = setInterval(() => {

            setLogs(prev => [
                ...prev,
                generateLog(),
                generateLog(),
            ].slice(-120));

            if (Date.now() - start >= duration) {

                clearInterval(interval);

                setPhase("result");
            }

        }, 40);

        return () => clearInterval(interval);

    }, [duration]);

    // =====================================
    // Scroll Follow
    // =====================================
    useEffect(() => {

        if (logRef.current) {

            logRef.current.scrollTop =
                logRef.current.scrollHeight;

        }

    }, [logs]);

    // =====================================
    // Result -> Closing
    // =====================================
    useEffect(() => {

        if (phase !== "result") return;

        const timer = setTimeout(() => {
            setPhase("closing");
        }, 1800);

        return () => clearTimeout(timer);

    }, [phase]);

    return (
        <div
            className={`
                ${styles.overlay}
                ${phase === "closing" ? styles.closing : ""}
            `}
        >
            {phase === "loading" && (
                <>
                    <div className={styles.header}>
                        <Loader2
                            size={18}
                            className={styles.spin}
                        />

                        <span>
                            EXECUTING OPERATION...
                        </span>
                    </div>

                    <div
                        ref={logRef}
                        className={styles.logArea}
                    >
                        {logs.map((log, index) => (
                            <div key={index}>
                                {log}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {phase !== "loading" && (
                <div className={styles.result}>

                    {result === "success" ? (
                        <>
                            <Unlock
                                size={90}
                                strokeWidth={1.2}
                                className={styles.success}
                            />

                            <h1 className={styles.success}>SUCCESS</h1>
                        </>
                    ) : (
                        <>
                            <Lock
                                size={90}
                                strokeWidth={1.2}
                                className={styles.failed}
                            />

                            <h1 className={styles.failed}>FAILED</h1>
                        </>
                    )}

                </div>
            )}
        </div>
    );
};