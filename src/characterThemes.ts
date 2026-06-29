// Poke character terminal themes.
// Generated from the 32px flat no-outline character pack.
// ANSI colors are intentionally shared across characters to preserve terminal semantics.

export type CharacterId =
  | "mugi"
  | "rune"
  | "kiku"
  | "sora"
  | "nagi"
  | "yuzu"
  | "haru"
  | "kiri";

export type PokeXtermTheme = {
  background: string;
  foreground: string;
  cursor: string;
  cursorAccent: string;
  selectionBackground: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
};

export type PokeUiTheme = {
  appBackground: string;
  panelBackground: string;
  tabBackground: string;
  activeTabBackground: string;
  activeTabBorder: string;
  tabHoverBackground: string;
  tabText: string;
  mutedText: string;
  overlayBackground: string;
  overlayBorder: string;
  overlayText: string;
  overlayDisabledText: string;
  focusRing: string;
  scrollbarThumb: string;
};

export type PokeCharacterTheme = {
  id: CharacterId;
  name: string;
  primary: string;
  theme: {
    xterm: PokeXtermTheme;
    ui: PokeUiTheme;
  };
};

export const pokeCharacterThemes = {
  "mugi": {
    "id": "mugi",
    "name": "Mugi",
    "primary": "#D9F28B",
    "theme": {
      "xterm": {
        "background": "#15170F",
        "foreground": "#E8EBDD",
        "cursor": "#D9F28B",
        "cursorAccent": "#15170F",
        "selectionBackground": "#3B4526",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#15170F",
        "panelBackground": "#1D2013",
        "tabBackground": "#292E1A",
        "activeTabBackground": "#202514",
        "activeTabBorder": "#D9F28B",
        "tabHoverBackground": "#3B4526",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#1D2013",
        "overlayBorder": "#D9F28B",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#D9F28B",
        "scrollbarThumb": "#3B4526"
      }
    }
  },
  "rune": {
    "id": "rune",
    "name": "Rune",
    "primary": "#9EE7FF",
    "theme": {
      "xterm": {
        "background": "#0F1517",
        "foreground": "#E8EBDD",
        "cursor": "#9EE7FF",
        "cursorAccent": "#0F1517",
        "selectionBackground": "#24424B",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#0F1517",
        "panelBackground": "#131D20",
        "tabBackground": "#1A292E",
        "activeTabBackground": "#142126",
        "activeTabBorder": "#9EE7FF",
        "tabHoverBackground": "#24424B",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#131D20",
        "overlayBorder": "#9EE7FF",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#9EE7FF",
        "scrollbarThumb": "#24424B"
      }
    }
  },
  "kiku": {
    "id": "kiku",
    "name": "Kiku",
    "primary": "#FFB4D6",
    "theme": {
      "xterm": {
        "background": "#170F13",
        "foreground": "#E8EBDD",
        "cursor": "#FFB4D6",
        "cursorAccent": "#170F13",
        "selectionBackground": "#4B2436",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#170F13",
        "panelBackground": "#201319",
        "tabBackground": "#2E1A23",
        "activeTabBackground": "#26141C",
        "activeTabBorder": "#FFB4D6",
        "tabHoverBackground": "#4B2436",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#201319",
        "overlayBorder": "#FFB4D6",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#FFB4D6",
        "scrollbarThumb": "#4B2436"
      }
    }
  },
  "sora": {
    "id": "sora",
    "name": "Sora",
    "primary": "#FFC979",
    "theme": {
      "xterm": {
        "background": "#17140F",
        "foreground": "#E8EBDD",
        "cursor": "#FFC979",
        "cursorAccent": "#17140F",
        "selectionBackground": "#4B3824",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#17140F",
        "panelBackground": "#201B13",
        "tabBackground": "#2E261A",
        "activeTabBackground": "#261F14",
        "activeTabBorder": "#FFC979",
        "tabHoverBackground": "#4B3824",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#201B13",
        "overlayBorder": "#FFC979",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#FFC979",
        "scrollbarThumb": "#4B3824"
      }
    }
  },
  "nagi": {
    "id": "nagi",
    "name": "Nagi",
    "primary": "#BCA7FF",
    "theme": {
      "xterm": {
        "background": "#110F17",
        "foreground": "#E8EBDD",
        "cursor": "#BCA7FF",
        "cursorAccent": "#110F17",
        "selectionBackground": "#31284B",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#110F17",
        "panelBackground": "#161320",
        "tabBackground": "#1E1A2E",
        "activeTabBackground": "#1A1626",
        "activeTabBorder": "#BCA7FF",
        "tabHoverBackground": "#31284B",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#161320",
        "overlayBorder": "#BCA7FF",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#BCA7FF",
        "scrollbarThumb": "#31284B"
      }
    }
  },
  "yuzu": {
    "id": "yuzu",
    "name": "Yuzu",
    "primary": "#FFE066",
    "theme": {
      "xterm": {
        "background": "#17160F",
        "foreground": "#E8EBDD",
        "cursor": "#FFE066",
        "cursorAccent": "#17160F",
        "selectionBackground": "#4B4424",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#17160F",
        "panelBackground": "#201D13",
        "tabBackground": "#2E2A1A",
        "activeTabBackground": "#262214",
        "activeTabBorder": "#FFE066",
        "tabHoverBackground": "#4B4424",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#201D13",
        "overlayBorder": "#FFE066",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#FFE066",
        "scrollbarThumb": "#4B4424"
      }
    }
  },
  "haru": {
    "id": "haru",
    "name": "Haru",
    "primary": "#98F5C4",
    "theme": {
      "xterm": {
        "background": "#0F1713",
        "foreground": "#E8EBDD",
        "cursor": "#98F5C4",
        "cursorAccent": "#0F1713",
        "selectionBackground": "#244B36",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#0F1713",
        "panelBackground": "#132019",
        "tabBackground": "#1A2E23",
        "activeTabBackground": "#14261D",
        "activeTabBorder": "#98F5C4",
        "tabHoverBackground": "#244B36",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#132019",
        "overlayBorder": "#98F5C4",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#98F5C4",
        "scrollbarThumb": "#244B36"
      }
    }
  },
  "kiri": {
    "id": "kiri",
    "name": "Kiri",
    "primary": "#F5F0E6",
    "theme": {
      "xterm": {
        "background": "#17150F",
        "foreground": "#E8EBDD",
        "cursor": "#F5F0E6",
        "cursorAccent": "#17150F",
        "selectionBackground": "#4B3D24",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBDD",
        "brightBlack": "#5F6660",
        "brightRed": "#FF8A8A",
        "brightGreen": "#B9F8B2",
        "brightYellow": "#FFE9A8",
        "brightBlue": "#A6BDFF",
        "brightMagenta": "#D6A8FF",
        "brightCyan": "#A7EAFF",
        "brightWhite": "#FFFFFF"
      },
      "ui": {
        "appBackground": "#17150F",
        "panelBackground": "#201C13",
        "tabBackground": "#2E271A",
        "activeTabBackground": "#262114",
        "activeTabBorder": "#F5F0E6",
        "tabHoverBackground": "#4B3D24",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#201C13",
        "overlayBorder": "#F5F0E6",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#F5F0E6",
        "scrollbarThumb": "#4B3D24"
      }
    }
  }
} as const satisfies Record<CharacterId, PokeCharacterTheme>;

export function getCharacterTheme(characterId: CharacterId): PokeCharacterTheme {
  return pokeCharacterThemes[characterId];
}

export function applyPokeUiTheme(theme: PokeUiTheme, root: HTMLElement = document.documentElement): void {
  root.style.setProperty("--poke-app-bg", theme.appBackground);
  root.style.setProperty("--poke-panel-bg", theme.panelBackground);
  root.style.setProperty("--poke-tab-bg", theme.tabBackground);
  root.style.setProperty("--poke-active-tab-bg", theme.activeTabBackground);
  root.style.setProperty("--poke-active-tab-border", theme.activeTabBorder);
  root.style.setProperty("--poke-tab-hover-bg", theme.tabHoverBackground);
  root.style.setProperty("--poke-tab-text", theme.tabText);
  root.style.setProperty("--poke-muted-text", theme.mutedText);
  root.style.setProperty("--poke-overlay-bg", theme.overlayBackground);
  root.style.setProperty("--poke-overlay-border", theme.overlayBorder);
  root.style.setProperty("--poke-overlay-text", theme.overlayText);
  root.style.setProperty("--poke-overlay-disabled-text", theme.overlayDisabledText);
  root.style.setProperty("--poke-focus-ring", theme.focusRing);
  root.style.setProperty("--poke-scrollbar-thumb", theme.scrollbarThumb);
}
