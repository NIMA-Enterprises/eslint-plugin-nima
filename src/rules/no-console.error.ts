import { ESLintUtils } from "@typescript-eslint/utils";

export const name = "no-console-error";

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "console" &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "error"
        ) {
          context.report({
            messageId: "noConsole",
            node,
          });
        }
      },
    };
  },

  defaultOptions: [],

  meta: {
    docs: {
      description: "Disallow console.log in the codebase",
    },
    messages: {
      noConsole: "Avoid using console.error",
    },
    schema: [],
    type: "suggestion",
  },
});
