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
  | "kiri"
  | "mika"
  | "rina"
  | "sena"
  | "towa"
  | "yura"
  | "nono"
  | "riko"
  | "hina"
  | "sumi"
  | "luka"
  | "nina"
  | "mioi"
  | "tomo"
  | "yori"
  | "runa"
  | "kana";

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
        "foreground": "#EEF2DF",
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
        "background": "#111516",
        "foreground": "#E0F0F3",
        "cursor": "#9EE7FF",
        "cursorAccent": "#111516",
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
        "tabBackground": "#202A2D",
        "activeTabBackground": "#1A2325",
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
        "background": "#171113",
        "foreground": "#F2E3EA",
        "cursor": "#FFB4D6",
        "cursorAccent": "#171113",
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
        "tabBackground": "#30252A",
        "activeTabBackground": "#281E22",
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
        "background": "#211910",
        "foreground": "#F1E8D9",
        "cursor": "#FFC979",
        "cursorAccent": "#211910",
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
        "tabBackground": "#382D1E",
        "activeTabBackground": "#302719",
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
        "background": "#121117",
        "foreground": "#E8E3F3",
        "cursor": "#BCA7FF",
        "cursorAccent": "#121117",
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
        "tabBackground": "#23202E",
        "activeTabBackground": "#1D1A26",
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
        "background": "#212010",
        "foreground": "#F2EFD9",
        "cursor": "#FFE066",
        "cursorAccent": "#212010",
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
        "tabBackground": "#38351E",
        "activeTabBackground": "#302D19",
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
        "background": "#0F1713",
        "foreground": "#DDF1E7",
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
        "foreground": "#F0E9DD",
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
        "white": "#F0E9DD",
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
  },
  "mika": {
    "id": "mika",
    "name": "Mika",
    "primary": "#EED64F",
    "theme": {
      "xterm": {
        "background": "#1F1E16",
        "foreground": "#EBE9E0",
        "cursor": "#EED64F",
        "cursorAccent": "#1F1E16",
        "selectionBackground": "#494427",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EBE9E0",
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
        "appBackground": "#1F1E16",
        "panelBackground": "#26241D",
        "tabBackground": "#343123",
        "activeTabBackground": "#2A281D",
        "activeTabBorder": "#EED64F",
        "tabHoverBackground": "#494427",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#26241D",
        "overlayBorder": "#EED64F",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#EED64F",
        "scrollbarThumb": "#494427"
      }
    }
  },
  "rina": {
    "id": "rina",
    "name": "Rina",
    "primary": "#87C3F3",
    "theme": {
      "xterm": {
        "background": "#14191C",
        "foreground": "#E0E6EB",
        "cursor": "#87C3F3",
        "cursorAccent": "#14191C",
        "selectionBackground": "#273A49",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E0E6EB",
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
        "appBackground": "#14191C",
        "panelBackground": "#1D2226",
        "tabBackground": "#232C34",
        "activeTabBackground": "#1D242A",
        "activeTabBorder": "#87C3F3",
        "tabHoverBackground": "#273A49",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#1D2226",
        "overlayBorder": "#87C3F3",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#87C3F3",
        "scrollbarThumb": "#273A49"
      }
    }
  },
  "sena": {
    "id": "sena",
    "name": "Sena",
    "primary": "#F5959B",
    "theme": {
      "xterm": {
        "background": "#1E1516",
        "foreground": "#EBE0E1",
        "cursor": "#F5959B",
        "cursorAccent": "#1E1516",
        "selectionBackground": "#492729",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EBE0E1",
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
        "appBackground": "#1E1516",
        "panelBackground": "#261D1D",
        "tabBackground": "#342324",
        "activeTabBackground": "#2A1D1E",
        "activeTabBorder": "#F5959B",
        "tabHoverBackground": "#492729",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#261D1D",
        "overlayBorder": "#F5959B",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#F5959B",
        "scrollbarThumb": "#492729"
      }
    }
  },
  "towa": {
    "id": "towa",
    "name": "Towa",
    "primary": "#EEB94F",
    "theme": {
      "xterm": {
        "background": "#1E1B15",
        "foreground": "#EBE7E0",
        "cursor": "#EEB94F",
        "cursorAccent": "#1E1B15",
        "selectionBackground": "#493E27",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EBE7E0",
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
        "appBackground": "#1E1B15",
        "panelBackground": "#26231D",
        "tabBackground": "#342E23",
        "activeTabBackground": "#2A261D",
        "activeTabBorder": "#EEB94F",
        "tabHoverBackground": "#493E27",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#26231D",
        "overlayBorder": "#EEB94F",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#EEB94F",
        "scrollbarThumb": "#493E27"
      }
    }
  },
  "yura": {
    "id": "yura",
    "name": "Yura",
    "primary": "#CD987A",
    "theme": {
      "xterm": {
        "background": "#1E1815",
        "foreground": "#EBE4E0",
        "cursor": "#CD987A",
        "cursorAccent": "#1E1815",
        "selectionBackground": "#493327",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EBE4E0",
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
        "appBackground": "#1E1815",
        "panelBackground": "#26201D",
        "tabBackground": "#342923",
        "activeTabBackground": "#2A221D",
        "activeTabBorder": "#CD987A",
        "tabHoverBackground": "#493327",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#26201D",
        "overlayBorder": "#CD987A",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#CD987A",
        "scrollbarThumb": "#493327"
      }
    }
  },
  "nono": {
    "id": "nono",
    "name": "Nono",
    "primary": "#EE99F5",
    "theme": {
      "xterm": {
        "background": "#1D151E",
        "foreground": "#EAE0EB",
        "cursor": "#EE99F5",
        "cursorAccent": "#1D151E",
        "selectionBackground": "#462749",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EAE0EB",
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
        "appBackground": "#1D151E",
        "panelBackground": "#251D26",
        "tabBackground": "#332334",
        "activeTabBackground": "#291D2A",
        "activeTabBorder": "#EE99F5",
        "tabHoverBackground": "#462749",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#251D26",
        "overlayBorder": "#EE99F5",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#EE99F5",
        "scrollbarThumb": "#462749"
      }
    }
  },
  "riko": {
    "id": "riko",
    "name": "Riko",
    "primary": "#B899F5",
    "theme": {
      "xterm": {
        "background": "#18151E",
        "foreground": "#E4E0EB",
        "cursor": "#B899F5",
        "cursorAccent": "#18151E",
        "selectionBackground": "#332749",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E4E0EB",
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
        "appBackground": "#18151E",
        "panelBackground": "#201D26",
        "tabBackground": "#292334",
        "activeTabBackground": "#221D2A",
        "activeTabBorder": "#B899F5",
        "tabHoverBackground": "#332749",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#201D26",
        "overlayBorder": "#B899F5",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#B899F5",
        "scrollbarThumb": "#332749"
      }
    }
  },
  "hina": {
    "id": "hina",
    "name": "Hina",
    "primary": "#9D99F5",
    "theme": {
      "xterm": {
        "background": "#15141C",
        "foreground": "#E1E0EB",
        "cursor": "#9D99F5",
        "cursorAccent": "#15141C",
        "selectionBackground": "#292749",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E1E0EB",
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
        "appBackground": "#15141C",
        "panelBackground": "#1D1D26",
        "tabBackground": "#232334",
        "activeTabBackground": "#1E1D2A",
        "activeTabBorder": "#9D99F5",
        "tabHoverBackground": "#292749",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#1D1D26",
        "overlayBorder": "#9D99F5",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#9D99F5",
        "scrollbarThumb": "#292749"
      }
    }
  },
  "sumi": {
    "id": "sumi",
    "name": "Sumi",
    "primary": "#C599F5",
    "theme": {
      "xterm": {
        "background": "#19151E",
        "foreground": "#E5E0EB",
        "cursor": "#C599F5",
        "cursorAccent": "#19151E",
        "selectionBackground": "#372749",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E5E0EB",
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
        "appBackground": "#19151E",
        "panelBackground": "#211D26",
        "tabBackground": "#2B2334",
        "activeTabBackground": "#231D2A",
        "activeTabBorder": "#C599F5",
        "tabHoverBackground": "#372749",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#211D26",
        "overlayBorder": "#C599F5",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#C599F5",
        "scrollbarThumb": "#372749"
      }
    }
  },
  "luka": {
    "id": "luka",
    "name": "Luka",
    "primary": "#BD8AF3",
    "theme": {
      "xterm": {
        "background": "#19151E",
        "foreground": "#E5E0EB",
        "cursor": "#BD8AF3",
        "cursorAccent": "#19151E",
        "selectionBackground": "#382749",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E5E0EB",
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
        "appBackground": "#19151E",
        "panelBackground": "#211D26",
        "tabBackground": "#2B2334",
        "activeTabBackground": "#241D2A",
        "activeTabBorder": "#BD8AF3",
        "tabHoverBackground": "#382749",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#211D26",
        "overlayBorder": "#BD8AF3",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#BD8AF3",
        "scrollbarThumb": "#382749"
      }
    }
  },
  "nina": {
    "id": "nina",
    "name": "Nina",
    "primary": "#F27CAB",
    "theme": {
      "xterm": {
        "background": "#1E1519",
        "foreground": "#EBE0E4",
        "cursor": "#F27CAB",
        "cursorAccent": "#1E1519",
        "selectionBackground": "#492735",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EBE0E4",
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
        "appBackground": "#1E1519",
        "panelBackground": "#261D20",
        "tabBackground": "#34232A",
        "activeTabBackground": "#2A1D22",
        "activeTabBorder": "#F27CAB",
        "tabHoverBackground": "#492735",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#261D20",
        "overlayBorder": "#F27CAB",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#F27CAB",
        "scrollbarThumb": "#492735"
      }
    }
  },
  "mioi": {
    "id": "mioi",
    "name": "Mioi",
    "primary": "#F599C2",
    "theme": {
      "xterm": {
        "background": "#1E1519",
        "foreground": "#EBE0E5",
        "cursor": "#F599C2",
        "cursorAccent": "#1E1519",
        "selectionBackground": "#492736",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#EBE0E5",
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
        "appBackground": "#1E1519",
        "panelBackground": "#261D21",
        "tabBackground": "#34232A",
        "activeTabBackground": "#2A1D23",
        "activeTabBorder": "#F599C2",
        "tabHoverBackground": "#492736",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#261D21",
        "overlayBorder": "#F599C2",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#F599C2",
        "scrollbarThumb": "#492736"
      }
    }
  },
  "tomo": {
    "id": "tomo",
    "name": "Tomo",
    "primary": "#99F5C3",
    "theme": {
      "xterm": {
        "background": "#151E19",
        "foreground": "#E0EBE5",
        "cursor": "#99F5C3",
        "cursorAccent": "#151E19",
        "selectionBackground": "#274937",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E0EBE5",
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
        "appBackground": "#151E19",
        "panelBackground": "#1D2621",
        "tabBackground": "#23342B",
        "activeTabBackground": "#1D2A23",
        "activeTabBorder": "#99F5C3",
        "tabHoverBackground": "#274937",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#1D2621",
        "overlayBorder": "#99F5C3",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#99F5C3",
        "scrollbarThumb": "#274937"
      }
    }
  },
  "yori": {
    "id": "yori",
    "name": "Yori",
    "primary": "#B4AEE0",
    "theme": {
      "xterm": {
        "background": "#16151E",
        "foreground": "#E2E0EB",
        "cursor": "#B4AEE0",
        "cursorAccent": "#16151E",
        "selectionBackground": "#2B2749",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E2E0EB",
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
        "appBackground": "#16151E",
        "panelBackground": "#1E1D26",
        "tabBackground": "#252334",
        "activeTabBackground": "#1F1D2A",
        "activeTabBorder": "#B4AEE0",
        "tabHoverBackground": "#2B2749",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#1E1D26",
        "overlayBorder": "#B4AEE0",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#B4AEE0",
        "scrollbarThumb": "#2B2749"
      }
    }
  },
  "runa": {
    "id": "runa",
    "name": "Runa",
    "primary": "#C4EE4F",
    "theme": {
      "xterm": {
        "background": "#1D1F16",
        "foreground": "#E8EBE0",
        "cursor": "#C4EE4F",
        "cursorAccent": "#1D1F16",
        "selectionBackground": "#404927",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E8EBE0",
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
        "appBackground": "#1D1F16",
        "panelBackground": "#23261D",
        "tabBackground": "#2F3423",
        "activeTabBackground": "#272A1D",
        "activeTabBorder": "#C4EE4F",
        "tabHoverBackground": "#404927",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#23261D",
        "overlayBorder": "#C4EE4F",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#C4EE4F",
        "scrollbarThumb": "#404927"
      }
    }
  },
  "kana": {
    "id": "kana",
    "name": "Kana",
    "primary": "#99E5F5",
    "theme": {
      "xterm": {
        "background": "#141B1C",
        "foreground": "#E0E9EB",
        "cursor": "#99E5F5",
        "cursorAccent": "#141B1C",
        "selectionBackground": "#274349",
        "black": "#151515",
        "red": "#FF6B6B",
        "green": "#A7F3A1",
        "yellow": "#FFE082",
        "blue": "#82AAFF",
        "magenta": "#C792EA",
        "cyan": "#89DDFF",
        "white": "#E0E9EB",
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
        "appBackground": "#141B1C",
        "panelBackground": "#1D2426",
        "tabBackground": "#233134",
        "activeTabBackground": "#1D282A",
        "activeTabBorder": "#99E5F5",
        "tabHoverBackground": "#274349",
        "tabText": "#E8EBDD",
        "mutedText": "#AEB8AA",
        "overlayBackground": "#1D2426",
        "overlayBorder": "#99E5F5",
        "overlayText": "#E8EBDD",
        "overlayDisabledText": "#687066",
        "focusRing": "#99E5F5",
        "scrollbarThumb": "#274349"
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
