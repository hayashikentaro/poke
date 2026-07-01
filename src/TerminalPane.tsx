import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import {
  applyPokeUiTheme,
  pokeCharacterThemes,
  type CharacterId,
  type PokeCharacterTheme
} from "./characterThemes";
import { defaultAppConfig, type AppConfig } from "./appConfig";
import "@xterm/xterm/css/xterm.css";

type AttentionState = "not_now" | "needs_you";

type Character = {
  id: CharacterId;
  name: string;
  primary: string;
  images: {
    icon: string;
    idle: string;
    needsYou: string;
  };
  theme: PokeCharacterTheme["theme"];
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
  data: number[];
};

type SessionExit = {
  id: string;
  code: number | null;
};

type ExternalCharacterDefinition = {
  id: CharacterId;
  name: string | null;
  primary: string | null;
  terminalBackground: string | null;
  loadError: string | null;
  iconPath: string | null;
  idlePath: string | null;
  needsYouPath: string | null;
};

type ExternalCharacterDefinitions = {
  configDir: string;
  charactersDir: string;
  characters: ExternalCharacterDefinition[];
};

type DroppedFile = File & {
  path?: string;
};

type TerminalSurfaceProps = {
  active: boolean;
  character: Character;
  config: AppConfig;
  onExit: (sessionId: string) => void;
  onOutput: (sessionId: string) => void;
  onTerminalReady: (sessionId: string, terminal: Terminal | null) => void;
  session: TerminalSession;
};

const quietThresholdMs = 5000;
const skinBasePath = "/skins/default-poke-crew/characters";
const minTerminalFontSize = 10;
const maxTerminalFontSize = 32;

function spriteCharacter(id: CharacterId): Character {
  const basePath = `${skinBasePath}/${id}`;
  const characterTheme = pokeCharacterThemes[id] ?? pokeCharacterThemes.mugi;

  return {
    id,
    name: characterTheme.name,
    primary: characterTheme.primary,
    images: {
      icon: `${basePath}/icon_32x32.png`,
      idle: `${basePath}/idle_32x32_6f.png`,
      needsYou: `${basePath}/needs_you_32x32_8f.png`
    },
    theme: characterTheme.theme
  };
}

const defaultCharacters: Character[] = [
  spriteCharacter("mugi"),
  spriteCharacter("rune"),
  spriteCharacter("kiku"),
  spriteCharacter("sora"),
  spriteCharacter("nagi"),
  spriteCharacter("yuzu"),
  spriteCharacter("haru"),
  spriteCharacter("kiri")
];

function getCharacter(characterId: string, characters: Character[]) {
  return characters.find((character) => character.id === characterId) ?? characters[0];
}

function getRandomCharacterId(candidates: Character[]) {
  return candidates[Math.floor(Math.random() * candidates.length)].id;
}

function getNextCharacterId(sessions: TerminalSession[] = [], characters: Character[] = defaultCharacters) {
  const used = new Set(sessions.map((session) => session.characterId));
  const unusedCharacters = characters.filter((character) => !used.has(character.id));
  return getRandomCharacterId(unusedCharacters.length > 0 ? unusedCharacters : characters);
}

function createTerminal(config: AppConfig) {
  return new Terminal({
    cursorBlink: true,
    fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: config.terminal.fontSize,
    lineHeight: 1.2,
    theme: defaultCharacters[0].theme.xterm
  });
}

function withExternalCharacterDefinitions(
  characters: Character[],
  externalDefinitions: ExternalCharacterDefinitions
) {
  const definitionsById = new Map(externalDefinitions.characters.map((definition) => [definition.id, definition]));
  const cacheToken = encodeURIComponent(String(Date.now()));
  const nextCharacters = characters.map((character) =>
    mergeExternalCharacterDefinition(character, definitionsById.get(character.id), cacheToken)
  );
  const defaultIds = new Set(characters.map((character) => character.id));

  for (const definition of externalDefinitions.characters) {
    if (defaultIds.has(definition.id)) {
      continue;
    }

    const externalCharacter = createExternalCharacter(definition, cacheToken);
    if (externalCharacter) {
      nextCharacters.push(externalCharacter);
    }
  }

  return nextCharacters;
}

function mergeExternalCharacterDefinition(
  character: Character,
  definition: ExternalCharacterDefinition | undefined,
  cacheToken: string
) {
  if (!definition) {
    return character;
  }

  const primary = definition.primary ?? character.primary;
  const terminalBackground = definition.terminalBackground;

  return {
    ...character,
    name: definition.name ?? character.name,
    primary,
    images: mergeCharacterImages(character.images, definition, cacheToken),
    theme: applyCharacterThemeOverrides(character.theme, primary, terminalBackground)
  };
}

function createExternalCharacter(definition: ExternalCharacterDefinition, cacheToken: string): Character {
  const baseCharacter = definition.loadError ? spriteCharacter("void") : defaultCharacters[0];
  const primary = definition.primary ?? baseCharacter.primary;

  return {
    id: definition.id,
    name: definition.name ?? definition.id,
    primary,
    images: {
      icon: definition.iconPath
        ? `${convertFileSrc(definition.iconPath)}?v=${cacheToken}`
        : baseCharacter.images.icon,
      idle: definition.idlePath
        ? `${convertFileSrc(definition.idlePath)}?v=${cacheToken}`
        : baseCharacter.images.idle,
      needsYou: definition.needsYouPath
        ? `${convertFileSrc(definition.needsYouPath)}?v=${cacheToken}`
        : baseCharacter.images.needsYou
    },
    theme: applyCharacterThemeOverrides(
      baseCharacter.theme,
      primary,
      definition.terminalBackground ?? baseCharacter.theme.xterm.background
    )
  };
}

function mergeCharacterImages(
  images: Character["images"],
  definition: ExternalCharacterDefinition,
  cacheToken: string
) {
  return {
    icon: definition.iconPath ? `${convertFileSrc(definition.iconPath)}?v=${cacheToken}` : images.icon,
    idle: definition.idlePath ? `${convertFileSrc(definition.idlePath)}?v=${cacheToken}` : images.idle,
    needsYou: definition.needsYouPath
      ? `${convertFileSrc(definition.needsYouPath)}?v=${cacheToken}`
      : images.needsYou
  };
}

function applyCharacterThemeOverrides(
  theme: Character["theme"],
  primary: string,
  terminalBackground: string | null
) {
  const nextTerminalBackground = terminalBackground ?? theme.xterm.background;

  return {
    xterm: {
      ...theme.xterm,
      background: nextTerminalBackground,
      cursor: primary,
      cursorAccent: nextTerminalBackground
    },
    ui: {
      ...theme.ui,
      terminalBackground: nextTerminalBackground,
      tabBackground: nextTerminalBackground,
      activeTabBackground: nextTerminalBackground,
      activeTabBorder: primary,
      overlayBorder: primary,
      focusRing: primary
    }
  };
}

function getDroppedFilePath(file: File) {
  const path = (file as DroppedFile).path;

  return typeof path === "string" && path.length > 0 ? path : null;
}

function shellQuotePath(path: string) {
  return `'${path.split("'").join("'\\''")}'`;
}

function hasDraggedFiles(dataTransfer: DataTransfer) {
  return Array.from(dataTransfer.types).includes("Files");
}

async function stageDroppedFile(file: File) {
  const data = Array.from(new Uint8Array(await file.arrayBuffer()));

  return invoke<string>("stage_dropped_file", {
    fileName: file.name || "dropped-file",
    data
  });
}

function TerminalSurface({
  active,
  character,
  config,
  onExit,
  onOutput,
  onTerminalReady,
  session
}: TerminalSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const terminal = createTerminal(config);
    const fitAddon = new FitAddon();
    terminal.options.theme = character.theme.xterm;

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;
    onTerminalReady(session.id, terminal);
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
          terminal.write(Uint8Array.from(event.payload.data));
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
      onTerminalReady(session.id, null);
    };
  }, [character.theme.xterm, onExit, onOutput, onTerminalReady, session.id]);

  useEffect(() => {
    const terminal = terminalRef.current;
    const fitAddon = fitAddonRef.current;

    if (!terminal || !fitAddon) {
      return;
    }

    terminal.options.fontSize = config.terminal.fontSize;
    requestAnimationFrame(() => {
      fitAddon.fit();
      void invoke("resize_session", {
        id: session.id,
        cols: terminal.cols,
        rows: terminal.rows
      }).catch(() => undefined);
    });
  }, [config.terminal.fontSize, session.id]);

  useEffect(() => {
    const terminal = terminalRef.current;

    if (terminal) {
      terminal.options.theme = character.theme.xterm;
    }
  }, [character.theme.xterm]);

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
  const terminalRefs = useRef(new Map<string, Terminal>());
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);
  const [characters, setCharacters] = useState<Character[]>(defaultCharacters);
  const initialSession = useMemo<TerminalSession>(
    () => ({
      id: crypto.randomUUID(),
      title: "shell",
      attention: "not_now",
      characterId: getNextCharacterId(),
      lastOutputAt: null
    }),
    []
  );
  const [sessions, setSessions] = useState<TerminalSession[]>([initialSession]);
  const [activeSessionId, setActiveSessionId] = useState(initialSession.id);
  const [pickerSessionId, setPickerSessionId] = useState<string | null>(null);
  const [draggingSessionId, setDraggingSessionId] = useState<string | null>(null);
  const activeSession =
    sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
  const activeCharacter = getCharacter(activeSession.characterId, characters);
  const canCreateSession = sessions.length < characters.length;

  const handleTerminalReady = useCallback((sessionId: string, terminal: Terminal | null) => {
    if (terminal) {
      terminalRefs.current.set(sessionId, terminal);
    } else {
      terminalRefs.current.delete(sessionId);
    }
  }, []);

  useEffect(() => {
    void invoke<AppConfig>("get_app_config")
      .then(setConfig)
      .catch((error: unknown) => {
        console.error("Failed to load app config", error);
      });
  }, []);

  useEffect(() => {
    void invoke<ExternalCharacterDefinitions>("get_character_definitions")
      .then((definitions) => {
        setCharacters(withExternalCharacterDefinitions(defaultCharacters, definitions));
      })
      .catch((error: unknown) => {
        console.error("Failed to load character definitions", error);
      });
  }, []);

  const updateTerminalFontSize = useCallback((fontSize: number) => {
    const nextFontSize = Math.max(minTerminalFontSize, Math.min(maxTerminalFontSize, fontSize));

    setConfig((currentConfig) => ({
      ...currentConfig,
      terminal: {
        ...currentConfig.terminal,
        fontSize: nextFontSize
      }
    }));

    void invoke<AppConfig>("update_terminal_font_size", { fontSize: nextFontSize })
      .then(setConfig)
      .catch((error: unknown) => {
        console.error("Failed to save terminal font size", error);
      });
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === "+" || event.key === "=" || event.code === "Semicolon") {
        event.preventDefault();
        updateTerminalFontSize(config.terminal.fontSize + 1);
      }

      if (event.key === "-") {
        event.preventDefault();
        updateTerminalFontSize(config.terminal.fontSize - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config.terminal.fontSize, updateTerminalFontSize]);

  useEffect(() => {
    applyPokeUiTheme(activeCharacter.theme.ui);
  }, [activeCharacter.theme.ui]);

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
    setPickerSessionId(null);
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
    if (!canCreateSession) {
      return;
    }

    const index = nextTabIndex.current;
    nextTabIndex.current += 1;
    const session: TerminalSession = {
      id: crypto.randomUUID(),
      title: `shell ${index}`,
      attention: "not_now",
      characterId: getNextCharacterId(sessions, characters),
      lastOutputAt: null
    };

    setSessions([...sessions, session]);
    setPickerSessionId(null);
    setActiveSessionId(session.id);
  };

  const closeSession = (sessionId: string) => {
    setPickerSessionId(null);
    setSessions((currentSessions) => {
      const closingIndex = currentSessions.findIndex((session) => session.id === sessionId);
      const remainingSessions = currentSessions.filter((session) => session.id !== sessionId);

      if (remainingSessions.length === 0) {
        const session: TerminalSession = {
          id: crypto.randomUUID(),
          title: "shell",
          attention: "not_now",
          characterId: getNextCharacterId([], characters),
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

  const moveSession = useCallback((sessionId: string, targetSessionId: string) => {
    if (sessionId === targetSessionId) {
      return;
    }

    setSessions((currentSessions) => {
      const fromIndex = currentSessions.findIndex((session) => session.id === sessionId);
      const toIndex = currentSessions.findIndex((session) => session.id === targetSessionId);

      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
        return currentSessions;
      }

      const nextSessions = [...currentSessions];
      const [movedSession] = nextSessions.splice(fromIndex, 1);
      nextSessions.splice(toIndex, 0, movedSession);
      return nextSessions;
    });
  }, []);

  const pasteDroppedFiles = useCallback(
    async (files: File[]) => {
      const terminal = terminalRefs.current.get(activeSessionId);

      if (!terminal || files.length === 0) {
        return;
      }

      try {
        const paths = await Promise.all(
          files.map(async (file) => getDroppedFilePath(file) ?? stageDroppedFile(file))
        );
        const pasteText = `${paths.map(shellQuotePath).join(" ")} `;

        terminal.focus();
        terminal.paste(pasteText);
      } catch (error: unknown) {
        console.error("Failed to paste dropped file paths", error);
      }
    },
    [activeSessionId]
  );

  const handleWorkspaceDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleWorkspaceDrop = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      if (!hasDraggedFiles(event.dataTransfer)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      void pasteDroppedFiles(Array.from(event.dataTransfer.files));
    },
    [pasteDroppedFiles]
  );

  const pickerSession = sessions.find((session) => session.id === pickerSessionId) ?? null;

  return (
    <section
      className="terminal-workspace"
      aria-label="Terminal sessions"
      onDragOver={handleWorkspaceDragOver}
      onDrop={handleWorkspaceDrop}
    >
      <div className="tab-bar" role="tablist" aria-label="Terminal tabs">
        {sessions.map((session) => {
          const character = getCharacter(session.characterId, characters);
          const isActive = session.id === activeSessionId;
          const tabTheme = character.theme.ui;

          return (
            <div
              key={session.id}
              className="tab-item"
              data-active={isActive ? "true" : "false"}
              data-dragging={draggingSessionId === session.id ? "true" : "false"}
              onDragOver={(event) => {
                if (!draggingSessionId) {
                  return;
                }

                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                moveSession(draggingSessionId, session.id);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDraggingSessionId(null);
              }}
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
                aria-label={isActive ? `Change ${character.name}` : `Select ${character.name}`}
                onClick={() => {
                  if (isActive) {
                    setPickerSessionId(session.id);
                  } else {
                    activateSession(session.id);
                  }
                }}
              >
                <CharacterIcon character={character} state={session.attention} />
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className="tab-button"
                draggable
                onDragStart={(event) => {
                  const tabElement = event.currentTarget.closest(".tab-item");

                  setPickerSessionId(null);
                  setDraggingSessionId(session.id);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", session.id);

                  if (tabElement instanceof HTMLElement) {
                    event.dataTransfer.setDragImage(
                      tabElement,
                      tabElement.offsetWidth / 2,
                      tabElement.offsetHeight / 2
                    );
                  }
                }}
                onDragEnd={() => setDraggingSessionId(null)}
                onClick={() => activateSession(session.id)}
              >
                <span className="tab-name">{character.name}</span>
              </button>
              <button
                type="button"
                className="tab-close"
                aria-label={`Close ${character.name}`}
                onClick={() => closeSession(session.id)}
              >
                x
              </button>
            </div>
          );
        })}
        {canCreateSession ? (
          <button type="button" className="new-tab-button" aria-label="New tab" onClick={createSession}>
            +
          </button>
        ) : null}
      </div>

      <div className="terminal-pane">
        {pickerSession ? (
          <CharacterPicker
            session={pickerSession}
            sessions={sessions}
            characters={characters}
            onClose={() => setPickerSessionId(null)}
            onSelect={(characterId) => replaceCharacter(pickerSession.id, characterId)}
          />
        ) : null}
        {sessions.map((session) => (
          <TerminalSurface
            key={session.id}
            active={session.id === activeSessionId}
            character={getCharacter(session.characterId, characters)}
            config={config}
            onExit={handleSessionExit}
            onOutput={handleSessionOutput}
            onTerminalReady={handleTerminalReady}
            session={session}
          />
        ))}
      </div>
    </section>
  );
}

function CharacterIcon({ character, state }: { character: Character; state: AttentionState }) {
  const src = state === "needs_you" ? character.images.needsYou : character.images.idle;

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
  characters,
  onClose,
  onSelect,
  session,
  sessions
}: {
  characters: Character[];
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

      if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        const character = characters[Number(event.key) - 1];
        if (character && !usedByAnotherSession.has(character.id)) {
          onSelect(character.id);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [characters, highlightedIndex, onClose, onSelect, usedByAnotherSession]);

  return (
    <div className="picker-layer" aria-modal="true" role="dialog" aria-label="Change character" onMouseDown={onClose}>
      <div className="character-picker" onMouseDown={(event) => event.stopPropagation()}>
        <div className="picker-header">
          <div className="picker-title">CHANGE CHARACTER</div>
          <button type="button" className="picker-close" aria-label="Close character picker" onClick={onClose}>
            x
          </button>
        </div>
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
