# Poke

Poke is a Tauri desktop terminal app. The current prototype runs one real shell session through xterm.js and a Rust PTY backend.

Tabs, characters, AI, notifications, persistence, command palette, and settings are intentionally not implemented yet.

## Requirements

- Node.js 20 or newer
- Rust and Cargo
- Platform-specific Tauri prerequisites for your operating system

## Install

```sh
npm install
```

## Run in development

```sh
npm run tauri dev
```

This launches the Tauri desktop app and starts the frontend dev server that the app loads internally.

## Verify Terminal Behavior

Use the Tauri app for terminal testing:

```sh
npm run tauri dev
```

In the app window, verify:

- A shell prompt appears.
- Typed commands are echoed.
- Command output appears in the terminal.
- Resizing the window keeps the terminal usable.
- Closing the app exits the shell session cleanly.

Do not verify PTY behavior by opening the Vite dev server directly in a browser. Browser-only mode does not provide Tauri commands or events, so the Rust PTY backend cannot run there.

## Frontend-only development

```sh
npm run dev
```

Frontend-only development is useful for static React layout work, but it does not start the Rust PTY backend.
