import fetch from "node-fetch";
import { getAccessToken } from "./credentialsHandler";
import { msToLaptime } from "./util";
import FormData from "form-data";
import fs from "fs";
import { String } from "aws-sdk/clients/batch";

// const register: Record<string, number> = {};

// // make sure accesstoken is fresh
// async () => {
//   await getAccessToken();

//   const targetFolder = "jep";

//   console.log(`Watching for file changes in this folder ${targetFolder}`);

//   fs.watch(targetFolder, (_event, filename) => {
//     if (!filename?.includes(".Replay.gbx")) {
//       return;
//     }

//     const modified = fs.statSync(`${targetFolder}/${filename}`).mtimeMs;

//     if (filename && (!register[filename] || register[filename] < modified)) {
//       register[filename] = modified;
//       uploadGhostIfFaster(`${targetFolder}/${filename}`);
//     }
//   });
// };

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
