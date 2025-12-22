import { Messages, Options } from "@models/restrict-imports.model";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";
import { isFileMatched } from "@utility/file-helpers";
import { minimatch } from "minimatch";

export const name = "restrict-imports";

export const rule = createRule<Options, Messages>({
  create: (context, [options = []]) => {
    // use shared isFileMatched helper from utilities

    const isImportDisabled = ({
      filename,
      importName,
      importSource,
    }: {
      filename: string;
      importName: string;
      importSource: string;
    }) => {
      return options.some((option) => {
        const {
          allowImports = [],
          disableImports = [],
          files = [],
          folders = [],
          from = [],
        } = option;

        const hasFromRestriction = from.length > 0;
        if (hasFromRestriction) {
          const isSourceMatches = from.some((pattern) =>
            minimatch(importSource, pattern)
          );
          if (!isSourceMatches) {
            return false;
          }
        }

        let isAppliesToFile = false;
        isAppliesToFile =
          files.length === 0 && folders.length === 0
            ? true
            : isFileMatched({ filename, files, folders });

        if (allowImports.length > 0) {
          const isImportInAllowList = allowImports.some(
            (imp) => imp.toLowerCase() === importName.toLowerCase()
          );

          if (isImportInAllowList) {
            return files.length === 0 && folders.length === 0
              ? false
              : !isAppliesToFile;
          }
          return false;
        }

        if (!isAppliesToFile) {
          return false;
        }

        if (
          disableImports.some(
            (imp) => imp.toLowerCase() === importName.toLowerCase()
          )
        ) {
          return true;
        }

        return false;
      });
    };

    return {
      ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
        const filename = context.filename;
        const importSource =
          typeof node.source.value === "string" ? node.source.value : "";

        for (const specifier of node.specifiers) {
          let importName: string;

          switch (specifier.type) {
            case AST_NODE_TYPES.ImportDefaultSpecifier: {
              importName = specifier.local.name;

              break;
            }
            case AST_NODE_TYPES.ImportNamespaceSpecifier: {
              importName = specifier.local.name;

              break;
            }
            case AST_NODE_TYPES.ImportSpecifier: {
              importName =
                specifier.imported.type === AST_NODE_TYPES.Identifier
                  ? specifier.imported.name
                  : specifier.imported.value;

              break;
            }
            default: {
              continue;
            }
          }

          if (
            isImportDisabled({
              filename,
              importName: importName.toLowerCase(),
              importSource,
            })
          ) {
            context.report({
              data: { filename, importName },
              messageId: Messages.IMPORT_DISALLOWED,
              node: specifier,
            });
          }
        }
      },
    };
  },
  defaultOptions: [[]],
  meta: {
    defaultOptions: [[]],
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
  },
  name,
});
