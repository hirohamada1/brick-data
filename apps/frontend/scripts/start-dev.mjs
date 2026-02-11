#!/usr/bin/env node
/**
 * Startet Vite und Lead-API gemeinsam (ohne concurrently).
 * Nutzung: node scripts/start-dev.mjs
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const apiScript = path.join(root, "server", "lead-api.js");
const FRONTEND_PORT = Number(process.env.FRONTEND_PORT) || 3000;
const BACKEND_PORT = Number(process.env.LEAD_API_PORT) || 3001;

const vite = spawn(
  process.execPath,
  [viteBin, "--port", String(FRONTEND_PORT), "--strictPort"],
  {
    cwd: root,
    stdio: "inherit",
  }
);

const api = spawn(process.execPath, [apiScript], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    LEAD_API_PORT: String(BACKEND_PORT),
  },
});

function killAll() {
  vite.kill();
  api.kill();
  process.exit(0);
}

process.on("SIGINT", killAll);
process.on("SIGTERM", killAll);

vite.on("error", (err) => {
  console.error("Vite Fehler:", err.message);
  killAll();
});
api.on("error", (err) => {
  console.error("Lead-API Fehler:", err.message);
  killAll();
});
