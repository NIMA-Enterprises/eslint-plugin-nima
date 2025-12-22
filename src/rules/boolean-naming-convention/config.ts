import { DEFAULT_PREFIXES } from "@constants/boolean-prefixes";
import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "boolean-naming-convention";

export const enum Messages {
    BAD_FUNCTION_BOOLEAN_PREFIX = "BAD_FUNCTION_BOOLEAN_PREFIX",
    BAD_PARAMETER_BOOLEAN_PREFIX = "BAD_PARAMETER_BOOLEAN_PREFIX",
    BAD_PROPERTY_BOOLEAN_PREFIX = "BAD_PROPERTY_BOOLEAN_PREFIX",
    BAD_VARIABLE_BOOLEAN_PREFIX = "BAD_VARIABLE_BOOLEAN_PREFIX",
}

export type Options = [
    Partial<{
        allowedPrefixes: string[];
        checkFunctions: boolean;
        checkParameters: boolean;
        checkProperties: boolean;
        checkVariables: boolean;
        ignore: string;
    }>,
];

type ExtendedPluginProperties = {
    recommended: boolean;
};

export const config: {
    docs: ExtendedPluginProperties &
        RuleModule<Messages, Options>["meta"]["docs"];
} & Omit<RuleModule<Messages, Options>["meta"], "defaultOptions"> = {
    docs: {
        description:
            "Enforces boolean variables to use appropriate prefixes (is, has, can, should, etc.)",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/boolean-naming-convention.md",
    },
    messages: {
        [Messages.BAD_FUNCTION_BOOLEAN_PREFIX]:
            "NIMA: Function '{{name}}' returns a boolean, use a prefix like {{suggestion}}",
        [Messages.BAD_PARAMETER_BOOLEAN_PREFIX]:
            "NIMA: Boolean parameter '{{name}}' should use a prefix like {{suggestion}}",
        [Messages.BAD_PROPERTY_BOOLEAN_PREFIX]:
            "NIMA: Boolean property '{{name}}' should use a prefix like {{suggestion}}",
        [Messages.BAD_VARIABLE_BOOLEAN_PREFIX]:
            "NIMA: Boolean variable '{{name}}' should use a prefix like {{suggestion}}",
    },
    schema: [
        {
            additionalProperties: false,
            properties: {
                allowedPrefixes: {
                    description:
                        "Allowed boolean name prefixes (is, has, can, etc.)",
                    items: { type: "string" },
                    type: "array",
                },
                checkFunctions: {
                    description: "Check top-level functions",
                    type: "boolean",
                },
                checkParameters: {
                    description: "Check function parameters",
                    type: "boolean",
                },
                checkProperties: {
                    description: "Check object properties",
                    type: "boolean",
                },
                checkVariables: {
                    description: "Check variable declarators",
                    type: "boolean",
                },
                ignore: {
                    description: "Regex string to ignore certain names",
                    type: "string",
                },
            },
            type: "object",
        },
    ],
    type: "suggestion",
};
export const defaultOptions: Options = [
    {
        allowedPrefixes: DEFAULT_PREFIXES,
        checkFunctions: true,
        checkParameters: true,
        checkProperties: true,
        checkVariables: true,
        ignore: "filter",
    },
];
