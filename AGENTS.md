# Repository Agent Instructions

- After making repository changes, always commit and push those changes before finishing the task, unless the user explicitly says not to.
- Keep this prototype lightweight and disposable. Avoid adding backend services, persistence, auth, or heavy UI libraries.
- Verify terminal behavior through the Tauri desktop app with `npm run tauri dev`; do not ask the user to validate PTY behavior by opening the Vite dev server directly in a browser.
- Treat `tmp/` as disposable reference material that may be deleted. Do not make runtime code depend on files under `tmp/`; copy any needed source into tracked app files first.
