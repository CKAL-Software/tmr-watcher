import readlineSync from "readline-sync";
import fetch from "node-fetch";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { BUCKET_URL } from "./definitions";
import path from "path";
import readline from "readline";

export function msToLaptime(msIn: number | undefined) {
  if (msIn === undefined) {
    return "";
  }

  const ms = Math.abs(msIn);

  if (ms < 1000) {
    return (
      (msIn < 0 ? "-" : "") +
      `00:${Math.round(ms / 10)
        .toString()
        .padStart(2, "0")}`
    );
  }

  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const thousands = ms % 1000;

  if (isNaN(ms) || isNaN(mins) || isNaN(secs) || isNaN(thousands)) {
    return "";
  }

  return (
    (msIn < 0 ? "-" : "") +
    `${mins ? mins + ":" : ""}${secs
      .toString()
      .padStart(mins > 0 ? 2 : 0, "0")}:${Math.floor(thousands / 10)
      .toString()
      .padStart(2, "0")}`
  );
}

export async function downloadFile(fileName: string, targetFolder: string) {
  const pipeline = promisify(stream.pipeline);

  const response = await fetch(`${BUCKET_URL}/ghosts/${fileName}`);

  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`);
  }

  await pipeline(
    response.body,
    fs.createWriteStream(path.join(targetFolder, fileName.replace("<>", "__")))
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function question(query: string): Promise<string> {
  return new Promise((r) => {
    rl.question(query, (v) => r(v));
  });
}

export function hiddenQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    const onData = (char: string) => {
      char = char + "";
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          process.stdin.removeListener("data", onData);
          break;
        default:
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(query + Array(rl.line.length + 1).join("*"));
          break;
      }
    };
    process.stdin.on("data", onData);

    rl.question(query, (value) => {
      resolve(value);
    });
  });
}
