import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "params-naming-convention";

export const enum Messages {
    USE_OBJECT_PARAMETERS = "USE_OBJECT_PARAMETERS",
}

export type Options = [
    Partial<{
        allowedParameters: number;
        ignore: string[];
        ignoreFunctions: string[];
        ignorePrefixes: string[];
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
            "Enforce using a single object parameter for all functions",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/params-naming-convention.md",
    },
    messages: {
        [Messages.USE_OBJECT_PARAMETERS]:
            "NIMA: Function has {{count}} extra parameter(s). Use a prefix for {{params}}, or consolidate all parameters into a single object.",
    },
    schema: [
        {
            additionalProperties: false,
            properties: {
                allowedParameters: {
                    description: "Allowed number of positional parameters",
                    type: "number",
                },
                ignore: {
                    description: "Parameter names to ignore",
                    items: { type: "string" },
                    type: "array",
                },
                ignoreFunctions: {
                    description: "Function names to ignore",
                    items: { type: "string" },
                    type: "array",
                },
                ignorePrefixes: {
                    description: "Prefixes that mark parameters as ignored",
                    items: { type: "string" },
                    type: "array",
                },
            },
            type: "object",
        },
    ],
    type: "problem",
};

export const defaultOptions: Options = [
    {
        allowedParameters: 1,
        ignore: ["e"],
        ignoreFunctions: ["reduce"],
        ignorePrefixes: ["$"],
    },
];
