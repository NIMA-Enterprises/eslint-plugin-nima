import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "restrict-imports";

export const enum Messages {
  IMPORT_DISALLOWED = "IMPORT_DISALLOWED",
}

export type Options = [
  Partial<{
    allowImports: string[];
    disableImports: string[];
    files: string[];
    folders: string[];
    from: string[];
  }>[]
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
      "Disallow use of any imports in any files or folders unless explicitly allowed.",
    recommended: false,
    url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/restrict-imports.md",
  },
  messages: {
    [Messages.IMPORT_DISALLOWED]:
      "Do not import {{ importName }} inside {{ filename }}.",
  },
  schema: [
    {
      description: "List of rule option objects for restricting imports",
      items: {
        additionalProperties: false,
        description:
          "Rule option that configures allowed/disabled imports and file matching",
        properties: {
          allowImports: {
            description: "Imports to allow",
            items: { type: "string" },
            type: "array",
          },
          disableImports: {
            description: "Imports to disable",
            items: { type: "string" },
            type: "array",
          },
          files: {
            description: "Files to match for rule",
            items: { type: "string" },
            type: "array",
          },
          folders: {
            description: "Folders to match for rule",
            items: { type: "string" },
            type: "array",
          },
          from: {
            description: "Source patterns to match (from)",
            items: { type: "string" },
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
