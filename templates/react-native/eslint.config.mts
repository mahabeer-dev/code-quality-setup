import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  // 1️⃣ TS recommended FIRST
  ...tseslint.configs.recommended,

  // 2️⃣ React Hooks (RN needs this)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // 3️⃣ Ignore junk
  {
    ignores: [
      "**/node_modules/**",
      "**/Pods/**",
      "**/build/**",
      "**/dist/**",
      "**/.expo/**",
      "**/android/**",
      "**/ios/**",
      "*.config.js",
      "*.config.ts",
      ".prettierrc.*",
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
      "react-native.config.js",
    ],
  },

  // 4️⃣ JS / JSX (RN runtime files)
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        __DEV__: "readonly",
        require: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,

      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",

      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-var": "warn",
      "prefer-const": "warn",
      "no-case-declarations": "off",
    },
  },

  // 5️⃣ TS / TSX (RN-friendly)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        __DEV__: "readonly",
        require: "readonly",
      },
    },
    rules: {
      ...prettier.rules,

      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",

      "no-var": "error",
      "prefer-const": "error",
      "no-case-declarations": "off",
    },
  },

  // 6️⃣ Image registry override (RN real-world fix)
  {
    files: ["src/**/Images.{js,ts}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
);
