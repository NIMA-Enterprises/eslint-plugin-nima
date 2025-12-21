import { Messages, Options } from "@models/restrict-function-usage.model";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";
import { isFileMatched } from "@utility/file-helpers";

export const name = "restrict-function-usage";

export const rule = createRule<Options, Messages>({
  create: (context, [options = []]) => {
    // use shared isFileMatched helper from utilities

    const isFunctionDisabled = ({
      filename,
      fnName,
    }: {
      filename: string;
      fnName: string;
    }) => {
      return options.some((option) => {
        const {
          allowFunctions = [],
          disableFunctions = [],
          files = [],
          folders = [],
        } = option;

        let isAppliesToFile = false;
        isAppliesToFile =
          files.length === 0 && folders.length === 0
            ? true
            : isFileMatched({ filename, files, folders });

        if (allowFunctions.length > 0) {
          const isFunctionInAllowList = allowFunctions.some(
            (fn) => fn.toLowerCase() === fnName.toLowerCase()
          );

          if (isFunctionInAllowList) {
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
          disableFunctions.some(
            (fn) => fn.toLowerCase() === fnName.toLowerCase()
          )
        ) {
          return true;
        }

        return false;
      });
    };

    return {
      CallExpression: (node: TSESTree.CallExpression) => {
        const callee = node.callee;
        const filename = context.filename;

        if (callee.type === AST_NODE_TYPES.Identifier) {
          if (
            isFunctionDisabled({ filename, fnName: callee.name.toLowerCase() })
          ) {
            context.report({
              data: { filename, fnName: callee.name },
              messageId: Messages.FUNCTION_DISALLOWED,
              node: callee,
            });
          }
        } else if (
          callee.type === AST_NODE_TYPES.MemberExpression &&
          callee.property.type === AST_NODE_TYPES.Identifier &&
          isFunctionDisabled({
            filename,
            fnName: callee.property.name.toLowerCase(),
          })
        ) {
          context.report({
            data: { filename, fnName: callee.property.name },
            messageId: Messages.FUNCTION_DISALLOWED,
            node: callee.property,
          });
        }
      },
    };
  },
  defaultOptions: [[]],
  meta: {
    defaultOptions: [[]],
    docs: {
      description:
        "Disallow use of any functions in any files or folders unless explicitly allowed.",
      recommended: false,
      url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/restrict-function-usage.md",
    },
    messages: {
      [Messages.FUNCTION_DISALLOWED]:
        "Do not use {{ fnName }} inside {{ filename }}.",
    },
    schema: [
      {
        description:
          "List of rule option objects for restricting function usage",
        items: {
          additionalProperties: false,
          description:
            "Rule option that configures allow/disable lists and file matching",
          properties: {
            allowFunctions: {
              description: "Functions to explicitly allow",
              items: { type: "string" },
              type: "array",
            },
            disableFunctions: {
              description: "Functions to disable",
              items: { type: "string" },
              type: "array",
            },
            files: {
              description: "Files glob list to apply rule",
              items: { type: "string" },
              type: "array",
            },
            folders: {
              description: "Folders glob list to apply rule",
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
