# Poke

Poke is a Tauri desktop terminal app with character-based tabs. The current prototype runs multiple real shell sessions through xterm.js and a Rust PTY backend.

![Poke screenshot](docs/images/poke-screenshot.png)

## Download

Download the macOS build from GitHub Releases:

- [Latest release](https://github.com/hayashikentaro/poke/releases/latest)

Unzip the file, then open `Poke.app`.

This is an unsigned macOS app. If macOS blocks the first launch, open it from Finder with right click, then `Open`.

## Features

- Real shell sessions backed by a Rust PTY
- Multiple terminal tabs
- Character-based tab labels and sprites
- Character picker
- Drag-and-drop tab reordering
- Per-character dark themes
- Runtime terminal font size changes with `Command + +` and `Command + -`

AI, notifications, persistence for tabs, command palette, and settings UI are intentionally not implemented yet.

## Requirements

- Node.js 20 or newer
- Rust and Cargo
- Platform-specific Tauri prerequisites for your operating system

On macOS, verify the required tools first:

```sh
node --version
npm --version
cargo --version
rustc --version
xcode-select -p
```

If `cargo` or `rustc` is missing, install Rust:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installation, restart the terminal or load Cargo into the current shell:

```sh
source "$HOME/.cargo/env"
```

If `xcode-select -p` fails on macOS, install Apple's command line tools:

```sh
xcode-select --install
```

## Install

```sh
npm install
```

## Run in development

```sh
npm run tauri dev
```

This launches the Tauri desktop app and starts the frontend dev server that the app loads internally.

If this fails with `failed to run 'cargo metadata'`, Cargo is not installed or is not on `PATH`. Run `cargo --version`; if it fails, install Rust using the command above.

## Verify Terminal Behavior

Use the Tauri app for terminal testing:

```sh
npm run tauri dev
```

In the app window, verify:

- A shell prompt appears.
- Typed commands are echoed.
- Command output appears in the terminal.
- The `+` button opens another terminal tab.
- Switching tabs preserves each terminal buffer.
- Closing a tab closes that tab's shell session.
- Tabs show character sprites.
- Clicking a character opens the character picker.
- A non-active tab switches to the `needs_you` sprite after 5 seconds without output.
- Activating a `needs_you` tab resets it to the idle sprite.
- Resizing the window keeps the terminal usable.
- Closing the app exits the shell session cleanly.

Do not verify PTY behavior by opening the Vite dev server directly in a browser. Browser-only mode does not provide Tauri commands or events, so the Rust PTY backend cannot run there.

## App Configuration

At runtime, Poke reads configuration from the app config directory:

```sh
~/Library/Application Support/com.poke.terminal/config.json
```

The file is created with defaults the first time the Tauri app runs. To change the terminal font size after building the app, edit:

```json
{
  "terminal": {
    "fontSize": 18
  }
}
```

Restart the app after editing the file manually.

While the app is running, use `Command + +` or `Command + -` to change the terminal font size. The new size is saved to `config.json`.

Development defaults live in `src/appConfig.ts`.

## Frontend-only development

```sh
npm run dev
```

Frontend-only development is useful for static React layout work, but it does not start the Rust PTY backend.
