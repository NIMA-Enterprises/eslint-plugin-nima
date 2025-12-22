import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "prefer-void-for-optional-param";

export const enum Messages {
    ADD_VOID_UNION = "ADD_VOID_UNION",
    PREFER_VOID_FOR_OPTIONAL_PARAM = "PREFER_VOID_FOR_OPTIONAL_PARAM",
}

export type Options = [];

type ExtendedPluginProperties = {
    recommended: boolean;
};

export const config: {
    docs: ExtendedPluginProperties &
        RuleModule<Messages, Options>["meta"]["docs"];
} & Omit<RuleModule<Messages, Options>["meta"], "defaultOptions"> = {
    docs: {
        description:
            "Enforce void union type for optional parameters and destructure them in the function body",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-void-for-optional-param.md",
    },
    fixable: "code",
    messages: {
        [Messages.ADD_VOID_UNION]:
            "NIMA: Destructure parameters inside function body and add | void to the parameter type.",
        [Messages.PREFER_VOID_FOR_OPTIONAL_PARAM]:
            "NIMA: Destructure parameters inside function body with ?? {} instead of in parameter list.",
    },
    schema: [],
    type: "suggestion",
};

export const defaultOptions: Options = [];
