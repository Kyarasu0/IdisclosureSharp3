// ============================================================================
// terminalFileSystem.ts
// 仮想ファイルシステム
// ============================================================================

export type FileNode = {
    [key: string]: FileNode | string;
};

export const terminalFileSystem: FileNode = {
    mission: {
        "target.txt":
            "TARGET: PROJECT CHIMERA",
    },

    tools: {
        "scan.exe":
            "NETWORK SCANNER",
    },
};