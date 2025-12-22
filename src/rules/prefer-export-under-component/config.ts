import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "prefer-export-under-component";

export const enum Messages {
    EXPORT_BELOW_COMPONENT = "EXPORT_BELOW_COMPONENT",
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
            "Enforce separate declaration and export for React components",
        recommended: true,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-export-under-component.md",
    },
    fixable: "code",
    messages: {
        [Messages.EXPORT_BELOW_COMPONENT]:
            "NIMA: Declare React component '{{ fnName }}' separately from its export statement",
    },
    schema: [],
    type: "problem",
};

export const defaultOptions: Options = [];
