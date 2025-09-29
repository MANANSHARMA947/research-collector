import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "../tokens.json");

let store = { users: {} };

if (fs.existsSync(DB_FILE)) {
  try {
    store = fs.readJsonSync(DB_FILE);
  } catch {
    store = { users: {} };
  }
}

export function saveStore() {
  fs.writeJsonSync(DB_FILE, store, { spaces: 2 });
}

export function getStore() {
  return store;
}
