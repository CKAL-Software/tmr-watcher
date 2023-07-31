import fetch from "node-fetch";
import { getAccessToken, login, logout } from "./credentialsHandler";
import { downloadFile, question } from "./util";
import FormData from "form-data";
import fs from "fs";
import { String } from "aws-sdk/clients/batch";
import { Track, TrackGroup } from "./definitions";
import path from "path";

const register: Record<string, number> = {};
const targetFolder = "..";
let playerName = "";

(async () => {
  const { version } = JSON.parse(fs.readFileSync("package.json").toString());

  console.log(`Running TrackMania Registry watcher v${version}`);

  const result = await fetch("https://api.ckal.dk/tmr/username", {
    headers: { Authorization: await getAccessToken() },
  });
  playerName = (await result.json()).username;

  console.log();
  console.log("Commands are: (E)xit, (S)ync, (C)lean up and (L)og out");
  console.log();
  console.log(`Watching for file changes...`);
  console.log();
  await synchronize();

  fs.watch(targetFolder, (_event, filename) => {
    if (
      !filename?.includes(".Replay.gbx") ||
      filename.includes("__") ||
      !filename.includes(playerName)
    ) {
      return;
    }

    try {
      fs.readFileSync(path.join(targetFolder, filename));
    } catch {
      return;
    }

    const modified = fs.statSync(path.join(targetFolder, filename)).mtimeMs;

    if (filename && (!register[filename] || register[filename] < modified)) {
      register[filename] = modified;
      tryUpload(path.join(targetFolder, filename));
    }
  });

  while (true) {
    const input = await question("");
    if (input.toLowerCase() === "e") {
      process.exit();
    } else if (input.toLowerCase() === "s") {
      await synchronize();
    } else if (input.toLowerCase() === "c") {
      await cleanUp();
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
    const answer = await question("Delete now? (Y/n): ");

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
  const trackGroupsResult = await fetch("https://api.ckal.dk/tmr/trackgroups", {
    headers: { Authorization: await getAccessToken() },
  });

  if (!trackGroupsResult.ok) {
    console.log("An error occurred");
    return;
  }

  const tracks: Track[] = (
    (await trackGroupsResult.json()) as TrackGroup[]
  ).reduce<Track[]>((all, tg) => all.concat(...tg.tracks), []);

  const otherGhosts: string[] = [];

  tracks.forEach((t) => {
    Object.entries(t.records)
      .filter(([name]) => name !== playerName)
      .forEach(([, ghost]) =>
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

  const answer = await question(
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
        console.log(`Downloaded ghost ${ghost.split("__")[0]}`);
      })
    );
  }

  await cleanUp();
}

async function tryUpload(fileName: string) {
  const trackName = fileName.split(".")[0].split("_")[1];

  console.log(`Attempting to upload ghost on ${trackName}`);

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

  console.log((await result.text()).slice(1, -1));
}
