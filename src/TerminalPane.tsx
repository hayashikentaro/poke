import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

type SessionOutput = {
  data: string;
};

type SessionExit = {
  code: number | null;
};

export function TerminalPane() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      theme: {
        background: "#090b10",
        foreground: "#e8edf5",
        cursor: "#ffffff",
        black: "#151922",
        red: "#f7768e",
        green: "#9ece6a",
        yellow: "#e0af68",
        blue: "#7aa2f7",
        magenta: "#bb9af7",
        cyan: "#7dcfff",
        white: "#c0caf5",
        brightBlack: "#414868",
        brightRed: "#ff7a93",
        brightGreen: "#b9f27c",
        brightYellow: "#ffcf86",
        brightBlue: "#8fb4ff",
        brightMagenta: "#cba6ff",
        brightCyan: "#9be8ff",
        brightWhite: "#ffffff"
      }
    });
    const fitAddon = new FitAddon();

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;
    terminal.loadAddon(fitAddon);
    terminal.open(container);

    const fitAndResize = () => {
      fitAddon.fit();
      void invoke("resize_session", {
        cols: terminal.cols,
        rows: terminal.rows
      });
    };

    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;
    const cleanupTasks: Array<() => void> = [];

    const startSession = async () => {
      const unlistenOutput = await listen<SessionOutput>("session_output", (event) => {
        terminal.write(event.payload.data);
      });
      cleanupTasks.push(unlistenOutput);

      const unlistenExit = await listen<SessionExit>("session_exit", (event) => {
        const suffix = event.payload.code === null ? "" : ` (${event.payload.code})`;
        terminal.write(`\r\n[session exited${suffix}]\r\n`);
      });
      cleanupTasks.push(unlistenExit);

      fitAddon.fit();
      await invoke("create_session", {
        cols: terminal.cols,
        rows: terminal.rows
      });

      if (disposed) {
        return;
      }

      const inputDisposable = terminal.onData((data) => {
        void invoke("write_to_session", { data });
      });
      cleanupTasks.push(() => inputDisposable.dispose());

      resizeObserver = new ResizeObserver(fitAndResize);
      resizeObserver.observe(container);
      cleanupTasks.push(() => resizeObserver?.disconnect());
      window.addEventListener("resize", fitAndResize);
      cleanupTasks.push(() => window.removeEventListener("resize", fitAndResize));
    };

    void startSession().catch((error: unknown) => {
      terminal.write(`Failed to start terminal session: ${String(error)}\r\n`);
    });

    return () => {
      disposed = true;
      cleanupTasks.forEach((cleanup) => cleanup());
      void invoke("close_session");
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="terminal-pane" />;
}
