// ============================================================================
// CyberTerminal.tsx
// シンプルTerminal
// - Registry Command構造
// - async command対応
// - Radar分離
// ============================================================================

import {
    useRef,
    useState,
    useEffect,
} from "react";

import {
    ShieldAlert,
    SquareTerminal,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import styles from "./Terminal.module.css";

import {
    terminalCommands,
} from "./TerminalFunctions/terminalCommands";

import { RadarPanel } from "../../2-Molecules/RadarPanel/RadarPanel";

import type {
    TerminalLog,
} from "./TerminalFunctions/terminalTypes";

// =======================================================
// Props
// =======================================================
type CyberTerminalProps = {
    mainColor: string;
};

// =======================================================
// Main Component
// =======================================================
export const Terminal = ({
    mainColor,
}: CyberTerminalProps) => {

    const navigate = useNavigate();

    const inputRef =
        useRef<HTMLInputElement>(null);

    const logRef =
        useRef<HTMLDivElement>(null);

    // ===================================================
    // State
    // ===================================================
    const [input, setInput] = useState("");

    const [cwd, setCwd] =
        useState<string[]>([]);

    const [logs, setLogs] =
        useState<TerminalLog[]>([
            {
                id: crypto.randomUUID(),
                type: "system",
                content: "NEXUS TERMINAL READY",
            },
        ]);

    // ===================================================
    // command list
    // photon置き換え予定
    // ===================================================
    const availableCommands = [
        "help",
        "clear",
        "ls",
        "cd",
        "scan",
        "sof",
    ];

    // ===================================================
    // log追加
    // ===================================================
    const addLog = (
        type: TerminalLog["type"],
        content: React.ReactNode
    ) => {

        setLogs((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type,
                content,
                cwd: `/${cwd.join("/")}`,
            },
        ]);
    };

    // ===================================================
    // auto scroll
    // ===================================================
    useEffect(() => {

        if (!logRef.current) return;

        logRef.current.scrollTop =
            logRef.current.scrollHeight;

    }, [logs]);

    // ===================================================
    // command execute
    // ===================================================
    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        const value = input.trim();

        if (!value) return;

        // command log
        addLog("cmd", value);

        // input clear
        setInput("");

        // split
        const args = value.split(" ");

        const cmd = args[0];

        const command =
            terminalCommands[cmd];

        // command存在しない
        if (!command) {

            addLog(
                "error",
                `Command not found: ${cmd}`
            );

            return;
        }

        // command所持確認
        if (
            !availableCommands.includes(cmd)
        ) {

            addLog(
                "error",
                "ACCESS DENIED"
            );

            return;
        }

        // command実行
        await command.execute(
            {
                cwd,
                navigate,
                availableCommands,
                addLog,
                clearLogs: () => setLogs([]),
                setCwd,
            },
            args.slice(1)
        );
    };

    return (
        <div className={styles.container}>

            {/* ===================================================== */}
            {/* LEFT */}
            {/* ===================================================== */}
            <div className={styles.left}>

                {/* Header */}
                <div className={styles.header}>
                    <SquareTerminal size={16} />
                    <span>
                        TERMINAL
                    </span>
                </div>

                {/* Logs */}
                <div
                    ref={logRef}
                    className={styles.logs}
                >

                    {logs.map((log) => (

                        <div
                            key={log.id}
                            className={
                                styles[log.type]
                            }
                        >

                            {log.type === "cmd" && (
                                <span
                                    className={
                                        styles.prompt
                                    }
                                >
                                    root@nx:
                                    {log.cwd}
                                    #
                                </span>
                            )}

                            {log.type === "error" && (
                                <ShieldAlert
                                    size={12}
                                />
                            )}

                            <span>
                                {log.content}
                            </span>

                        </div>

                    ))}

                </div>

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className={styles.inputRow}
                >

                    <span
                        className={styles.prompt}
                    >
                        root@nx:/
                        {cwd.join("/")}
                        #
                    </span>

                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) =>
                            setInput(
                                e.target.value
                            )
                        }
                        className={styles.input}
                        autoFocus
                    />

                </form>
            </div>

            {/* ===================================================== */}
            {/* RIGHT */}
            {/* ===================================================== */}
            <div className={styles.right}>

                <RadarPanel
                    mainColor={mainColor}
                    targets={[
                        {
                            id: "1",
                            alive: true,
                        },
                        {
                            id: "2",
                            alive: false,
                        },
                        {
                            id: "3",
                            alive: true,
                        },
                    ]}
                />

            </div>
        </div>
    );
};