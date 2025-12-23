import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "restrict-function-usage";

export const enum Messages {
    FUNCTION_DISALLOWED = "FUNCTION_DISALLOWED",
}

export type Options = [
    Partial<{
        allowFunctions: string[];
        disableFunctions: string[];
        files: string[];
        folders: string[];
    }>[],
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
            "Disallow use of any functions in any files or folders unless explicitly allowed.",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/restrict-function-usage.md",
    },
    messages: {
        [Messages.FUNCTION_DISALLOWED]:
            "NIMA: Do not use {{ fnName }} inside {{ filename }}.",
    },
    schema: [
        {
            description:
                "List of rule option objects for restricting function usage",
            items: {
                additionalProperties: false,
                description:
                    "Rule option that configures allow/disable lists and file matching",
                properties: {
                    allowFunctions: {
                        description: "Functions to explicitly allow",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    disableFunctions: {
                        description: "Functions to disable",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    files: {
                        description: "Files glob list to apply rule",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                    folders: {
                        description: "Folders glob list to apply rule",
                        items: {
                            type: "string",
                        },
                        type: "array",
                    },
                },
                type: "object",
            },
            type: "array",
        },
    ],
    type: "problem",
};

export const defaultOptions: Options = [[]];
