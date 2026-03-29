import { useRef, useState } from "react";
import type { FormEvent } from "react";
import styles from "./TerminalWidget.module.css";

const FILE_SYSTEM: any = {
  mission: {
    "target_info.txt": "TARGET: Project Chimera\nRISK LEVEL: HIGH\nSTATUS: Active",
    decrypt_keys: {
      "key_alpha.bin": "[ENCRYPTED DATA]",
      "key_beta.bin": "[ENCRYPTED DATA]",
    },
  },
  tools: {
    "bruteforce.exe": "[Executable Binary]",
    "network_scanner.sh": "Scanning local area network...",
  },
};

const TerminalWidget = () => {
  const [logs, setLogs] = useState<string[]>([
    "Initialising neural link...",
    "Establishing secure connection...",
    "Connection established.",
    "Type 'help'",
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>(["mission"]);

  const logRef = useRef<HTMLDivElement>(null);

  const resolvePath = (path: string[]) => {
    let current: any = FILE_SYSTEM;
    for (const p of path) {
      if (current && typeof current === "object" && p in current) {
        current = current[p];
      } else return null;
    }
    return current;
  };

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const args = input.split(" ");
    const cmd = args[0];

    const newLogs = [...logs, `root@sys:/${cwd.join("/")}# ${input}`];

    switch (cmd) {
      case "ls":
        const dir = resolvePath(cwd);
        if (typeof dir === "object") {
          newLogs.push(
            ...Object.keys(dir).map((k) =>
              typeof dir[k] === "object" ? `<DIR> ${k}` : `      ${k}`
            )
          );
        }
        break;

      case "cd":
        if (args[1] === "..") setCwd((prev) => prev.slice(0, -1));
        else setCwd((prev) => [...prev, args[1]]);
        break;

      case "cat":
        const file = resolvePath([...cwd, args[1]]);
        if (typeof file === "string") newLogs.push(file);
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      default:
        newLogs.push("command not found");
    }

    setLogs(newLogs);
    setInput("");

    requestAnimationFrame(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <span>ROOT CONSOLE</span>
        <span className={styles.status}>ONLINE</span>
      </div>

      {/* LOG */}
      <div ref={logRef} className={styles.log}>
        {logs.map((log, i) => (
          <div key={i} className={styles.line}>
            {log}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <form onSubmit={handleCommand} className={styles.inputRow}>
        <span className={styles.prompt}>root@sys:/</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
        />
      </form>
    </div>
  );
};

export default TerminalWidget;