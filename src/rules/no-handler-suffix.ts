import type { Scope } from "@typescript-eslint/utils/ts-eslint";

import { Messages, Options } from "@models/no-handler-suffix.model";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";

export const name = "no-handler-suffix";

export const rule = createRule<Options, Messages>({
  create: (context) => {
    const generateUniqueName = ($base: string, $scope: Scope.Scope) => {
      let candidate = $base;
      let index = 2;
      const existingNames = new Set($scope.variables.map((v) => v.name));
      while (existingNames.has(candidate)) {
        candidate = `${$base}${index++}`;
      }
      return candidate;
    };

    const checkName = ($node: TSESTree.Node, $name: string) => {
      if ($name?.toLowerCase().endsWith("handler")) {
        const base = $name.slice(0, -7);

        const stripped =
          base.length === 0 ? "" : base[0].toUpperCase() + base.slice(1);

        const suggestedBase = `handle${stripped}`;
        const sourceCode = context.sourceCode;
        const scope = sourceCode.getScope($node);
        const uniqueName = generateUniqueName(suggestedBase, scope);
        const variable = scope.set.get($name);
        context.report({
          data: {
            fnWithGoodName: uniqueName,
          },
          fix: (fixer) => {
            const fixes = [fixer.replaceText($node, uniqueName)];
            if (variable) {
              for (const ref of variable.references) {
                if (ref.identifier !== $node) {
                  fixes.push(fixer.replaceText(ref.identifier, uniqueName));
                }
              }
            }
            return fixes;
          },
          messageId: Messages.BAD_HANDLER_NAME,
          node: $node,
        });
      }
    };

    return {
      ArrowFunctionExpression: (node) => {
        const parent = node.parent;
        if (
          parent?.type === AST_NODE_TYPES.VariableDeclarator &&
          parent.id.type === AST_NODE_TYPES.Identifier
        ) {
          checkName(parent.id, parent.id.name);
        }
      },
      FunctionDeclaration: (node) => {
        if (node.id) {
          checkName(node.id, node.id?.name);
        }
      },
      FunctionExpression: (node) => {
        const parent = node.parent;
        if (node.id) {
          checkName(node.id, node.id.name);
        }
        if (
          parent?.type === AST_NODE_TYPES.VariableDeclarator &&
          parent.id.type === AST_NODE_TYPES.Identifier
        ) {
          checkName(parent.id, parent.id.name);
        }
      },
    };
  },
  defaultOptions: [],

  meta: {
    docs: {
      description: "Suggests to use handleFn instead of fnHandler",
      recommended: true,
      url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-handler-suffix.md",
    },
    fixable: "code",
    messages: {
      [Messages.BAD_HANDLER_NAME]:
        "NIMA: You shouldn't use the handler suffix, use the handle prefix instead ({{ fnWithGoodName }})",
    },
    schema: [],
    type: "problem",
  },

  name,
});
