import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext, RuleFixer } from "@typescript-eslint/utils/ts-eslint";
import {
    getFunctionName,
    isComponentFunction,
    isReactReturn,
} from "@utility/function-helpers";

import { Messages, type Options } from "./config";

export const create = (context: RuleContext<Messages, Options>) => {
    const sourceCode = context.sourceCode;

    const reportExportBelowComponent = ({
        fnName,
        nodeToFix,
        nodeToReport,
        replacePattern,
    }: {
        fnName: string;
        nodeToFix: TSESTree.Node;
        nodeToReport: TSESTree.Node;
        replacePattern: RegExp;
    }) => {
        context.report({
            data: {
                fnName,
            },
            fix: (fixer: RuleFixer) => {
                const text = sourceCode.getText(nodeToFix);
                const newText = text.replace(replacePattern, "");

                return [
                    fixer.replaceText(nodeToFix, newText),
                    fixer.insertTextAfter(
                        nodeToFix,
                        `\n\nexport { ${fnName} };`
                    ),
                ];
            },
            messageId: Messages.EXPORT_BELOW_COMPONENT,
            node: nodeToReport,
        });
    };

    const checkExportDefaultDeclaration = (
        node: TSESTree.ExportDefaultDeclaration
    ) => {
        if (node.declaration.type !== AST_NODE_TYPES.FunctionDeclaration) {
            return;
        }

        const fnName = node.declaration.id?.name;
        if (
            fnName &&
            isComponentFunction(fnName) &&
            isReactReturn(node.declaration)
        ) {
            reportExportBelowComponent({
                fnName,
                nodeToFix: node,
                nodeToReport: node,
                replacePattern: /^export\s+default\s+/,
            });
        }
    };

    const checkExportNamedDeclaration = (
        node: TSESTree.ExportNamedDeclaration
    ) => {
        if (!node.declaration) {
            return;
        }

        if (node.declaration.type === AST_NODE_TYPES.VariableDeclaration) {
            const declarator = node.declaration.declarations[0];
            if (!declarator.init) {
                return;
            }

            const fnNode = declarator.init;
            if (
                fnNode.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
                fnNode.type !== AST_NODE_TYPES.FunctionExpression
            ) {
                return;
            }

            const fnName = getFunctionName(fnNode);
            if (
                fnName &&
                isComponentFunction(fnName) &&
                isReactReturn(fnNode)
            ) {
                reportExportBelowComponent({
                    fnName,
                    nodeToFix: node,
                    nodeToReport: node,
                    replacePattern: /^export\s+/,
                });
            }
        }
    };

    const checkFunctionDeclaration = (node: TSESTree.FunctionDeclaration) => {
        if (node.parent?.type !== AST_NODE_TYPES.ExportNamedDeclaration) {
            return;
        }

        const fnName = getFunctionName(node);
        if (fnName && isComponentFunction(fnName) && isReactReturn(node)) {
            reportExportBelowComponent({
                fnName,
                nodeToFix: node.parent,
                nodeToReport: node.parent,
                replacePattern: /^export\s+/,
            });
        }
    };

    return {
        ExportDefaultDeclaration: checkExportDefaultDeclaration,
        ExportNamedDeclaration: checkExportNamedDeclaration,
        FunctionDeclaration: checkFunctionDeclaration,
    };
};
