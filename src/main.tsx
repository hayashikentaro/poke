import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type AttentionState = "not_now" | "needs_you";

type Character = {
  id: string;
  name: string;
  iconSrc: string;
  idleSrc: string;
  needsYouSrc: string;
  idleFrames: number;
  needsYouFrames: number;
};

type TabSession = {
  id: string;
  characterId: string;
  state: AttentionState;
  mockKind: "dev" | "logs" | "build" | "shell";
};

const skinBasePath = "/skins/default-poke-crew/characters";

function spriteCharacter(id: string, name: string): Character {
  const basePath = `${skinBasePath}/${id}`;

  return {
    id,
    name,
    iconSrc: `${basePath}/icon_16x16.png`,
    idleSrc: `${basePath}/idle_16x16_6f.png`,
    needsYouSrc: `${basePath}/needs_you_16x16_8f.png`,
    idleFrames: 6,
    needsYouFrames: 8,
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
  spriteCharacter("kiri", "Kiri"),
];

const initialTabs: TabSession[] = [
  { id: "tab-1", characterId: "mugi", state: "not_now", mockKind: "dev" },
  { id: "tab-2", characterId: "rune", state: "needs_you", mockKind: "logs" },
  { id: "tab-3", characterId: "kiku", state: "not_now", mockKind: "build" },
  { id: "tab-4", characterId: "sora", state: "not_now", mockKind: "shell" },
];

const mockTerminalText: Record<TabSession["mockKind"], string[]> = {
  dev: [
    "$ pnpm dev",
    "",
    "> poke@0.0.0 dev /workspace/poke",
    "> vite --host 127.0.0.1",
    "",
    "  VITE v6.0.0  ready in 284 ms",
    "",
    "  Local:   http://127.0.0.1:5173/",
    "  press h + enter to show help",
    "",
    "[08:42:11] src/App.tsx updated",
    "[08:42:11] page reload complete",
  ],
  logs: [
    "$ docker compose logs -f api",
    "api-1  | booting development server",
    "api-1  | connecting to postgres://local/poke",
    "api-1  | GET /health 200 3.1ms",
    "api-1  | GET /sessions 200 8.7ms",
    "api-1  | watcher: config changed",
    "api-1  | background job queue idle",
  ],
  build: [
    "$ pnpm build",
    "",
    "src/main.tsx                  41.7 kB",
    "src/styles.css                 8.4 kB",
    "public/skins/default-poke-crew  24 sprites",
    "",
    "✓ typecheck complete",
    "✓ assets copied",
    "✓ built in 612ms",
  ],
  shell: [
    "$ git status --short",
    " M src/main.tsx",
    " M src/styles.css",
    "",
    "$ rg \"characterId\" src",
    "src/main.tsx:  characterId: string;",
    "src/main.tsx:  characterId: \"mugi\",",
  ],
};

function getCharacter(characterId: string) {
  return characters.find((character) => character.id === characterId) ?? characters[0];
}

function getRandomUnusedCharacterId(tabs: TabSession[]) {
  const used = new Set(tabs.map((tab) => tab.characterId));
  const available = characters.filter((character) => !used.has(character.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)].id;
}

function App() {
  const [tabs, setTabs] = useState<TabSession[]>(initialTabs);
  const [selectedTabId, setSelectedTabId] = useState(initialTabs[0].id);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const [pickerTabId, setPickerTabId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const selectedTab = tabs.find((tab) => tab.id === selectedTabId) ?? tabs[0];
  const pickerTab = tabs.find((tab) => tab.id === pickerTabId) ?? null;

  function addTab() {
    const characterId = getRandomUnusedCharacterId(tabs);
    if (!characterId) {
      setMessage("All 8 characters are already in use.");
      return;
    }

    const nextTab: TabSession = {
      id: `tab-${Date.now()}`,
      characterId,
      state: "not_now",
      mockKind: ["dev", "logs", "build", "shell"][tabs.length % 4] as TabSession["mockKind"],
    };

    setTabs((currentTabs) => [...currentTabs, nextTab]);
    setSelectedTabId(nextTab.id);
    setMessage("");
  }

  function closeSelectedTab() {
    if (tabs.length <= 1) {
      setMessage("Keep at least one tab open.");
      return;
    }

    const selectedIndex = tabs.findIndex((tab) => tab.id === selectedTabId);
    const nextTabs = tabs.filter((tab) => tab.id !== selectedTabId);
    setTabs(nextTabs);
    setSelectedTabId(nextTabs[Math.max(0, selectedIndex - 1)].id);
    setPickerTabId(null);
    setMessage("");
  }

  function setSelectedState(state: AttentionState) {
    setTabs((currentTabs) =>
      currentTabs.map((tab) => (tab.id === selectedTabId ? { ...tab, state } : tab)),
    );
  }

  function replaceCharacter(tabId: string, characterId: string) {
    const usedByAnotherTab = tabs.some((tab) => tab.id !== tabId && tab.characterId === characterId);
    if (usedByAnotherTab) return;

    setTabs((currentTabs) =>
      currentTabs.map((tab) => (tab.id === tabId ? { ...tab, characterId } : tab)),
    );
    setPickerTabId(null);
  }

  return (
    <main className="app-shell">
      <section className="terminal-window" aria-label="Poke terminal visual prototype">
        <TabBar
          tabs={tabs}
          selectedTabId={selectedTabId}
          animationsPaused={animationsPaused}
          onSelectTab={setSelectedTabId}
          onOpenPicker={setPickerTabId}
        />
        <div className="terminal-stage">
          <TerminalMock tab={selectedTab} pickerOpen={Boolean(pickerTab)} />
          {pickerTab ? (
            <CharacterPickerOverlay
              tab={pickerTab}
              tabs={tabs}
              onClose={() => setPickerTabId(null)}
              onSelect={(characterId) => replaceCharacter(pickerTab.id, characterId)}
              animationsPaused={animationsPaused}
            />
          ) : null}
        </div>
      </section>
      <PrototypeControls
        animationsPaused={animationsPaused}
        onToggleAnimations={() => setAnimationsPaused((paused) => !paused)}
        selectedState={selectedTab.state}
        onSetState={setSelectedState}
        onAddTab={addTab}
        onCloseTab={closeSelectedTab}
        message={message}
      />
    </main>
  );
}

function TabBar({
  tabs,
  selectedTabId,
  animationsPaused,
  onSelectTab,
  onOpenPicker,
}: {
  tabs: TabSession[];
  selectedTabId: string;
  animationsPaused: boolean;
  onSelectTab: (tabId: string) => void;
  onOpenPicker: (tabId: string) => void;
}) {
  return (
    <div className="tab-bar" role="tablist" aria-label="Terminal tabs">
      {tabs.map((tab) => {
        const character = getCharacter(tab.characterId);

        return (
          <button
            className={`tab ${tab.id === selectedTabId ? "tab-active" : ""}`}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === selectedTabId}
            onClick={() => onSelectTab(tab.id)}
          >
            <span
              className="tab-icon-button"
              role="button"
              tabIndex={0}
              aria-label={`Change ${character.name}`}
              onClick={(event) => {
                event.stopPropagation();
                onOpenPicker(tab.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onOpenPicker(tab.id);
                }
              }}
            >
              <CharacterIcon character={character} state={tab.state} paused={animationsPaused} />
            </span>
            <span className="tab-name">{character.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function CharacterIcon({
  character,
  state,
  paused,
}: {
  character: Character;
  state: AttentionState;
  paused: boolean;
}) {
  return <SpriteCharacterIcon character={character} state={state} paused={paused} />;
}

function SpriteCharacterIcon({
  character,
  state,
  paused,
}: {
  character: Character;
  state: AttentionState;
  paused: boolean;
}) {
  const src = state === "needs_you" ? character.needsYouSrc : character.idleSrc;
  const frames = state === "needs_you" ? character.needsYouFrames : character.idleFrames;

  return (
    <span
      className={`character-icon sprite-icon sprite-${state} ${paused ? "animations-paused" : ""}`}
      style={
        {
          "--sprite-url": `url(${src})`,
          "--sprite-frames": frames,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
}

function TerminalMock({ tab, pickerOpen }: { tab: TabSession; pickerOpen: boolean }) {
  const lines = mockTerminalText[tab.mockKind];

  return (
    <div className={`terminal-body ${pickerOpen ? "terminal-dimmed" : ""}`}>
      <pre>
        {lines.map((line, index) => (
          <span key={`${tab.id}-${index}`}>
            {line}
            {"\n"}
          </span>
        ))}
      </pre>
    </div>
  );
}

function CharacterPickerOverlay({
  tab,
  tabs,
  animationsPaused,
  onClose,
  onSelect,
}: {
  tab: TabSession;
  tabs: TabSession[];
  animationsPaused: boolean;
  onClose: () => void;
  onSelect: (characterId: string) => void;
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(
    Math.max(0, characters.findIndex((character) => character.id === tab.characterId)),
  );

  const usedByAnotherTab = useMemo(
    () =>
      new Set(
        tabs
          .filter((candidateTab) => candidateTab.id !== tab.id)
          .map((candidateTab) => candidateTab.characterId),
      ),
    [tabs, tab.id],
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
        if (!usedByAnotherTab.has(character.id)) onSelect(character.id);
      }

      if (/^[1-8]$/.test(event.key)) {
        event.preventDefault();
        const character = characters[Number(event.key) - 1];
        if (!usedByAnotherTab.has(character.id)) onSelect(character.id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [highlightedIndex, onClose, onSelect, usedByAnotherTab]);

  return (
    <div className="picker-layer" aria-modal="true" role="dialog" aria-label="Change character">
      <div className="character-picker">
        <div className="picker-title">CHANGE CHARACTER</div>
        <div className="picker-list">
          {characters.map((character, index) => {
            const disabled = usedByAnotherTab.has(character.id);
            const current = character.id === tab.characterId;
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
                <span className="picker-cursor">{current ? ">" : highlighted ? "·" : " "}</span>
                <span className="picker-number">{index + 1}</span>
                <CharacterIcon
                  character={character}
                  state={tab.state}
                  paused={animationsPaused}
                />
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

function PrototypeControls({
  animationsPaused,
  selectedState,
  message,
  onToggleAnimations,
  onSetState,
  onAddTab,
  onCloseTab,
}: {
  animationsPaused: boolean;
  selectedState: AttentionState;
  message: string;
  onToggleAnimations: () => void;
  onSetState: (state: AttentionState) => void;
  onAddTab: () => void;
  onCloseTab: () => void;
}) {
  return (
    <aside className="prototype-controls" aria-label="Prototype controls">
      <label className="toggle-control">
        <input type="checkbox" checked={animationsPaused} onChange={onToggleAnimations} />
        pause animations
      </label>
      <button
        className={selectedState === "not_now" ? "control-active" : ""}
        type="button"
        onClick={() => onSetState("not_now")}
      >
        set not_now
      </button>
      <button
        className={selectedState === "needs_you" ? "control-active" : ""}
        type="button"
        onClick={() => onSetState("needs_you")}
      >
        set needs_you
      </button>
      <button type="button" onClick={onAddTab}>
        add tab
      </button>
      <button type="button" onClick={onCloseTab}>
        close selected
      </button>
      <span className="control-message" aria-live="polite">
        {message}
      </span>
    </aside>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
