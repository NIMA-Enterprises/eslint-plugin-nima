import { ESLintUtils } from "@typescript-eslint/utils";

export const name = "no-console-warn";

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "console" &&
          node.callee.property.type === "Identifier" &&
          node.callee.property.name === "warn"
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
      noConsole: "Avoid using console.warn",
    },
    schema: [],
    type: "suggestion",
  },
});
