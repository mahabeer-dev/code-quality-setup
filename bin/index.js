#!/usr/bin/env node
import fs from "fs-extra";
import { execa } from "execa";
import path from "path";
import prompts from "prompts";

const cwd = process.cwd();
const __dirname = new URL(".", import.meta.url).pathname;

console.log("\n🚀 Setting up code quality tools...\n");

const { pm } = await prompts({
  type: "select",
  name: "pm",
  message: "Choose your package manager",
  choices: [
    { title: "pnpm", value: "pnpm" },
    { title: "npm", value: "npm" },
    { title: "yarn", value: "yarn" },
  ],
});

const installCmd = pm === "pnpm" ? "add" : "install";
const execCmd = pm;

await execa(
  execCmd,
  [
    installCmd,
    "-D",
    "eslint",
    "prettier",
    "husky",
    "lint-staged",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
  ],
  { stdio: "inherit" }
);

await fs.copy(path.join(__dirname, "../templates"), cwd, { overwrite: false });

await execa(execCmd, ["prepare"], { stdio: "inherit" }).catch(() => {});
await execa(
  execCmd,
  ["exec", "husky", "add", ".husky/pre-commit", `${execCmd} lint-staged`],
  { stdio: "inherit" }
);

console.log("\n✅ Code quality tools installed successfully!\n");
