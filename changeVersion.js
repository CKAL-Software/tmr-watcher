const prompts = require("prompts");
const { writeFileSync } = require("fs");

const packageJson = require("./package.json");

doPrompt();

async function doPrompt() {
  const currentVersion = packageJson.version;
  const [major, minor, patch] = currentVersion.split(".");

  const nextPatch = `${major}.${minor}.${Number(patch) + 1}`;
  const nextMinor = `${major}.${Number(minor) + 1}.0`;
  const nextMajor = `${Number(major) + 1}.0.0`;

  const { newVersion } = await prompts([
    {
      type: "select",
      name: "newVersion",
      message: `Current version is ${currentVersion}. Select new version:`,
      choices: [
        { title: `Bump patch: ${nextPatch}`, value: nextPatch },
        { title: `Bump minor: ${nextMinor}`, value: nextMinor },
        { title: `Bump major: ${nextMajor}`, value: nextMajor },
        { title: "No change", value: currentVersion },
      ],
    },
  ]);

  if (newVersion === undefined) {
    console.log("Version not changed");
    return;
  }

  console.log("New version is", newVersion);

  packageJson.version = newVersion;

  writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
}
