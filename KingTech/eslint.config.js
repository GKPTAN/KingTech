import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_|^search$|^event$|^e$",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "type",
            ["parent", "sibling"],
            "index",
            "object",
          ],
          pathGroups: [
            // Bloco 1: React e Externos
            {
              pattern: "react/**",
              group: "builtin",
              position: "before",
            },
            // Bloco 2: Internos - Lógica
            {
              pattern: "@/hooks/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/utils/**",
              group: "internal",
            },
            {
              pattern: "@/config/**",
              group: "internal",
            },
            {
              pattern: "@/services/**",
              group: "internal",
            },
            {
              pattern: "@/context/**",
              group: "internal",
              position: "after",
            },
            // Tipos
            {
              pattern: "@/types/**",
              group: "type",
              position: "before",
            },
            // Bloco 3: Internos - UI (Componentes)
            {
              pattern: "@/components/**",
              group: "parent",
              position: "before",
            },
            // Bloco 4: Assets & Estilos
            {
              pattern: "@/data/**",
              group: "object",
              position: "before",
            },
            {
              pattern: "@/**/*.{svg,png,jpg,jpeg,gif,webp,avif,mp3,mp4,webm,wav}",
              group: "object",
            },
            {
              pattern: "@/**/*.{css,scss,sass,module.css,module.scss}",
              group: "object",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "type"],
          "newlines-between": "always",
        },
      ],
    },
  },
];
