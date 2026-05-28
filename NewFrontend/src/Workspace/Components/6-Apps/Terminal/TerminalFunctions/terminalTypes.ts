// ============================================================================
// terminalTypes.ts
// Terminal用型定義
// ============================================================================

import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";

// =======================================================
// Log Type
// =======================================================
export type LogType =
    | "cmd"
    | "info"
    | "error"
    | "success"
    | "system";

// =======================================================
// Terminal Log
// =======================================================
export type TerminalLog = {
    id: string;
    type: LogType;
    content: ReactNode;
    cwd?: string;
};

// =======================================================
// Terminal Context
// command側へ渡す情報
// =======================================================
export type TerminalContext = {
    cwd: string[];

    navigate: NavigateFunction;

    availableCommands: string[];

    addLog: (
        type: LogType,
        content: ReactNode
    ) => void;

    clearLogs: () => void;

    setCwd: React.Dispatch<
        React.SetStateAction<string[]>
    >;

    showSOF: (
        result: "success" | "failed",
        title?: string
    ) => void;
};

// =======================================================
// Command Type
// =======================================================
export type TerminalCommand = {
    description: string;

    execute: (
        context: TerminalContext,
        args: string[]
    ) => Promise<void>;
};