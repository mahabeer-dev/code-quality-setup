# code-quality-setup

[![npm version](https://img.shields.io/npm/v/code-quality-setup.svg)](https://www.npmjs.com/package/code-quality-setup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/code-quality-setup.svg)](https://www.npmjs.com/package/code-quality-setup)

> 🚀 Instantly set up ESLint, Prettier, Husky, and lint-staged for your Node.js projects with a single command.

**code-quality-setup** is a CLI tool that automates the tedious process of configuring code quality tools. It installs necessary dependencies and creates configuration files to ensure your code is linted and formatted before every commit.

## ✨ Features

- **One-Command Setup**: No more copy-pasting config files or running multiple install commands.
- **ESLint**: configured with recommended rules and Prettier integration to catch errors.
- **Prettier**: configured for consistent code formatting.
- **Husky**: sets up Git hooks to run scripts before committing.
- **Lint-Staged**: ensures only staged files are linted and formatted, keeping commits clean and fast.
- **Package Manager Support**: Works seamlessly with `npm`, `pnpm`, and `yarn`.

## 📦 Installation & Usage

You don't need to install this package globally. You can run it directly using `npx`:

### Quick Start

Run the following command in the root of your project:

```bash
npx code-quality-setup
```

You will be prompted to select your preferred package manager (npm, pnpm, or yarn). The tool will handle the rest!

### Global Install (Optional)

If you prefer to install it globally:

```bash
npm install -g code-quality-setup
```

Then run:

```bash
code-quality-setup
```

## 🛠 What's Included?

Running this tool will:

1.  **Install Dev Dependencies**:
    - `eslint`
    - `prettier`
    - `husky`
    - `lint-staged`
    - `eslint-config-prettier`
    - `eslint-plugin-prettier`

2.  **Create Configuration Files**:
    - `.eslintrc.json`: Basic ESLint configuration extending `eslint:recommended` and `prettier`.
    - `.prettierrc`: Standard Prettier configuration.
    - `.prettierignore`: Ignores `node_modules`, `dist`, etc.
    - `.lintstagedrc`: Configures lint-staged to run ESLint and Prettier on supported files.
    - `.husky/pre-commit`: Sets up the pre-commit hook to run `lint-staged`.

3.  **Configure Git Hooks**:
    - Initializes Husky.
    - Adds a pre-commit hook that runs `lint-staged`.

## ⚙️ Configuration

After running the setup, you can customize the configuration files to suit your project's needs.

- **ESLint**: Edit `.eslintrc.json` to add more rules or plugins (e.g., for React or TypeScript).
- **Prettier**: Edit `.prettierrc` to change formatting rules.
- **Lint-Staged**: Edit `.lintstagedrc` to adjust which files are checked or which commands are run.

## 📋 Prerequisites

- **Node.js**: Version 14 or higher.
- **Git**: Your project must be initialized as a git repository (`git init`) for Husky to work.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
