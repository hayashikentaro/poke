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
        "background": "#1D2015",
        "foreground": "#EEF2DF",
        "cursor": "#D9F28B",
        "cursorAccent": "#1D2015",
        "selectionBackground": "#3B4526",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EEF2DF",
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
        "tabBackground": "#1D2015",
        "activeTabBackground": "#1D2015",
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
        "background": "#181D1F",
        "foreground": "#E0F0F3",
        "cursor": "#9EE7FF",
        "cursorAccent": "#181D1F",
        "selectionBackground": "#2D3F43",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E0F0F3",
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
        "appBackground": "#111516",
        "panelBackground": "#171D1F",
        "tabBackground": "#181D1F",
        "activeTabBackground": "#181D1F",
        "activeTabBorder": "#9EE7FF",
        "tabHoverBackground": "#2D3F43",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#171D1F",
        "overlayBorder": "#9EE7FF",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#9EE7FF",
        "scrollbarThumb": "#2D3F43"
      }
    }
  },
  "kiku": {
    "id": "kiku",
    "name": "Kiku",
    "primary": "#FFB4D6",
    "theme": {
      "xterm": {
        "background": "#21191C",
        "foreground": "#F2E3EA",
        "cursor": "#FFB4D6",
        "cursorAccent": "#21191C",
        "selectionBackground": "#46313A",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#F2E3EA",
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
        "appBackground": "#171113",
        "panelBackground": "#21191C",
        "tabBackground": "#21191C",
        "activeTabBackground": "#21191C",
        "activeTabBorder": "#FFB4D6",
        "tabHoverBackground": "#46313A",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#21191C",
        "overlayBorder": "#FFB4D6",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#FFB4D6",
        "scrollbarThumb": "#46313A"
      }
    }
  },
  "sora": {
    "id": "sora",
    "name": "Sora",
    "primary": "#FFC979",
    "theme": {
      "xterm": {
        "background": "#2A2116",
        "foreground": "#F1E8D9",
        "cursor": "#FFC979",
        "cursorAccent": "#2A2116",
        "selectionBackground": "#55432B",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#F1E8D9",
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
        "appBackground": "#211910",
        "panelBackground": "#2A2217",
        "tabBackground": "#2A2116",
        "activeTabBackground": "#2A2116",
        "activeTabBorder": "#FFC979",
        "tabHoverBackground": "#55432B",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#2A2217",
        "overlayBorder": "#FFC979",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#FFC979",
        "scrollbarThumb": "#55432B"
      }
    }
  },
  "nagi": {
    "id": "nagi",
    "name": "Nagi",
    "primary": "#BCA7FF",
    "theme": {
      "xterm": {
        "background": "#1A1821",
        "foreground": "#E8E3F3",
        "cursor": "#BCA7FF",
        "cursorAccent": "#1A1821",
        "selectionBackground": "#363044",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8E3F3",
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
        "appBackground": "#121117",
        "panelBackground": "#181720",
        "tabBackground": "#1A1821",
        "activeTabBackground": "#1A1821",
        "activeTabBorder": "#BCA7FF",
        "tabHoverBackground": "#363044",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#181720",
        "overlayBorder": "#BCA7FF",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#BCA7FF",
        "scrollbarThumb": "#363044"
      }
    }
  },
  "yuzu": {
    "id": "yuzu",
    "name": "Yuzu",
    "primary": "#FFE066",
    "theme": {
      "xterm": {
        "background": "#2A2816",
        "foreground": "#F2EFD9",
        "cursor": "#FFE066",
        "cursorAccent": "#2A2816",
        "selectionBackground": "#55512B",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#F2EFD9",
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
        "appBackground": "#212010",
        "panelBackground": "#2A2817",
        "tabBackground": "#2A2816",
        "activeTabBackground": "#2A2816",
        "activeTabBorder": "#FFE066",
        "tabHoverBackground": "#55512B",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#2A2817",
        "overlayBorder": "#FFE066",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#FFE066",
        "scrollbarThumb": "#55512B"
      }
    }
  },
  "haru": {
    "id": "haru",
    "name": "Haru",
    "primary": "#98F5C4",
    "theme": {
      "xterm": {
        "background": "#16221B",
        "foreground": "#DDF1E7",
        "cursor": "#98F5C4",
        "cursorAccent": "#16221B",
        "selectionBackground": "#244B36",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#DDF1E7",
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
        "tabBackground": "#16221B",
        "activeTabBackground": "#16221B",
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
    "primary": "#D49BFF",
    "theme": {
      "xterm": {
        "background": "#211827",
        "foreground": "#ECE2F0",
        "cursor": "#D49BFF",
        "cursorAccent": "#211827",
        "selectionBackground": "#463255",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#ECE2F0",
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
        "appBackground": "#18111C",
        "panelBackground": "#211A28",
        "tabBackground": "#211827",
        "activeTabBackground": "#211827",
        "activeTabBorder": "#D49BFF",
        "tabHoverBackground": "#463255",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#211A28",
        "overlayBorder": "#D49BFF",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#D49BFF",
        "scrollbarThumb": "#463255"
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
