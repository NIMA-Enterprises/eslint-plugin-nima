import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { minimatch } from "minimatch";
import path from "path";

type ManageFunctionsOption = {
  options: {
    allowFunctions?: string[];
    disableFunctions?: string[];
    files?: string[];
    folders?: string[];
  }[];
}[];

export const name = "manage-functions";

export const rule = ESLintUtils.RuleCreator.withoutDocs<
  ManageFunctionsOption,
  "noOptional"
>({
  create(context, options) {
    const allOptions = options[0]?.options || [];

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

    function isFunctionDisabled(fnName: string, filename: string) {
      return allOptions.some((option) => {
        const disableFunctions = option.disableFunctions || [];
        const allowFunctions = option.allowFunctions || [];
        const folders = option.folders || [];
        const files = option.files || [];

        let appliesToFile = false;
        if (files.length === 0 && folders.length === 0) {
          appliesToFile = true;
        } else {
          appliesToFile = isFileMatched(filename, folders, files);
        }

        if (allowFunctions.length > 0) {
          const functionIsInAllowList = allowFunctions.some(
            (fn) => fn.toLowerCase() === fnName.toLowerCase()
          );

          if (functionIsInAllowList) {
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
          disableFunctions.some(
            (fn) => fn.toLowerCase() === fnName.toLowerCase()
          )
        ) {
          return true;
        }

        return false;
      });
    }

    return {
      CallExpression(node: TSESTree.CallExpression) {
        const callee = node.callee;
        const filename = context.filename;

        if (callee.type === "Identifier") {
          if (isFunctionDisabled(callee.name.toLowerCase(), filename)) {
            context.report({
              data: { filename, fnName: callee.name },
              messageId: "noOptional",
              node: callee,
            });
          }
        } else if (
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier"
        ) {
          if (
            isFunctionDisabled(callee.property.name.toLowerCase(), filename)
          ) {
            context.report({
              data: { filename, fnName: callee.property.name },
              messageId: "noOptional",
              node: callee.property,
            });
          }
        }
      },
    };
  },
  defaultOptions: [
    {
      options: [
        {
          allowFunctions: [],
          disableFunctions: [],
          files: [],
          folders: [],
        },
      ],
    },
  ],
  meta: {
    docs: {
      description:
        "Disallow use of any functions in any files or folders unless explicitly allowed.",
    },
    messages: {
      noOptional: "Do not use {{ fnName }} inside {{ filename }}.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          options: {
            items: {
              properties: {
                allowFunctions: { items: { type: "string" }, type: "array" },
                disableFunctions: { items: { type: "string" }, type: "array" },
                files: { items: { type: "string" }, type: "array" },
                folders: { items: { type: "string" }, type: "array" },
              },
              type: "object",
            },
            type: "array",
          },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
});
