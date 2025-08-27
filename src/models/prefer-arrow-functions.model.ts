export const enum Messages {
  PREFER_ARROW_FUNCTION_EXPRESSION = "PREFER_ARROW_FUNCTION_EXPRESSION",
  PREFER_ARROW_FUNCTIONS = "PREFER_ARROW_FUNCTIONS",
  PREFER_ARROW_METHOD = "PREFER_ARROW_METHOD",
}

export type Options = [
  Partial<{
    allowAsync: boolean;
    allowConstructors: boolean;
    allowFunctionDeclarations: boolean;
    allowFunctionExpressions: boolean;
    allowGenerators: boolean;
    allowMethodDefinitions: boolean;
  }>
];
