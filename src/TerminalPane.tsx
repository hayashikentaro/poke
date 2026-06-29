import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import {
  applyPokeUiTheme,
  getCharacterTheme,
  type CharacterId
} from "./characterThemes";
import { appConfig } from "./appConfig";
import "@xterm/xterm/css/xterm.css";

type AttentionState = "not_now" | "needs_you";

type Character = {
  id: CharacterId;
  name: string;
  iconSrc: string;
  idleSrc: string;
  needsYouSrc: string;
};

type TerminalSession = {
  id: string;
  title: string;
  attention: AttentionState;
  characterId: CharacterId;
  lastOutputAt: number | null;
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
  onExit: (sessionId: string) => void;
  onOutput: (sessionId: string) => void;
  session: TerminalSession;
};

const quietThresholdMs = 5000;
const skinBasePath = "/skins/default-poke-crew/characters";

function spriteCharacter(id: CharacterId, name: string): Character {
  const basePath = `${skinBasePath}/${id}`;

  return {
    id,
    name,
    iconSrc: `${basePath}/icon_32x32.png`,
    idleSrc: `${basePath}/idle_32x32_6f.png`,
    needsYouSrc: `${basePath}/needs_you_32x32_8f.png`
  };
}

const characters: Character[] = [
  spriteCharacter("mugi", "Mugi"),
  spriteCharacter("rune", "Rune"),
  spriteCharacter("kiku", "Kiku"),
  spriteCharacter("sora", "Sora"),
  spriteCharacter("nagi", "Nagi"),
  spriteCharacter("yuzu", "Yuzu"),
  spriteCharacter("haru", "Haru"),
  spriteCharacter("kiri", "Kiri")
];

function getCharacter(characterId: string) {
  return characters.find((character) => character.id === characterId) ?? characters[0];
}

function getNextCharacterId(sessions: TerminalSession[]) {
  const used = new Set(sessions.map((session) => session.characterId));
  return characters.find((character) => !used.has(character.id))?.id ?? characters[sessions.length % characters.length].id;
}

function createTerminal() {
  return new Terminal({
    cursorBlink: true,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: appConfig.terminal.fontSize,
    lineHeight: 1.2,
    theme: getCharacterTheme(characters[0].id).theme.xterm
  });
}

function TerminalSurface({ active, onExit, onOutput, session }: TerminalSurfaceProps) {
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
    terminal.options.theme = getCharacterTheme(session.characterId).theme.xterm;

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
          onOutput(session.id);
        }
      });
      cleanupTasks.push(unlistenOutput);

      const unlistenExit = await listen<SessionExit>("session_exit", (event) => {
        if (event.payload.id === session.id) {
          onExit(session.id);
        }
      });
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
        void invoke("write_to_session", { id: session.id, data }).catch(() => undefined);
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
  }, [onExit, onOutput, session.id]);

  useEffect(() => {
    const terminal = terminalRef.current;

    if (terminal) {
      terminal.options.theme = getCharacterTheme(session.characterId).theme.xterm;
    }
  }, [session.characterId]);

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
      title: "shell",
      attention: "not_now",
      characterId: characters[0].id,
      lastOutputAt: null
    }),
    []
  );
  const [sessions, setSessions] = useState<TerminalSession[]>([initialSession]);
  const [activeSessionId, setActiveSessionId] = useState(initialSession.id);
  const [pickerSessionId, setPickerSessionId] = useState<string | null>(null);
  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0];

  useEffect(() => {
    applyPokeUiTheme(getCharacterTheme(activeSession.characterId).theme.ui);
  }, [activeSession.characterId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();

      setSessions((currentSessions) => {
        let changed = false;
        const nextSessions: TerminalSession[] = currentSessions.map((session) => {
          if (
            session.id === activeSessionId ||
            session.lastOutputAt === null ||
            now - session.lastOutputAt < quietThresholdMs ||
            session.attention === "needs_you"
          ) {
            return session;
          }

          changed = true;
          return {
            ...session,
            attention: "needs_you"
          };
        });

        return changed ? nextSessions : currentSessions;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeSessionId]);

  const activateSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              attention: "not_now"
            }
          : session
      )
    );
  }, []);

  const handleSessionOutput = useCallback((sessionId: string) => {
    const now = Date.now();

    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              attention: "not_now",
              lastOutputAt: now
            }
          : session
      )
    );
  }, []);

  const handleSessionExit = useCallback((sessionId: string) => {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              attention: "needs_you"
            }
          : session
      )
    );
  }, []);

  const createSession = () => {
    const index = nextTabIndex.current;
    nextTabIndex.current += 1;

    const session: TerminalSession = {
      id: crypto.randomUUID(),
      title: `shell ${index}`,
      attention: "not_now",
      characterId: getNextCharacterId(sessions),
      lastOutputAt: null
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
          title: "shell",
          attention: "not_now",
          characterId: characters[0].id,
          lastOutputAt: null
        };
        nextTabIndex.current = 2;
        setActiveSessionId(session.id);
        return [session];
      }

      if (activeSessionId === sessionId) {
        const nextIndex = Math.min(closingIndex, remainingSessions.length - 1);
        setActiveSessionId(remainingSessions[nextIndex].id);
      }

      if (pickerSessionId === sessionId) {
        setPickerSessionId(null);
      }

      return remainingSessions;
    });
  };

  const replaceCharacter = useCallback((sessionId: string, characterId: CharacterId) => {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              characterId
            }
          : session
      )
    );
    setPickerSessionId(null);
  }, []);

  const pickerSession = sessions.find((session) => session.id === pickerSessionId) ?? null;

  return (
    <section className="terminal-workspace" aria-label="Terminal sessions">
      <div className="tab-bar" role="tablist" aria-label="Terminal tabs">
        {sessions.map((session) => {
          const character = getCharacter(session.characterId);
          const tabTheme = getCharacterTheme(session.characterId).theme.ui;

          return (
            <div
              key={session.id}
              className="tab-item"
              data-active={session.id === activeSessionId ? "true" : "false"}
              style={
                {
                  "--tab-bg": tabTheme.tabBackground,
                  "--tab-active-bg": tabTheme.activeTabBackground,
                  "--tab-active-border": tabTheme.activeTabBorder,
                  "--tab-hover-bg": tabTheme.tabHoverBackground,
                  "--tab-text": tabTheme.tabText,
                  "--tab-muted-text": tabTheme.mutedText
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                className="tab-character-button"
                aria-label={`Change ${character.name}`}
                onClick={() => setPickerSessionId(session.id)}
              >
                <CharacterIcon character={character} state={session.attention} />
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={session.id === activeSessionId}
                className="tab-button"
                onClick={() => activateSession(session.id)}
              >
                <span className="tab-name">{session.title}</span>
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
          );
        })}
        <button type="button" className="new-tab-button" aria-label="New tab" onClick={createSession}>
          +
        </button>
      </div>

      <div className="terminal-pane">
        {pickerSession ? (
          <CharacterPicker
            session={pickerSession}
            sessions={sessions}
            onClose={() => setPickerSessionId(null)}
            onSelect={(characterId) => replaceCharacter(pickerSession.id, characterId)}
          />
        ) : null}
        {sessions.map((session) => (
          <TerminalSurface
            key={session.id}
            active={session.id === activeSessionId}
            onExit={handleSessionExit}
            onOutput={handleSessionOutput}
            session={session}
          />
        ))}
      </div>
    </section>
  );
}

function CharacterIcon({ character, state }: { character: Character; state: AttentionState }) {
  const src = state === "needs_you" ? character.needsYouSrc : character.idleSrc;

  return (
    <span
      className={`character-icon sprite-icon sprite-${state}`}
      style={
        {
          "--sprite-url": `url(${src})`
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
}

function CharacterPicker({
  onClose,
  onSelect,
  session,
  sessions
}: {
  onClose: () => void;
  onSelect: (characterId: CharacterId) => void;
  session: TerminalSession;
  sessions: TerminalSession[];
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(
    Math.max(0, characters.findIndex((character) => character.id === session.characterId))
  );

  const usedByAnotherSession = useMemo(
    () =>
      new Set(
        sessions
          .filter((candidateSession) => candidateSession.id !== session.id)
          .map((candidateSession) => candidateSession.characterId)
      ),
    [session.id, sessions]
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((index) => (index + 1) % characters.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((index) => (index - 1 + characters.length) % characters.length);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const character = characters[highlightedIndex];
        if (!usedByAnotherSession.has(character.id)) {
          onSelect(character.id);
        }
      }

      if (/^[1-8]$/.test(event.key)) {
        event.preventDefault();
        const character = characters[Number(event.key) - 1];
        if (!usedByAnotherSession.has(character.id)) {
          onSelect(character.id);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [highlightedIndex, onClose, onSelect, usedByAnotherSession]);

  return (
    <div className="picker-layer" aria-modal="true" role="dialog" aria-label="Change character">
      <div className="character-picker">
        <div className="picker-title">CHANGE CHARACTER</div>
        <div className="picker-list">
          {characters.map((character, index) => {
            const current = character.id === session.characterId;
            const disabled = usedByAnotherSession.has(character.id);
            const highlighted = index === highlightedIndex;

            return (
              <button
                className={`picker-row ${highlighted ? "picker-highlighted" : ""} ${
                  disabled ? "picker-disabled" : ""
                }`}
                key={character.id}
                type="button"
                disabled={disabled}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => onSelect(character.id)}
              >
                <span className="picker-cursor">{current ? ">" : highlighted ? "." : " "}</span>
                <span className="picker-number">{index + 1}</span>
                <CharacterIcon character={character} state={session.attention} />
                <span className="picker-name">{character.name}</span>
                <span className="picker-unavailable">{disabled ? "USED" : ""}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
