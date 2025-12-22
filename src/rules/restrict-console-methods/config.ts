import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "restrict-console-methods";

export const enum Messages {
  NO_CONSOLE = "NO_CONSOLE",
}

export type Options = [
  Partial<{
    allow: string[];
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
    description: "Restrict the usage of console in the codebase",
    recommended: true,
    url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/restrict-console-methods.md",
  },
  messages: {
    [Messages.NO_CONSOLE]:
      "NIMA: The usage of console.{{ console }} is restricted.",
  },
  schema: [
    {
      additionalProperties: false,
      properties: {
        allow: {
          description: "List of console methods to allow",
          items: { type: "string" },
          type: "array",
        },
      },
      type: "object",
    },
  ],
  type: "suggestion",
};

export const defaultOptions: Options = [
  {
    allow: ["info"],
  },
];
