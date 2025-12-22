import type { Scope } from "@typescript-eslint/utils/ts-eslint";

import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { Messages, type Options } from "./config";

export const create = (context: RuleContext<Messages, Options>) => {
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
                                fixes.push(
                                    fixer.replaceText(
                                        ref.identifier,
                                        uniqueName
                                    )
                                );
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
        ArrowFunctionExpression: (node: TSESTree.ArrowFunctionExpression) => {
            const parent = node.parent;
            if (
                parent?.type === AST_NODE_TYPES.VariableDeclarator &&
                parent.id.type === AST_NODE_TYPES.Identifier
            ) {
                checkName(parent.id, parent.id.name);
            }
        },
        FunctionDeclaration: (node: TSESTree.FunctionDeclaration) => {
            if (node.id) {
                checkName(node.id, node.id?.name);
            }
        },
        FunctionExpression: (node: TSESTree.FunctionExpression) => {
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
};
