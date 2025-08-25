import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import type { RuleKey } from "../index.js";

export const recommended: {
  [K in RuleKey as `dragonswap/${K}`]?: FlatConfig.RuleLevel;
} = {
  "dragonswap/no-handler-suffix": "error",
  "dragonswap/prefer-react-fc": "warn",
  "dragonswap/restrict-console-methods": "error",
};
