import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.base.json"]
      }
    },
    plugins: {
      "@typescript-eslint": eslintPluginTs
    },
    rules: {
      ...eslintPluginTs.configs["recommended-type-checked"].rules,
      "@typescript-eslint/explicit-module-boundary-types": "off"
    }
  },
  prettier
];

