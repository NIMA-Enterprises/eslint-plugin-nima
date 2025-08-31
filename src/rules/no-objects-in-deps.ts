import { HOOKS_WITH_DEPS } from "@constants/hooks";
import { Messages, Options } from "@models/no-objects-in-deps.model";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";

export const name = "no-objects-in-deps";

export const rule = createRule<Options, Messages>({
  create: (context) => {
    function getCalleeName(node: TSESTree.CallExpression) {
      const callee = node.callee;

      if (callee.type === AST_NODE_TYPES.Identifier) {
        return callee.name;
      }

      if (callee.type === AST_NODE_TYPES.MemberExpression) {
        if (
          !callee.computed &&
          callee.property.type === AST_NODE_TYPES.Identifier
        ) {
          return callee.property.name;
        }
        if (
          callee.computed &&
          callee.property.type === AST_NODE_TYPES.Literal
        ) {
          return String(callee.property.value);
        }
      }

      return null;
    }

    const checkDep = (element: TSESTree.Expression, node: TSESTree.Node) => {
      const invalidExpression =
        element.type === AST_NODE_TYPES.ObjectExpression ||
        element.type === AST_NODE_TYPES.ArrayExpression ||
        element.type === AST_NODE_TYPES.NewExpression;

      if (invalidExpression) {
        context.report({
          data: {
            object: context.sourceCode.getText(element),
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
          node: element,
        });
      } else if (element.type === AST_NODE_TYPES.Identifier) {
        const scope = context.sourceCode.getScope(node);
        const variable = scope.variables.find((v) => v.name === element.name);

        if (variable) {
          for (const def of variable.defs) {
            if (def.type === "Variable" && def.node.init) {
              context.report({
                data: {
                  object: context.sourceCode.getText(element),
                },
                messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                node: element,
              });
            }
          }
        }
      }
    };

    return {
      CallExpression(node) {
        const calleeName = getCalleeName(node);
        if (!calleeName || !HOOKS_WITH_DEPS.has(calleeName)) return;

        const deps = node.arguments[1];
        if (deps?.type === AST_NODE_TYPES.ArrayExpression) {
          for (const element of deps.elements) {
            if (!element) continue;
            checkDep(element as TSESTree.Expression, node);
          }
        }
      },
    };
  },
  defaultOptions: [],

  meta: {
    docs: {
      description: "Suggests to not use objects in dependency arrays",
      recommended: false,
      url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-objects-in-deps.md",
    },
    messages: {
      [Messages.NO_OBJECTS_IN_DEPENDENCIES]:
        "NIMA: Objects inside of dependency arrays aren't allowed. Try doing JSON.stringify({{ object }}).",
    },
    schema: [],
    type: "suggestion",
  },

  name,
});
