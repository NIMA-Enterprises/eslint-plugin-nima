import { Messages, Options } from "@models/prefer-export-under-component.model";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";
import {
  getFunctionName,
  isComponentFunction,
  isReactReturn,
} from "@utility/function-helpers";

export const name = "prefer-export-under-component";

export const rule = createRule<Options, Messages>({
  create: (context) => {
    return {
      ExportDefaultDeclaration: (node: TSESTree.ExportDefaultDeclaration) => {
        if (node.declaration.type !== AST_NODE_TYPES.FunctionDeclaration) {
          return;
        }

        const fnName = node.declaration.id?.name;
        if (
          fnName &&
          isComponentFunction(fnName) &&
          isReactReturn(node.declaration)
        ) {
          context.report({
            data: {
              fnName,
            },
            fix: (fixer) => {
              const sourceCode = context.sourceCode;
              const text = sourceCode.getText(node);
              const newText = text.replace(/^export\s+default\s+/, "");

              return [
                fixer.replaceText(node, newText),
                fixer.insertTextAfter(node, `\n\nexport { ${fnName} };`),
              ];
            },
            messageId: Messages.EXPORT_BELOW_COMPONENT,
            node,
          });
        }
      },

      ExportNamedDeclaration: (node: TSESTree.ExportNamedDeclaration) => {
        if (!node.declaration) return;

        if (node.declaration.type === AST_NODE_TYPES.VariableDeclaration) {
          const declarator = node.declaration.declarations[0];
          if (!declarator.init) return;

          const fnNode = declarator.init;
          if (
            fnNode.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
            fnNode.type !== AST_NODE_TYPES.FunctionExpression
          ) {
            return;
          }

          const fnName = getFunctionName(fnNode);
          if (fnName && isComponentFunction(fnName) && isReactReturn(fnNode)) {
            context.report({
              data: {
                fnName,
              },
              fix: (fixer) => {
                const sourceCode = context.sourceCode;
                const text = sourceCode.getText(node);
                const newText = text.replace(/^export\s+/, "");

                return [
                  fixer.replaceText(node, newText),
                  fixer.insertTextAfter(node, `\n\nexport { ${fnName} };`),
                ];
              },
              messageId: Messages.EXPORT_BELOW_COMPONENT,
              node,
            });
          }
        }
      },

      FunctionDeclaration: (node: TSESTree.FunctionDeclaration) => {
        if (node.parent?.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
          return;
        }

        const fnName = getFunctionName(node);
        if (fnName && isComponentFunction(fnName) && isReactReturn(node)) {
          context.report({
            data: {
              fnName,
            },
            fix: (fixer) => {
              const sourceCode = context.sourceCode;
              const text = sourceCode.getText(node.parent);
              const newText = text.replace(/^export\s+/, "");

              return [
                fixer.replaceText(node.parent, newText),
                fixer.insertTextAfter(node.parent, `\n\nexport { ${fnName} };`),
              ];
            },
            messageId: Messages.EXPORT_BELOW_COMPONENT,
            node: node.parent,
          });
        }
      },
    };
  },
  defaultOptions: [{}],

  meta: {
    docs: {
      description:
        "Enforce separate declaration and export for React components",
      recommended: true,
      url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-export-under-component.md",
    },
    fixable: "code",
    messages: {
      [Messages.EXPORT_BELOW_COMPONENT]:
        "NIMA: Declare React component '{{ fnName }}' separately from its export statement",
    },
    schema: [],
    type: "problem",
  },

  name,
});
