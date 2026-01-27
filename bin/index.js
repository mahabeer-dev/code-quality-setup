#!/usr/bin/env node
import fs from "fs-extra";
import { execa } from "execa";
import path from "path";
import prompts from "prompts";

const cwd = process.cwd();
const __dirname = new URL(".", import.meta.url).pathname;

/* ================================
   Utils
================================= */
const exists = async (p) => fs.pathExists(path.join(cwd, p));

const detectPackageManager = () => {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
};

const run = (cmd, args) => execa(cmd, args, { stdio: "inherit", cwd });

/* ================================
   Main
================================= */
(async () => {
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
    initial: ["pnpm", "npm", "yarn"].indexOf(detectPackageManager()),
  });

  const installCmd = pm === "pnpm" ? "add" : "install";
  const execCmd = pm;

  const { projectType } = await prompts({
    type: "select",
    name: "projectType",
    message: "Which project type?",
    choices: [
      { title: "React (Web)", value: "react" },
      { title: "React Native", value: "react-native" },
    ],
    initial: 0,
  });

  /* ================================
     Install dev dependencies
  ================================= */
  console.log("📦 Installing dev dependencies...\n");

  await run(execCmd, [
    installCmd,
    "-D",
    "eslint",
    "prettier",
    "husky",
    "lint-staged",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
  ]);

  /* ================================
     Copy config templates
  ================================= */
  console.log("\n📄 Copying config files...\n");

  const templateDir = path.join(__dirname, "../templates", projectType);

  await fs.copy(templateDir, cwd, {
    overwrite: false,
    filter: (src) => !src.includes("husky"),
  });

  /* ================================
     Update package.json
  ================================= */
  console.log("\n🛠 Updating package.json...\n");

  const pkgPath = path.join(cwd, "package.json");
  const pkg = await fs.readJson(pkgPath);

  pkg.scripts ||= {};
  pkg.scripts.prepare = "husky";

  pkg["lint-staged"] ||= {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
  };

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  /* ================================
     Setup Husky (v9 way)
  ================================= */
  console.log("\n🐶 Setting up Husky...\n");

  await run(execCmd, ["run", "prepare"]);

  const huskyDir = path.join(cwd, ".husky");
  const hookPath = path.join(huskyDir, "pre-commit");

  await fs.ensureDir(huskyDir);

  await fs.writeFile(
    hookPath,
    `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

${execCmd} lint-staged
`,
  );

  await execa("chmod", ["+x", hookPath]);

  /* ================================
     Done
  ================================= */
  console.log("\n✅ Code quality setup complete!\n");
  console.log("👉 Try committing a file to test it:");
  console.log('   git add . && git commit -m "test"\n');
})();
