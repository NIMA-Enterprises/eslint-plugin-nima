import type { RuleModule } from "@typescript-eslint/utils/ts-eslint";
import type { ESLint, Linter } from "eslint";

import { recommended } from "./configs/recommended.js";
import * as BooleanNamingConvention from "./rules/boolean-naming-convention.js";
import * as NoConsoleLog from "./rules/no-console-log.js";
import * as NoConsoleWarn from "./rules/no-console-warn.js";
import * as NoConsoleError from "./rules/no-console.error.js";
import * as NoHandlerSuffix from "./rules/no-handler-suffix.js";
import * as NoObjectsInDeps from "./rules/no-objects-in-deps.js";
import * as ParamsNamingConvention from "./rules/params-naming-convention.js";
import * as PreferArrowFunctions from "./rules/prefer-arrow-functions.js";
import * as PreferReactFc from "./rules/prefer-react-fc.js";
import * as PreferReactWithHooks from "./rules/prefer-react-with-hooks.js";

const rules = {
  [BooleanNamingConvention.name]: BooleanNamingConvention.rule,
  [NoConsoleError.name]: NoConsoleError.rule,
  [NoConsoleLog.name]: NoConsoleLog.rule,
  [NoConsoleWarn.name]: NoConsoleWarn.rule,
  [NoHandlerSuffix.name]: NoHandlerSuffix.rule,
  [NoObjectsInDeps.name]: NoObjectsInDeps.rule,
  [ParamsNamingConvention.name]: ParamsNamingConvention.rule,
  [PreferArrowFunctions.name]: PreferArrowFunctions.rule,
  [PreferReactFc.name]: PreferReactFc.rule,
  [PreferReactWithHooks.name]: PreferReactWithHooks.rule,
};

export type RuleKey = keyof typeof rules;

interface Plugin extends Omit<ESLint.Plugin, "rules"> {
  configs: {
    "flat/recommended": Linter.Config;
    recommended: ESLint.ConfigData;
  };
  rules: Record<RuleKey, RuleModule<any, any, any>>;
}

const plugin = {
  configs: {} as Plugin["configs"],

  meta: {
    name: "eslint-plugin-dragonswap",
  },

  rules,
};

Object.assign(plugin.configs, {
  "flat/recommended": {
    plugins: {
      dragonswap: plugin,
    },
    rules: recommended,
  },
  recommended: {
    plugins: ["dragonswap"],
    rules: recommended,
  },
});

export default plugin;
