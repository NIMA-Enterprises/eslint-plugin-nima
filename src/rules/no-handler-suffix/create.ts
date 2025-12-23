import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { generateUniqueName } from "@utility/naming-helpers";

import { Messages, type Options } from "./config";

export const create = (context: RuleContext<Messages, Options>) => {
    const checkName = ($node: TSESTree.Node, $name: string) => {
        if ($name?.toLowerCase().endsWith("handler")) {
            const base = $name.slice(0, -7);

            const stripped =
                base.length === 0 ? "" : base[0].toUpperCase() + base.slice(1);

            const suggestedBase = `handle${stripped}`;
            const sourceCode = context.sourceCode;
            const scope = sourceCode.getScope($node);
            const uniqueName = generateUniqueName({
                base: suggestedBase,
                scope,
            });
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

    const checkVariableDeclaratorParent = (node: TSESTree.Node) => {
        const parent = node.parent;
        if (
            parent?.type === AST_NODE_TYPES.VariableDeclarator &&
            parent.id.type === AST_NODE_TYPES.Identifier
        ) {
            checkName(parent.id, parent.id.name);
        }
    };

    const checkArrowFunction = (node: TSESTree.ArrowFunctionExpression) => {
        checkVariableDeclaratorParent(node);
    };

    const checkFunctionDeclaration = (node: TSESTree.FunctionDeclaration) => {
        if (node.id) {
            checkName(node.id, node.id.name);
        }
    };

    const checkFunctionExpression = (node: TSESTree.FunctionExpression) => {
        if (node.id) {
            checkName(node.id, node.id.name);
        }
        checkVariableDeclaratorParent(node);
    };

    return {
        ArrowFunctionExpression: checkArrowFunction,
        FunctionDeclaration: checkFunctionDeclaration,
        FunctionExpression: checkFunctionExpression,
    };
};
