import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "no-objects-in-deps";

export const enum Messages {
    NO_OBJECTS_IN_DEPENDENCIES = "NO_OBJECTS_IN_DEPENDENCIES",
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
        description: "Suggests to not use objects in dependency arrays",
        recommended: false,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-objects-in-deps.md",
    },
    messages: {
        [Messages.NO_OBJECTS_IN_DEPENDENCIES]:
            "NIMA: Objects inside of dependency arrays aren't allowed. Try doing JSON.stringify({{ object }}).",
    },
    schema: [],
    type: "suggestion",
};

export const defaultOptions: Options = [];
