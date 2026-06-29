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

## Frontend-only development

```sh
npm run dev
```

The frontend-only server does not start the Rust PTY backend. Use `npm run tauri dev` when testing the terminal.
