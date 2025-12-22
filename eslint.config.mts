import { defineConfig } from "eslint/config";
import pluginPerfectionist from "eslint-plugin-perfectionist";
import globals from "globals";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import nimaPlugin from "eslint-plugin-nima";
import unicornPlugin from "eslint-plugin-unicorn";
import eslintPluginPlugin from "eslint-plugin-eslint-plugin";

export default defineConfig([
  pluginPerfectionist.configs["recommended-alphabetical"],
  ...tseslint.configs.recommendedTypeChecked,
  unicornPlugin.configs.unopinionated,
  eslintPluginPlugin.configs.recommended,
  nimaPlugin.configs["flat/recommended"],

  {
    files: ["**/*.{ts,tsx}"],

    plugins: {
      "unused-imports": unusedImportsPlugin,
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      // "nima/boolean-naming-convention": [
      //   "error",
      //   {
      //     ignore: "recommended|check*|additionalProperties",
      //   },
      // ],
      "nima/no-handler-suffix": "error",
      "nima/no-objects-in-deps": "error",
      "nima/params-naming-convention": [
        "error",
        {
          ignore: ["context", "options"],
        },
      ],
      "nima/prefer-arrow-functions": "error",
      "nima/prefer-export-under-component": "error",
      "nima/prefer-react-fc": "warn",
      "nima/prefer-react-with-hooks": "warn",
      "nima/prefer-void-for-optional-param": "error",
      "nima/restrict-console-methods": "error",
      "nima/restrict-function-usage": "error",
      "nima/restrict-imports": "error",
    },

    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  { ignores: ["**/dist/**", "*.config.*", "**/tests/**"] },
]);
