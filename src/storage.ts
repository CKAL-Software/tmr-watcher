import fs from "fs";

export const STORAGE_FILE = "tmr.json";

export function store(key: string, value: unknown) {
  const storage = read();
  storage[key] = value;
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(storage));
}

export function load(key: string) {
  return read()[key];
}

function read() {
  try {
    return JSON.parse(fs.readFileSync(STORAGE_FILE).toString());
  } catch {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({}));
    return {};
  }
}
