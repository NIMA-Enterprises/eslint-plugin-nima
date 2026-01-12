import type {
    FlatConfig,
    RuleModule,
} from "@typescript-eslint/utils/ts-eslint";
import type { ESLint, Linter } from "eslint";

import {
    BooleanNamingConvention,
    NoHandlerSuffix,
    NoObjectsInDeps,
    NoOptionalCallExpression,
    ParamsNamingConvention,
    PreferArrowFunctions,
    PreferExportUnderComponent,
    PreferReactFc,
    PreferReactWithHooks,
    PreferVoidForOptionalParam,
    RestrictConsoleMethods,
    RestrictFunctionUsage,
    RestrictImports,
} from "./rules";

const rules = {
    [BooleanNamingConvention.name]: BooleanNamingConvention.rule,
    [NoHandlerSuffix.name]: NoHandlerSuffix.rule,
    [NoObjectsInDeps.name]: NoObjectsInDeps.rule,
    [NoOptionalCallExpression.name]: NoOptionalCallExpression.rule,
    [ParamsNamingConvention.name]: ParamsNamingConvention.rule,
    [PreferArrowFunctions.name]: PreferArrowFunctions.rule,
    [PreferExportUnderComponent.name]: PreferExportUnderComponent.rule,
    [PreferReactFc.name]: PreferReactFc.rule,
    [PreferReactWithHooks.name]: PreferReactWithHooks.rule,
    [PreferVoidForOptionalParam.name]: PreferVoidForOptionalParam.rule,
    [RestrictConsoleMethods.name]: RestrictConsoleMethods.rule,
    [RestrictFunctionUsage.name]: RestrictFunctionUsage.rule,
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
