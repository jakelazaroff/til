#!/usr/bin/env node

const { execSync } = require("node:child_process");
const { readFile, writeFile } = require("node:fs/promises");

function exec(cmd) {
  return execSync(cmd).toString();
}

async function main() {
  console.log("Building index…");

  const files = exec("git ls-files")
    .split("\n")
    .filter((name) => name.endsWith(".md"))
    .filter((name) => name.includes("/"))
    .sort()
    .map((name) => name.split("/"));

  const tils = new Map();
  for (const [category, file] of files) {
    const list = tils.get(category) || [];
    tils.set(category, [...list, file]);
  }

  let readme = await loadReadmeHeader("README.md");
  readme += `\n${files.length} TILs so far:\n`;

  for (const [category, files] of tils.entries()) {
    readme += `\n## ${category}\n\n`;

    for (const file of files) {
      const filepath = [category, file].join("/");
      const { title } = await loadTil(filepath);
      readme += `- [${title}](/${filepath})\n`;
    }
  }

  await writeFile("README.md", readme);
}

async function loadReadmeHeader(filepath) {
  const contents = await readFile(filepath).then((file) => file.toString());

  const needle = "\n---\n";
  const index = contents.indexOf(needle);
  if (index === -1) return contents + needle;

  return contents.substring(0, index + needle.length);
}

async function loadTil(filepath) {
  const contents = await readFile(filepath).then((file) => file.toString());
  const [, title] = contents.match(/^# (.+)$/m);

  return { title };
}

main();
