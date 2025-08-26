import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

import { HOOKS_WITH_DEPS } from "../constants/hooks";

export const name = "no-objects-in-deps";

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  create: (context) => {
    function getCalleeName(node: TSESTree.CallExpression): null | string {
      const callee = node.callee;

      if (callee.type === "Identifier") {
        return callee.name;
      }

      if (callee.type === "MemberExpression") {
        if (!callee.computed && callee.property.type === "Identifier") {
          return callee.property.name;
        }
        if (callee.computed && callee.property.type === "Literal") {
          return String(callee.property.value);
        }
      }

      return null;
    }

    const checkDep = (element: TSESTree.Expression, node: TSESTree.Node) => {
      const invalidExpression =
        element.type === "ObjectExpression" ||
        element.type === "ArrayExpression" ||
        element.type === "NewExpression";

      if (invalidExpression) {
        context.report({
          data: {
            object: context.sourceCode.getText(element),
          },
          messageId: "noObjects",
          node: element,
        });
      } else if (element.type === "Identifier") {
        const scope = context.sourceCode.getScope(node);
        const variable = scope.variables.find((v) => v.name === element.name);

        if (variable) {
          for (const def of variable.defs) {
            if (def.type === "Variable" && def.node.init) {
              context.report({
                data: {
                  object: context.sourceCode.getText(element),
                },
                messageId: "noObjects",
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
        if (deps?.type === "ArrayExpression") {
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
    },
    messages: {
      noObjects:
        "NIMA: Objects inside of dependency arrays aren't allowed. Try doing JSON.stringify({{ object }}).",
    },
    schema: [],
    type: "suggestion",
  },
});
