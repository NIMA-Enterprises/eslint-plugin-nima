import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import type { RuleKey } from "../index.js";

export const recommended: {
  [K in RuleKey as `dragonswap/${K}`]?: FlatConfig.RuleLevel;
} = {
  "dragonswap/no-console-error": "error",
  "dragonswap/no-console-log": "error",
  "dragonswap/no-console-warn": "error",
  "dragonswap/no-handler-suffix": "error",
  "dragonswap/prefer-react-fc": "warn",
};
