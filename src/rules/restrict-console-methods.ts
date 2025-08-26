import { ESLintUtils } from "@typescript-eslint/utils";

import { CONSOLES } from "../constants/consoles";

type Messages = "noConsole";

type Options = {
  noConsoleError?: boolean;
  noConsoleLog?: boolean;
  noConsoleWarn?: boolean;
};

export const name = "restrict-console-methods";

export const rule = ESLintUtils.RuleCreator.withoutDocs<Options[], Messages>({
  create(context, options) {
    const noConsoleError = options[0].noConsoleError;
    const noConsoleLog = options[0].noConsoleLog;
    const noConsoleWarn = options[0].noConsoleWarn;

    return {
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "console" &&
          node.callee.property.type === "Identifier"
        ) {
          const methodName = node.callee.property.name;

          if (!CONSOLES.has(methodName)) {
            return;
          }

          if (
            (methodName === "error" && !noConsoleError) ||
            (methodName === "log" && !noConsoleLog) ||
            (methodName === "warn" && !noConsoleWarn)
          ) {
            return;
          }

          context.report({
            data: {
              console: node.callee.property.name,
            },
            messageId: "noConsole",
            node,
          });
        }
      },
    };
  },

  defaultOptions: [
    {
      noConsoleError: true,
      noConsoleLog: true,
      noConsoleWarn: true,
    },
  ],

  meta: {
    docs: {
      description: "Restrict the usage of console in the codebase",
    },
    messages: {
      noConsole: "NIMA: The usage of console.{{ console }} is restricted.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          noConsoleError: {
            default: true,
            type: "boolean",
          },
          noConsoleLog: {
            default: true,
            type: "boolean",
          },
          noConsoleWarn: {
            default: true,
            type: "boolean",
          },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },
});
