#!/usr/bin/env node
import fs from "fs-extra";
import { execa } from "execa";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";

/* ================================
   Paths
================================= */
const cwd = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================================
   Deps
================================= */
const commonDeps = [
  "eslint",
  "prettier",
  "husky",
  "lint-staged",
  "eslint-config-prettier",
  "eslint-plugin-prettier",
];

const reactNativeDeps = [
  "eslint-plugin-react-hooks",
  "typescript-eslint",
  "globals",
];

/* ================================
   Utils
================================= */
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

  /* ---------- package manager ---------- */
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

  if (!pm) process.exit(0);

  const installCmd = pm === "pnpm" || pm === "yarn" ? "add" : "install";
  const execCmd = pm;

  /* ---------- project type ---------- */
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

  if (!projectType) process.exit(0);

  /* ---------- install deps ---------- */
  console.log("\n📦 Installing dev dependencies...\n");

  await run(execCmd, [installCmd, "-D", ...commonDeps]);

  if (projectType === "react-native") {
    console.log("📱 Installing React Native ESLint deps...\n");
    await run(execCmd, [installCmd, "-D", ...reactNativeDeps]);
  }

  /* ---------- copy templates ---------- */
  console.log("\n📄 Copying config files...\n");

  const templateDir = path.join(__dirname, "../templates", projectType);

  await fs.copy(templateDir, cwd, {
    overwrite: false,
    filter: (src) => !src.includes("husky"),
  });

  /* ---------- package.json ---------- */
  console.log("\n🛠 Updating package.json...\n");

  const pkgPath = path.join(cwd, "package.json");

  if (!(await fs.pathExists(pkgPath))) {
    console.error("❌ package.json not found. Run this inside a project.");
    process.exit(1);
  }

  const pkg = await fs.readJson(pkgPath);

  pkg.scripts ||= {};
  pkg.scripts.prepare = "husky install";

  pkg["lint-staged"] ||= {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
  };

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  /* ---------- husky ---------- */
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

  /* ---------- done ---------- */
  console.log("\n✅ Code quality setup complete!\n");
  console.log("👉 Try committing a file to test it:");
  console.log('   git add . && git commit -m "test"\n');
})();
