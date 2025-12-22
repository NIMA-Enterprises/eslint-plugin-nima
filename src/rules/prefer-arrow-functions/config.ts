import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "prefer-arrow-functions";

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

type ExtendedPluginProperties = {
  recommended: boolean;
};

export const config: {
  docs: ExtendedPluginProperties &
    RuleModule<Messages, Options>["meta"]["docs"];
} & Omit<RuleModule<Messages, Options>["meta"], "defaultOptions"> = {
  docs: {
    description:
      "Prefer arrow functions over function declarations and expressions",
    recommended: true,
    url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-arrow-functions.md",
  },
  fixable: "code",
  messages: {
    [Messages.PREFER_ARROW_FUNCTION_EXPRESSION]:
      "NIMA: Prefer arrow functions over function expressions.",
    [Messages.PREFER_ARROW_FUNCTIONS]:
      "NIMA: Prefer arrow functions over function declarations.",
    [Messages.PREFER_ARROW_METHOD]:
      "NIMA: Prefer arrow functions over method definitions.",
  },
  schema: [
    {
      additionalProperties: false,
      properties: {
        allowAsync: {
          description:
            "Allow async functions (they can still be arrow functions)",
          type: "boolean",
        },
        allowConstructors: {
          description: "Allow constructor functions",
          type: "boolean",
        },
        allowFunctionDeclarations: {
          description: "Allow function declarations (function name() {})",
          type: "boolean",
        },
        allowFunctionExpressions: {
          description:
            "Allow function expressions (const name = function() {})",
          type: "boolean",
        },
        allowGenerators: {
          description: "Allow generator functions",
          type: "boolean",
        },
        allowMethodDefinitions: {
          description: "Allow method definitions in classes and objects",
          type: "boolean",
        },
      },
      type: "object",
    },
  ],
  type: "suggestion",
};

export const defaultOptions: Options = [
  {
    allowAsync: true,
    allowConstructors: true,
    allowFunctionDeclarations: false,
    allowFunctionExpressions: false,
    allowGenerators: true,
    allowMethodDefinitions: false,
  },
];
