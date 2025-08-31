import { CONSOLES } from "@constants/consoles";
import { Messages, type Options } from "@models/restrict-console-methods.model";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";

export const name = "restrict-console-methods";

export const rule = createRule<Options, Messages>({
  create(context, [options]) {
    const {
      allowConsoleError = false,
      allowConsoleLog = false,
      allowConsoleWarn = false,
    } = options;

    return {
      CallExpression(node) {
        if (
          node.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.callee.object.type === AST_NODE_TYPES.Identifier &&
          node.callee.object.name === "console" &&
          node.callee.property.type === AST_NODE_TYPES.Identifier
        ) {
          const methodName = node.callee.property.name;

          if (!CONSOLES.has(methodName)) {
            return;
          }

          if (
            (methodName === "error" && allowConsoleError) ||
            (methodName === "log" && allowConsoleLog) ||
            (methodName === "warn" && allowConsoleWarn)
          ) {
            return;
          }

          context.report({
            data: {
              console: node.callee.property.name,
            },
            messageId: Messages.NO_CONSOLE,
            node,
          });
        }
      },
    };
  },
  defaultOptions: [
    {
      allowConsoleError: false,
      allowConsoleLog: false,
      allowConsoleWarn: false,
    },
  ],

  meta: {
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
          allowConsoleError: {
            default: false,
            type: "boolean",
          },
          allowConsoleLog: {
            default: false,
            type: "boolean",
          },
          allowConsoleWarn: {
            default: false,
            type: "boolean",
          },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },

  name,
});
