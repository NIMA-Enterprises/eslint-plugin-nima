import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-handler-suffix";

export const enum Messages {
    BAD_HANDLER_NAME = "BAD_HANDLER_NAME",
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
        description: "Suggests to use handleFn instead of fnHandler",
        recommended: true,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-handler-suffix.md",
    },
    fixable: "code",
    messages: {
        [Messages.BAD_HANDLER_NAME]:
            "NIMA: Use the handle prefix instead of handler suffix ({{ fnWithGoodName }}).",
    },
    schema: [],
    type: "problem",
};

export const defaultOptions: Options = [];
