import { Messages, Options } from "@models/restrict-function-usage.model";
import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { minimatch } from "minimatch";
import path from "path";

export const name = "restrict-function-usage";

export const rule = ESLintUtils.RuleCreator.withoutDocs<Options, Messages>({
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

    function isFunctionDisabled(fnName: string, filename: string) {
      return options.some((option) => {
        const {
          allowFunctions = [],
          disableFunctions = [],
          files = [],
          folders = [],
        } = option;

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
              messageId: Messages.FUNCTION_DISALLOWED,
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
              messageId: Messages.FUNCTION_DISALLOWED,
              node: callee.property,
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
        "Disallow use of any functions in any files or folders unless explicitly allowed.",
    },
    messages: {
      [Messages.FUNCTION_DISALLOWED]:
        "Do not use {{ fnName }} inside {{ filename }}.",
    },
    schema: [
      {
        items: {
          additionalProperties: false,
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
    ],
    type: "problem",
  },
});
