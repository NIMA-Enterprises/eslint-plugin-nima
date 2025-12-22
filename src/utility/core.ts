import { ESLintUtils } from "@typescript-eslint/utils";

type ExtendedPluginProperties = {
    recommended: boolean;
};

export const createRule = ESLintUtils.RuleCreator<ExtendedPluginProperties>(
    (name) =>
        `https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/${name}.md`
);
