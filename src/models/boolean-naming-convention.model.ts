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
  }>
];
