import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TerminalPane } from "./TerminalPane";
import "./styles.css";

function App() {
  return (
    <main className="app-shell">
      <TerminalPane />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
