import { CONSOLES } from "@constants/consoles";
import { Messages, type Options } from "@models/restrict-console-methods.model";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";

export const name = "restrict-console-methods";

export const rule = createRule<Options, Messages>({
  create: (context, [options]) => {
    const { allow = ["info"] } = options;

    return {
      CallExpression: (node) => {
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

          if (allow.includes(methodName)) {
            return;
          }

          context.report({
            data: {
              console: node.callee.property.name,
            },
            messageId: Messages.NO_CONSOLE,
            node: node.callee.property,
          });
        }
      },
    };
  },
  defaultOptions: [
    {
      allow: ["info"],
    },
  ],
  meta: {
    defaultOptions: [
      {
        allow: ["info"],
      },
    ],
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
  },

  name,
});
