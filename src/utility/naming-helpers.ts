import type { Scope } from "@typescript-eslint/utils/ts-eslint";

export const generateBooleanSuggestion = (name: string) => {
    return `is${name.charAt(0).toUpperCase()}${name.slice(1)}`;
};

export const generateUniqueName = ({
    base,
    scope,
}: {
    base: string;
    scope: Scope.Scope;
}) => {
    let candidate = base;
    let index = 2;
    const existingNames = new Set(scope.variables.map((v) => v.name));
    while (existingNames.has(candidate)) {
        candidate = `${base}${index++}`;
    }
    return candidate;
};
