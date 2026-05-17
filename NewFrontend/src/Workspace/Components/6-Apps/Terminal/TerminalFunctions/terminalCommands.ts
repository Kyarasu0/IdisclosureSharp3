// ============================================================================
// terminalCommands.ts
// Command Registry
// ============================================================================

import { terminalFileSystem } from "./terminalFileSystem";
import { sleep } from "./terminalUtils";

import type {
    TerminalCommand,
} from "./terminalTypes";

// =======================================================
// Path Resolve
// =======================================================
const resolvePath = (path: string[]) => {

    let current: any = terminalFileSystem;

    for (const dir of path) {

        if (!current[dir]) {
            return null;
        }

        current = current[dir];
    }

    return current;
};

// =======================================================
// Commands
// =======================================================
export const terminalCommands:
Record<string, TerminalCommand> = {

    // ===================================================
    // help
    // ===================================================
    help: {

        description: "Show command list",

        async execute(context) {

            context.addLog(
                "info",
                context.availableCommands.join("  ")
            );
        },
    },

    // ===================================================
    // clear
    // ===================================================
    clear: {

        description: "Clear logs",

        async execute(context) {

            context.clearLogs();
        },
    },

    // ===================================================
    // ls
    // ===================================================
    ls: {

        description: "Show directory",

        async execute(context) {

            const dir = resolvePath(context.cwd);

            if (
                dir &&
                typeof dir === "object"
            ) {
                context.addLog(
                    "info",
                    Object.keys(dir).join("  ")
                );
            }
        },
    },

    // ===================================================
    // cd
    // ===================================================
    cd: {

        description: "Move directory",

        async execute(context, args) {

            const target = args[0];

            // rootへ戻る
            if (!target || target === "/") {
                context.setCwd([]);
                return;
            }

            // 一つ戻る
            if (target === "..") {

                context.setCwd((prev) =>
                    prev.slice(0, -1)
                );

                return;
            }

            // 指定ディレクトリ
            const nextPath = [
                ...context.cwd,
                target,
            ];

            const dir = resolvePath(nextPath);

            if (
                dir &&
                typeof dir === "object"
            ) {

                context.setCwd(nextPath);

                return;
            }

            context.addLog(
                "error",
                `Directory not found: ${target}`
            );
        },
    },

    // ===================================================
    // scan
    // ===================================================
    scan: {

        description: "Network scan",

        async execute(context) {

            context.addLog(
                "system",
                "Initializing scan..."
            );

            await sleep(1000);

            context.addLog(
                "system",
                "Searching targets..."
            );

            await sleep(1200);

            context.addLog(
                "success",
                "TARGET FOUND: 192.168.0.14"
            );
        },
    },

    // ===================================================
    // sof
    // ===================================================
    sof: {

        description: "SOF transition",

        async execute(context, args) {

            const result = args[0];

            if (
                result !== "success" &&
                result !== "failed"
            ) {

                context.addLog(
                    "error",
                    "usage: sof [success | failed]"
                );

                return;
            }

            context.navigate("/sof", {
                state: {
                    result,
                },
            });
        },
    },
};