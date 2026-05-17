// ============================================================================
// CyberTerminal.tsx
// シンプルTerminal
// - Registry Command構造
// - async command対応
// - Radar分離
// ============================================================================

// 基本的な関数をインポート
import { useRef, useState, useEffect } from "react";

// ↓親から渡すからいらないかも
import { useNavigate } from "react-router-dom";
import { terminalCommands } from "./TerminalFunctions/terminalCommands";
import type { TerminalLog } from "./TerminalFunctions/terminalTypes";

// 他のコンポーネントをインポート
import { RadarPanel } from "../../2-Molecules/RadarPanel/RadarPanel";

// デザインに関するファイルをインポート
import { ShieldAlert, TriangleAlert } from "lucide-react";
import styles from "./Terminal.module.css";

// =======================================================
// Props
// =======================================================
type TerminalProps = {
    mainColor: string;
    userId?: string;
};

// =======================================================
// Main Component
// =======================================================
export const Terminal = ({
    mainColor,
    userId,
}: TerminalProps) => {

    const navigate = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);
    const logRef = useRef<HTMLDivElement>(null);

    // ===================================================
    // State
    // ===================================================
    const [input, setInput] = useState("");
    const [cwd, setCwd] = useState<string[]>([]);
    const [logs, setLogs] =
        useState<TerminalLog[]>([
            {
                id: crypto.randomUUID(),
                type: "system",
                content: "=== IDEN TERMINAL [v3.2.0] ===",
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

        logRef.current.scrollTop = logRef.current.scrollHeight;

    }, [logs]);

    // ===================================================
    // command execute
    // ===================================================
    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        // 入力値処理
        e.preventDefault();
        const value = input.trim();
        if (!value) return;

        // ログへの追加
        addLog("cmd", value);
        // 入力欄のリセット
        setInput("");

        // コマンド部分と引数の切り分け
        const args = value.split(" ");
        // コマンドの特定と実際の関数への変換
        const cmd = args[0];
        const command = terminalCommands[cmd];
        // commandが存在しなかった場合
        if (!command) {
            addLog(
                "error",
                `Command not found: ${cmd}`
            );
            return;
        }

        // command所持確認
        if (!availableCommands.includes(cmd)) {
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
        <div 
            className={styles.terminalContainer}
            style={{ "--main-color": mainColor } as React.CSSProperties }
        >

            {/* ===================================================== */}
            {/* LEFT */}
            {/* ===================================================== */}
            <div className={styles.terminalLeft}>
                {/* Logs */}
                <div ref={logRef} className={styles.logs}>
                    {/* Header */}
                    <div className={styles.terminalHeader}>
                        <span>
                        [SYS] --- CORE IdOS v4.0.2 ---
                        </span>
                        <span>
                            [SYS] ENCRYPTED LINK ESTABLISHED
                        </span>
                    </div>

                    {logs.map((log) => (
                        <div key={log.id} className={styles[log.type]}>
                            {log.type === "cmd" && (
                                <div>
                                    <span className={styles.prompt}>
                                        {`${userId}@IdisPC:`}
                                    </span>
                                    <span className={styles.directory}>
                                        ~
                                        {log.cwd}
                                        $
                                    </span>
                                </div>
                            )}

                            {log.type === "error" && (
                                <TriangleAlert size={12}/>
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

                    <div>
                        <span className={styles.prompt}>
                            {`${userId}@IdisPC:`}
                        </span>
                        <span className={styles.directory}>
                            ~/
                            {cwd.join("/")}
                            $
                        </span>
                    </div>

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
            <div className={styles.terminalRight}>

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