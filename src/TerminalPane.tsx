import { useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

type TerminalSession = {
  id: string;
  title: string;
};

type SessionOutput = {
  id: string;
  data: string;
};

type SessionExit = {
  id: string;
  code: number | null;
};

type TerminalSurfaceProps = {
  active: boolean;
  session: TerminalSession;
};

function createTerminal() {
  return new Terminal({
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
}

function TerminalSurface({ active, session }: TerminalSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const terminal = createTerminal();
    const fitAddon = new FitAddon();

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;
    terminal.loadAddon(fitAddon);
    terminal.open(container);

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    const cleanupTasks: Array<() => void> = [];

    const fitAndResize = () => {
      if (!container.offsetParent) {
        return;
      }

      fitAddon.fit();
      void invoke("resize_session", {
        id: session.id,
        cols: terminal.cols,
        rows: terminal.rows
      }).catch(() => undefined);
    };

    const startSession = async () => {
      const unlistenOutput = await listen<SessionOutput>("session_output", (event) => {
        if (event.payload.id === session.id) {
          terminal.write(event.payload.data);
        }
      });
      cleanupTasks.push(unlistenOutput);

      const unlistenExit = await listen<SessionExit>("session_exit", () => undefined);
      cleanupTasks.push(unlistenExit);

      fitAddon.fit();
      await invoke("create_session", {
        id: session.id,
        cols: terminal.cols,
        rows: terminal.rows
      });

      if (disposed) {
        return;
      }

      const inputDisposable = terminal.onData((data) => {
        void invoke("write_to_session", { id: session.id, data });
      });
      cleanupTasks.push(() => inputDisposable.dispose());

      resizeObserver = new ResizeObserver(fitAndResize);
      resizeObserver.observe(container);
      cleanupTasks.push(() => resizeObserver?.disconnect());
      window.addEventListener("resize", fitAndResize);
      cleanupTasks.push(() => window.removeEventListener("resize", fitAndResize));
      fitAndResize();
    };

    void startSession().catch((error: unknown) => {
      console.error("Failed to start terminal session", error);
    });

    return () => {
      disposed = true;
      cleanupTasks.forEach((cleanup) => cleanup());
      void invoke("close_session", { id: session.id }).catch(() => undefined);
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, [session.id]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const terminal = terminalRef.current;
    const fitAddon = fitAddonRef.current;

    if (!terminal || !fitAddon) {
      return;
    }

    requestAnimationFrame(() => {
      fitAddon.fit();
      terminal.focus();
      void invoke("resize_session", {
        id: session.id,
        cols: terminal.cols,
        rows: terminal.rows
      }).catch(() => undefined);
    });
  }, [active, session.id]);

  return (
    <div
      ref={containerRef}
      className="terminal-surface"
      data-active={active ? "true" : "false"}
    />
  );
}

export function TerminalPane() {
  const nextTabIndex = useRef(2);
  const initialSession = useMemo<TerminalSession>(
    () => ({
      id: crypto.randomUUID(),
      title: "shell"
    }),
    []
  );
  const [sessions, setSessions] = useState<TerminalSession[]>([initialSession]);
  const [activeSessionId, setActiveSessionId] = useState(initialSession.id);

  const createSession = () => {
    const index = nextTabIndex.current;
    nextTabIndex.current += 1;

    const session: TerminalSession = {
      id: crypto.randomUUID(),
      title: `shell ${index}`
    };

    setSessions((currentSessions) => [...currentSessions, session]);
    setActiveSessionId(session.id);
  };

  const closeSession = (sessionId: string) => {
    setSessions((currentSessions) => {
      const closingIndex = currentSessions.findIndex((session) => session.id === sessionId);
      const remainingSessions = currentSessions.filter((session) => session.id !== sessionId);

      if (remainingSessions.length === 0) {
        const session: TerminalSession = {
          id: crypto.randomUUID(),
          title: "shell"
        };
        nextTabIndex.current = 2;
        setActiveSessionId(session.id);
        return [session];
      }

      if (activeSessionId === sessionId) {
        const nextIndex = Math.min(closingIndex, remainingSessions.length - 1);
        setActiveSessionId(remainingSessions[nextIndex].id);
      }

      return remainingSessions;
    });
  };

  return (
    <section className="terminal-workspace" aria-label="Terminal sessions">
      <div className="tab-bar" role="tablist" aria-label="Terminal tabs">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="tab-item"
            data-active={session.id === activeSessionId ? "true" : "false"}
          >
            <button
              type="button"
              role="tab"
              aria-selected={session.id === activeSessionId}
              className="tab-button"
              onClick={() => setActiveSessionId(session.id)}
            >
              {session.title}
            </button>
            <button
              type="button"
              className="tab-close"
              aria-label={`Close ${session.title}`}
              onClick={() => closeSession(session.id)}
            >
              x
            </button>
          </div>
        ))}
        <button type="button" className="new-tab-button" aria-label="New tab" onClick={createSession}>
          +
        </button>
      </div>

      <div className="terminal-pane">
        {sessions.map((session) => (
          <TerminalSurface
            key={session.id}
            active={session.id === activeSessionId}
            session={session}
          />
        ))}
      </div>
    </section>
  );
}
