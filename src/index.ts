import type {
  FlatConfig,
  RuleModule,
} from "@typescript-eslint/utils/ts-eslint";
import type { ESLint, Linter } from "eslint";

import * as BooleanNamingConvention from "@rules/boolean-naming-convention";
import * as NoHandlerSuffix from "@rules/no-handler-suffix";
import * as NoObjectsInDeps from "@rules/no-objects-in-deps";
import * as ParamsNamingConvention from "@rules/params-naming-convention";
import * as PreferArrowFunctions from "@rules/prefer-arrow-functions";
import * as PreferNamedExport from "@rules/prefer-export-under-component";
import * as PreferReactFc from "@rules/prefer-react-fc";
import * as PreferReactWithHooks from "@rules/prefer-react-with-hooks";
import * as PreferVoidForOptionalParam from "@rules/prefer-void-for-optional-param";
import * as RestrictConsoleMethods from "@rules/restrict-console-methods";
import * as ManageFunctions from "@rules/restrict-function-usage";
import * as RestrictImports from "@rules/restrict-imports";

const rules = {
  [BooleanNamingConvention.name]: BooleanNamingConvention.rule,
  [ManageFunctions.name]: ManageFunctions.rule,
  [NoHandlerSuffix.name]: NoHandlerSuffix.rule,
  [NoObjectsInDeps.name]: NoObjectsInDeps.rule,
  [ParamsNamingConvention.name]: ParamsNamingConvention.rule,
  [PreferArrowFunctions.name]: PreferArrowFunctions.rule,
  [PreferNamedExport.name]: PreferNamedExport.rule,
  [PreferReactFc.name]: PreferReactFc.rule,
  [PreferReactWithHooks.name]: PreferReactWithHooks.rule,
  [PreferVoidForOptionalParam.name]: PreferVoidForOptionalParam.rule,
  [RestrictConsoleMethods.name]: RestrictConsoleMethods.rule,
  [RestrictImports.name]: RestrictImports.rule,
};

interface Plugin extends Omit<ESLint.Plugin, "rules"> {
  configs: {
    "flat/recommended": Linter.Config;
    recommended: ESLint.ConfigData;
  };
  rules: Record<RuleKey, RuleModule<any, any, any>>;
}

type RuleKey = keyof typeof rules;

const plugin = {
  configs: {} as Plugin["configs"],

  meta: {
    name: "eslint-plugin-nima",
  },

  rules,
};

const recommended: {
  [K in RuleKey as `nima/${K}`]?: FlatConfig.RuleLevel;
} = {
  "nima/no-handler-suffix": "error",
  "nima/prefer-export-under-component": "error",
  "nima/prefer-react-fc": "warn",
  "nima/restrict-console-methods": "error",
};

Object.assign(plugin.configs, {
  "flat/recommended": {
    plugins: {
      nima: plugin,
    },
    rules: recommended,
  },
  recommended: {
    plugins: ["nima"],
    rules: recommended,
  },
});

export = plugin;
