import { CONSOLES } from "@constants/consoles";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { Messages, type Options } from "./config";

export const create = (
  context: RuleContext<Messages, Options>,
  [options]: readonly Options[number][]
) => {
  const { allow = ["info"] } = options;

  return {
    CallExpression: (node: TSESTree.CallExpression) => {
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
};
