import { Messages, Options } from "@models/restrict-imports.model";
import { TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";
import { minimatch } from "minimatch";
import path from "path";

export const name = "restrict-imports";

export const rule = createRule<Options, Messages>({
  create(context, [options = []]) {
    function isFileMatched(
      filename: string,
      folders: string[],
      files: string[]
    ) {
      const dir = path.dirname(filename);
      const base = path.basename(filename);

      const hasFolders = folders.length > 0;
      const hasFiles = files.length > 0;

      if (!hasFolders && !hasFiles) {
        return false;
      }

      if (hasFolders && hasFiles) {
        const folderMatch = folders.some((f) => minimatch(dir, f));
        const fileMatch = files.some((f) => minimatch(base, f));
        return folderMatch && fileMatch;
      }

      if (hasFolders && !hasFiles) {
        return folders.some((f) => minimatch(dir, f));
      }

      if (!hasFolders && hasFiles) {
        return files.some((f) => minimatch(base, f));
      }

      return false;
    }

    function isImportDisabled(importName: string, filename: string) {
      return options.some((option) => {
        const {
          allowImports = [],
          disableImports = [],
          files = [],
          folders = [],
        } = option;

        let appliesToFile = false;
        if (files.length === 0 && folders.length === 0) {
          appliesToFile = true;
        } else {
          appliesToFile = isFileMatched(filename, folders, files);
        }

        if (allowImports.length > 0) {
          const importIsInAllowList = allowImports.some(
            (imp) => imp.toLowerCase() === importName.toLowerCase()
          );

          if (importIsInAllowList) {
            if (files.length === 0 && folders.length === 0) {
              return false;
            } else {
              return !appliesToFile;
            }
          }
          return false;
        }

        if (!appliesToFile) {
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
    }

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        const filename = context.filename;

        for (const specifier of node.specifiers) {
          let importName: string;

          if (specifier.type === "ImportSpecifier") {
            importName =
              specifier.imported.type === "Identifier"
                ? specifier.imported.name
                : specifier.imported.value;
          } else if (specifier.type === "ImportDefaultSpecifier") {
            importName = specifier.local.name;
          } else if (specifier.type === "ImportNamespaceSpecifier") {
            importName = specifier.local.name;
          } else {
            continue;
          }

          if (isImportDisabled(importName.toLowerCase(), filename)) {
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
        items: {
          additionalProperties: false,
          properties: {
            allowImports: { items: { type: "string" }, type: "array" },
            disableImports: { items: { type: "string" }, type: "array" },
            files: { items: { type: "string" }, type: "array" },
            folders: { items: { type: "string" }, type: "array" },
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
