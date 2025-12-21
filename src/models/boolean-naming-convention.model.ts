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
    // ignore: a regex string to match identifier names that should be ignored
    // Example: "filter" will match any identifier containing 'filter' (case-insensitive if used that way in rule)
    ignore: string;
  }>
];
