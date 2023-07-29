import fetch from "node-fetch";
import { getAccessToken, login, logout } from "./credentialsHandler";
import { downloadFile, question } from "./util";
import FormData from "form-data";
import fs from "fs";
import { String } from "aws-sdk/clients/batch";
import { Track } from "./definitions";
import path from "path";

const register: Record<string, number> = {};
const targetFolder = "..";

(async () => {
  const { version } = JSON.parse(fs.readFileSync("package.json").toString());

  console.log(`Running TrackMania Registry watcher v${version}`);

  // make sure accesstoken is fresh
  await getAccessToken();

  console.log();
  console.log(`Watching for file changes...`);

  fs.watch(targetFolder, (_event, filename) => {
    if (!filename?.includes(".Replay.gbx")) {
      return;
    }

    const modified = fs.statSync(path.join(targetFolder, filename)).mtimeMs;

    if (filename && (!register[filename] || register[filename] < modified)) {
      register[filename] = modified;
      uploadGhostIfFaster(path.join(targetFolder, filename));
    }
  });

  while (true) {
    console.log();
    const input = question("(E)xit, (S)ync, (C)lean up, (L)og out: ");
    if (input.toLowerCase() === "e") {
      process.exit();
    } else if (input.toLowerCase() === "s") {
      await synchronize();
    } else if (input.toLowerCase() === "c") {
      cleanUp();
    } else if (input.toLowerCase() === "l") {
      logout();
      console.log("Logged out...");
      await login();
    } else {
      console.log("Input not recognized");
    }
  }
})();

async function cleanUp() {
  const ghosts = fs
    .readdirSync(targetFolder)
    .filter((name) => name.includes(".Replay.gbx"));

  const trackToTime: Record<string, { time: number; fileName: string }> = {};
  const ghostsToCleanup: string[] = [];

  ghosts.forEach((g) => {
    const [base] = g.split(".");
    const [rest, time] = base.split("__");

    if (trackToTime[rest] && trackToTime[rest].time < Number(time)) {
      ghostsToCleanup.push(g);
    } else {
      trackToTime[rest] = { time: Number(time), fileName: g };
    }
  });

  if (ghostsToCleanup.length === 0) {
    console.log("Nothing to clean up");
  } else {
    console.log(
      `${ghostsToCleanup.length} ghost${
        ghostsToCleanup.length === 1 ? "" : "s"
      } can be deleted:`
    );
    ghostsToCleanup.forEach((g) => console.log(`- ${g}`));
    const answer = question("Delete now? (Y/n): ");

    if (answer.toLowerCase() === "y" || answer === "") {
      ghostsToCleanup.forEach((g) => fs.rmSync(path.join(targetFolder, g)));
    }
    console.log(
      `Deleted ${ghostsToCleanup.length} ghost${
        ghostsToCleanup.length === 1 ? "" : "s"
      }`
    );
  }
}

async function synchronize() {
  const tracksResult = await fetch("https://api.ckal.dk/tmr/tracks", {
    headers: { Authorization: await getAccessToken() },
  });

  if (!tracksResult.ok) {
    console.log("An error occurred");
    return;
  }

  const tracks: Track[] = await tracksResult.json();

  const otherGhosts: string[] = [];

  tracks.forEach((t) => {
    Object.entries(t.records).forEach(([, ghost]) =>
      otherGhosts.push(ghost.fileName.replace("<>", "__").split("/")[1])
    );
  });

  const existingGhosts = fs
    .readdirSync(targetFolder)
    .filter((name) => name.includes(".Replay.gbx"));

  const ghostsToDownload = otherGhosts.filter(
    (g) => !existingGhosts.includes(g)
  );

  if (ghostsToDownload.length === 0) {
    console.log("No new ghosts");
    return;
  }

  const answer = question(
    `${ghostsToDownload.length} new ghost${
      ghostsToDownload.length === 1 ? "" : "s"
    }. Download now? (Y/n): `
  );

  if (answer.toLowerCase() === "y" || answer === "") {
    console.log(
      `Downloading new ghost${ghostsToDownload.length === 1 ? "" : "s"}...`
    );
    await Promise.all(
      ghostsToDownload.map(async (ghost) => {
        register[ghost] = Date.now() + 30 * 1000;
        await downloadFile(ghost.replace("__", "<>"), targetFolder);
        console.log(`Downloaded ghost on ${ghost.split("_")[1]}`);
      })
    );
  }

  cleanUp();
}

async function uploadGhostIfFaster(filename: string) {
  if (!filename.includes(".Replay.gbx")) {
    throw new Error(`Tried to upload ${filename} but is not a ghost file`);
  }

  const file = fs.readFileSync(filename, "utf-8");

  handleUpload(file);
}

async function handleUpload(fileName: String) {
  console.log(`Attempting to upload ${fileName}`);

  const formData = new FormData();
  formData.append("file", fs.createReadStream(fileName));

  const result = await fetch("https://api.ckal.dk/tmr/upload", {
    method: "POST",
    headers: {
      Authorization: await getAccessToken(),
      ...formData.getHeaders(),
    },
    body: formData,
  });

  if (!result.ok) {
    console.log(result.status, await result.text());
    return;
  }

  console.log(result.ok);
  console.log(`Updated ghost ${fileName}'`);
}
