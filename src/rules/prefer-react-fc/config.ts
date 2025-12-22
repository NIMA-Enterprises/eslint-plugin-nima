import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "prefer-react-fc";

export const enum Messages {
  REQUIRE_REACT_FC = "REQUIRE_REACT_FC",
}

export type Options = [
  Partial<{
    allowArrowFunctions: boolean;
    allowFunctionDeclarations: boolean;
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
      "Enforce React.FC type annotation for React component functions",
    recommended: true,
    url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-react-fc.md",
  },
  fixable: "code",
  messages: {
    [Messages.REQUIRE_REACT_FC]:
      "NIMA: Component functions must use React.FC type annotation.",
  },
  schema: [
    {
      additionalProperties: false,
      properties: {
        allowArrowFunctions: {
          description: "Allow arrow function components",
          type: "boolean",
        },
        allowFunctionDeclarations: {
          description: "Allow function declaration components",
          type: "boolean",
        },
      },
      type: "object",
    },
  ],
  type: "problem",
};

export const defaultOptions: Options = [
  {
    allowArrowFunctions: true,
    allowFunctionDeclarations: true,
  },
];
