import type { RuleModule } from "@typescript-eslint/utils/ts-eslint";
import type { ESLint, Linter } from "eslint";

import { recommended } from "./configs/recommended.js";
import * as BooleanNamingConvention from "./rules/boolean-naming-convention.js";
import * as NoHandlerSuffix from "./rules/no-handler-suffix.js";
import * as NoObjectsInDeps from "./rules/no-objects-in-deps.js";
import * as ParamsNamingConvention from "./rules/params-naming-convention.js";
import * as PreferArrowFunctions from "./rules/prefer-arrow-functions.js";
import * as PreferReactFc from "./rules/prefer-react-fc.js";
import * as PreferReactWithHooks from "./rules/prefer-react-with-hooks.js";
import * as RestrictConsoleMethods from "./rules/restrict-console-methods.js";

const rules = {
  [BooleanNamingConvention.name]: BooleanNamingConvention.rule,
  [NoHandlerSuffix.name]: NoHandlerSuffix.rule,
  [NoObjectsInDeps.name]: NoObjectsInDeps.rule,
  [ParamsNamingConvention.name]: ParamsNamingConvention.rule,
  [PreferArrowFunctions.name]: PreferArrowFunctions.rule,
  [PreferReactFc.name]: PreferReactFc.rule,
  [PreferReactWithHooks.name]: PreferReactWithHooks.rule,
  [RestrictConsoleMethods.name]: RestrictConsoleMethods.rule,
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
