import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";

import { Messages, type Options } from "./config";

export const create = (
    context: RuleContext<Messages, Options>,
    [options]: readonly Options[number][]
) => {
    const {
        allowAsync = true,
        allowConstructors = true,
        allowFunctionDeclarations = false,
        allowFunctionExpressions = false,
        allowGenerators = true,
        allowMethodDefinitions = false,
    } = options;

    const sourceCode = context.sourceCode;

    const shouldSkipFunction = (node: TSESTree.FunctionLike) => {
        if (
            allowConstructors &&
            node.parent?.type === AST_NODE_TYPES.MethodDefinition &&
            node.parent.kind === "constructor"
        ) {
            return true;
        }
        if (allowGenerators && node?.generator) {
            return true;
        }
        if (allowAsync && node?.async) {
            return true;
        }
        if (node.type === AST_NODE_TYPES.TSEmptyBodyFunctionExpression) {
            return true;
        }
        return false;
    };

    const generateArrowFunction = (node: TSESTree.FunctionLike) => {
        const asyncKeyword = node.async ? "async " : "";

        const getParams = () => {
            if (node.params.length === 0) {
                return "()";
            }

            if (
                node.params.length === 1 &&
                node.params[0].type === AST_NODE_TYPES.Identifier &&
                !node.params[0].typeAnnotation
            ) {
                return sourceCode.getText(node.params[0]);
            }

            return `(${node.params.map((p) => sourceCode.getText(p)).join(", ")})`;
        };

        const params = getParams();
        const returnType = node.returnType
            ? `: ${sourceCode.getText(node.returnType.typeAnnotation)}`
            : "";

        const body = node.body ? sourceCode.getText(node.body) : "";
        return `${asyncKeyword}${params}${returnType} => ${body}`;
    };

    return {
        FunctionDeclaration: (node: TSESTree.FunctionDeclaration) => {
            if (allowFunctionDeclarations || shouldSkipFunction(node)) {
                return;
            }
            context.report({
                fix: (fixer) => {
                    if (!node.id) {
                        return null;
                    }
                    const functionName = node.id.name;
                    const arrowFunction = generateArrowFunction(node);
                    let replacement;
                    if (
                        node.parent?.type ===
                        AST_NODE_TYPES.ExportDefaultDeclaration
                    ) {
                        const constDeclaration = `const ${functionName} = ${arrowFunction}`;
                        const exportDeclaration = `export default ${functionName}`;
                        replacement = `${constDeclaration};\n${exportDeclaration}`;
                        return fixer.replaceText(node.parent, replacement);
                    } else if (
                        node.parent?.type ===
                        AST_NODE_TYPES.ExportNamedDeclaration
                    ) {
                        replacement = `export const ${functionName} = ${arrowFunction}`;
                        return fixer.replaceText(node.parent, replacement);
                    } else {
                        replacement = `const ${functionName} = ${arrowFunction}`;
                        return fixer.replaceText(node, replacement);
                    }
                },
                messageId: Messages.PREFER_ARROW_FUNCTIONS,
                node: node.id || node,
            });
        },

        FunctionExpression: (node: TSESTree.FunctionExpression) => {
            if (
                (node.parent?.type === AST_NODE_TYPES.MethodDefinition ||
                    (node.parent?.type === AST_NODE_TYPES.Property &&
                        (node.parent.method || !node.parent.method))) &&
                allowMethodDefinitions
            ) {
                return;
            }

            if (
                node.parent?.type === AST_NODE_TYPES.Property &&
                node.parent.method
            ) {
                return;
            }

            if (allowFunctionExpressions || shouldSkipFunction(node)) {
                return;
            }

            context.report({
                fix: (fixer) => {
                    const arrowFunction = generateArrowFunction(node);
                    return fixer.replaceText(node, arrowFunction);
                },
                messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
                node,
            });
        },

        MethodDefinition: (node: TSESTree.MethodDefinition) => {
            if (
                allowMethodDefinitions ||
                node.kind === "constructor" ||
                node.kind === "get" ||
                node.kind === "set"
            ) {
                return;
            }
            if (
                node.value.type === AST_NODE_TYPES.FunctionExpression &&
                !shouldSkipFunction(node.value)
            ) {
                context.report({
                    fix: (fixer) => {
                        const key = sourceCode.getText(node.key);
                        const arrowFunction = generateArrowFunction(node.value);
                        const static_ = node.static ? "static " : "";
                        const replacement = `${static_}${key} = ${arrowFunction}`;
                        return fixer.replaceText(node, replacement);
                    },
                    messageId: Messages.PREFER_ARROW_METHOD,
                    node: node.key,
                });
            }
        },

        Property: (node: TSESTree.Property) => {
            if (
                allowMethodDefinitions ||
                !node.method ||
                node.kind === "get" ||
                node.kind === "set" ||
                node.value.type !== AST_NODE_TYPES.FunctionExpression
            ) {
                return;
            }
            const functionNode = node.value;
            if (!shouldSkipFunction(functionNode)) {
                context.report({
                    fix: (fixer) => {
                        const key = sourceCode.getText(node.key);
                        const arrowFunction =
                            generateArrowFunction(functionNode);
                        const replacement = `${key}: ${arrowFunction}`;
                        return fixer.replaceText(node, replacement);
                    },
                    messageId: Messages.PREFER_ARROW_METHOD,
                    node: node.key,
                });
            }
        },
    };
};
