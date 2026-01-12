import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "restrict-optional-call-expression";

export const enum Messages {
    BAD_CALL_EXPRESSION = "BAD_CALL_EXPRESSION",
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
            "Restricts the use of optional chaining in call expressions.",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/restrict-optional-call-expression.md",
    },
    messages: {
        [Messages.BAD_CALL_EXPRESSION]:
            "NIMA: Avoid using optional chaining on call expressions.",
    },
    schema: [],
    type: "suggestion",
};
export const defaultOptions: Options = [];
