import { DEFAULT_PREFIXES } from "@constants/boolean-prefixes";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { getType } from "@utility/type-helpers";

import { Messages, type Options } from "./config";

export const create = (
    context: RuleContext<Messages, Options>,
    [options]: readonly Options[number][]
) => {
    const {
        allowedPrefixes = DEFAULT_PREFIXES,
        checkFunctions = true,
        checkParameters = true,
        checkProperties = true,
        checkVariables = true,
        ignore = "filter",
    } = options;

    const services = context.sourceCode.parserServices;

    const checker = services?.program?.getTypeChecker();

    const hasValidBooleanPrefix = (name: string) => {
        return allowedPrefixes?.some((prefix) =>
            name.toLowerCase().startsWith(prefix.toLowerCase())
        );
    };

    let ignoreRegex: null | RegExp = null;
    try {
        ignoreRegex = new RegExp(ignore, "i");
    } catch {
        ignoreRegex = null;
    }

    const generateSuggestion = (name: string) => {
        return `is${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    };

    const isBooleanType = (node: TSESTree.Node) => {
        try {
            const type = getType({ context, node });

            return type === "boolean" || type === "true" || type === "false";
        } catch {
            return false;
        }
    };

    const isParamBoolean = (node: TSESTree.FunctionLike) => {
        const reported = new Set<string>();

        for (const param of node.params) {
            if (
                param.type === AST_NODE_TYPES.Identifier &&
                param.typeAnnotation?.typeAnnotation.type ===
                    AST_NODE_TYPES.TSBooleanKeyword
            ) {
                checkNameOnce({
                    name: param.name,
                    node: param,
                    reported,
                });
            }

            if (
                param.type === AST_NODE_TYPES.Identifier &&
                param.typeAnnotation?.typeAnnotation.type ===
                    AST_NODE_TYPES.TSTypeLiteral
            ) {
                for (const member of param.typeAnnotation.typeAnnotation
                    .members) {
                    if (
                        member.type === AST_NODE_TYPES.TSPropertySignature &&
                        member.typeAnnotation?.typeAnnotation.type ===
                            AST_NODE_TYPES.TSBooleanKeyword &&
                        member.key.type === AST_NODE_TYPES.Identifier
                    ) {
                        checkNameOnce({
                            name: member.key.name,
                            node: member,
                            reported,
                        });
                    }
                }
            }

            if (param.type === AST_NODE_TYPES.ObjectPattern) {
                checkObjectPattern({
                    pattern: param,
                    reported,
                    typeAnnotation: param.typeAnnotation?.typeAnnotation,
                });
            }
        }
    };

    const checkObjectPattern = ({
        pattern,
        reported,
        typeAnnotation,
    }: {
        pattern: TSESTree.ObjectPattern;
        reported?: Set<string>;
        typeAnnotation?: TSESTree.TypeNode;
    }) => {
        for (const prop of pattern.properties) {
            if (prop.type === AST_NODE_TYPES.Property) {
                const propKey = prop.key;
                const propValue = prop.value;

                if (
                    propKey.type === AST_NODE_TYPES.Identifier &&
                    propValue.type === AST_NODE_TYPES.Identifier
                ) {
                    const hasDirectAnnotation =
                        propValue.typeAnnotation?.typeAnnotation.type ===
                        AST_NODE_TYPES.TSBooleanKeyword;

                    if (hasDirectAnnotation) {
                        checkNameOnce({
                            name: propKey.name,
                            node: propKey,
                            reported,
                        });
                    } else if (
                        typeAnnotation?.type === AST_NODE_TYPES.TSTypeLiteral
                    ) {
                        for (const member of typeAnnotation.members) {
                            if (
                                member.type ===
                                    AST_NODE_TYPES.TSPropertySignature &&
                                member.key.type === AST_NODE_TYPES.Identifier &&
                                member.key.name === propKey.name &&
                                member.typeAnnotation?.typeAnnotation.type ===
                                    AST_NODE_TYPES.TSBooleanKeyword
                            ) {
                                checkNameOnce({
                                    name: propKey.name,
                                    node: propKey,
                                    reported,
                                });
                                break;
                            }
                        }
                    }
                } else if (
                    propKey.type === AST_NODE_TYPES.Identifier &&
                    propValue.type === AST_NODE_TYPES.ObjectPattern &&
                    typeAnnotation?.type === AST_NODE_TYPES.TSTypeLiteral
                ) {
                    for (const member of typeAnnotation.members) {
                        if (
                            member.type ===
                                AST_NODE_TYPES.TSPropertySignature &&
                            member.key.type === AST_NODE_TYPES.Identifier &&
                            member.key.name === propKey.name
                        ) {
                            checkObjectPattern({
                                pattern: propValue,
                                reported,
                                typeAnnotation:
                                    member.typeAnnotation?.typeAnnotation,
                            });
                            break;
                        }
                    }
                }
            }
        }
    };

    const checkNameOnce = ({
        name,
        node,
        reported,
    }: {
        name: string;
        node: TSESTree.Node;
        reported?: Set<string>;
    }) => {
        const key = `${name}-${node.loc.start.line}`;
        if (reported && reported.has(key)) {
            return;
        }
        if (ignoreRegex && ignoreRegex.test(name)) {
            return;
        }

        if (!hasValidBooleanPrefix(name)) {
            reported?.add(key);
            context.report({
                data: {
                    name,
                    suggestion: generateSuggestion(name),
                },
                messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                node,
            });
        }
    };

    const functionReturnsBooleanType = (node: TSESTree.FunctionLike) => {
        try {
            const tsNode = services?.esTreeNodeToTSNodeMap?.get(node);
            if (!tsNode) {
                return false;
            }

            const signature = checker?.getSignatureFromDeclaration(tsNode);
            if (signature && checker) {
                const returnType = checker.getReturnTypeOfSignature(signature);
                const returnTypeString = checker.typeToString(returnType);
                return (
                    returnTypeString === "boolean" ||
                    returnTypeString === "true" ||
                    returnTypeString === "false"
                );
            }
            return false;
        } catch {
            return false;
        }
    };

    return {
        ArrowFunctionExpression: (node: TSESTree.ArrowFunctionExpression) => {
            if (checkParameters) {
                isParamBoolean(node);
            }
        },

        FunctionDeclaration: (node: TSESTree.FunctionDeclaration) => {
            if (!checkFunctions) {
                return;
            }

            if (node.id && functionReturnsBooleanType(node)) {
                const name = node.id.name;
                if (ignoreRegex && ignoreRegex.test(name)) {
                    return;
                }
                if (!hasValidBooleanPrefix(name)) {
                    context.report({
                        data: {
                            name,
                            suggestion: generateSuggestion(name),
                        },
                        messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
                        node: node.id,
                    });
                }
            }

            if (checkParameters) {
                isParamBoolean(node);
            }
        },

        FunctionExpression: (node: TSESTree.FunctionExpression) => {
            if (checkParameters) {
                isParamBoolean(node);
            }
        },

        ObjectExpression: (node: TSESTree.ObjectExpression) => {
            if (!checkProperties) {
                return;
            }

            for (const prop of node.properties) {
                if (
                    prop.type === AST_NODE_TYPES.Property &&
                    prop.key.type === AST_NODE_TYPES.Identifier &&
                    !prop.computed &&
                    prop.value &&
                    (isBooleanType(prop.value) ||
                        ((prop.value.type ===
                            AST_NODE_TYPES.FunctionExpression ||
                            prop.value.type ===
                                AST_NODE_TYPES.ArrowFunctionExpression) &&
                            functionReturnsBooleanType(prop.value)))
                ) {
                    const name = prop.key.name;
                    if (ignoreRegex && ignoreRegex.test(name)) {
                        continue;
                    }
                    if (!hasValidBooleanPrefix(name)) {
                        context.report({
                            data: {
                                name,
                                suggestion: generateSuggestion(name),
                            },
                            messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
                            node: prop.key,
                        });
                    }
                }
            }
        },

        Property: (node: TSESTree.Property) => {
            if (node.parent?.type === AST_NODE_TYPES.ObjectPattern) {
                let current: TSESTree.Node | undefined = node.parent;
                while (current) {
                    if (
                        current.type ===
                            AST_NODE_TYPES.ArrowFunctionExpression ||
                        current.type === AST_NODE_TYPES.FunctionExpression ||
                        current.type === AST_NODE_TYPES.FunctionDeclaration
                    ) {
                        return;
                    }
                    current = current.parent;
                }
            }

            if (!checkParameters) {
                return;
            }

            if (
                node.key.type === AST_NODE_TYPES.Identifier &&
                node.value.type === AST_NODE_TYPES.Identifier &&
                node.parent?.type === AST_NODE_TYPES.ObjectPattern
            ) {
                let current: TSESTree.Node | undefined = node.parent;
                while (current && current.type !== AST_NODE_TYPES.Identifier) {
                    current = current.parent;
                }

                let param: TSESTree.Node | undefined = node.parent;
                while (param && param.parent) {
                    if (
                        param.parent.type ===
                            AST_NODE_TYPES.ArrowFunctionExpression ||
                        param.parent.type ===
                            AST_NODE_TYPES.FunctionExpression ||
                        param.parent.type === AST_NODE_TYPES.FunctionDeclaration
                    ) {
                        break;
                    }
                    param = param.parent;
                }

                if (
                    param &&
                    "typeAnnotation" in param &&
                    param.typeAnnotation
                ) {
                    const typeAnnotation =
                        param.typeAnnotation as TSESTree.TSTypeAnnotation;
                    if (
                        typeAnnotation.typeAnnotation.type ===
                        AST_NODE_TYPES.TSTypeLiteral
                    ) {
                        const typeLiteral = typeAnnotation.typeAnnotation;

                        const propertyType = typeLiteral.members.find(
                            (member) => {
                                if (
                                    member.type ===
                                        AST_NODE_TYPES.TSPropertySignature &&
                                    member.key?.type ===
                                        AST_NODE_TYPES.Identifier &&
                                    member.key.name ===
                                        (node.key as TSESTree.Identifier).name
                                ) {
                                    return (
                                        member.typeAnnotation?.typeAnnotation
                                            .type ===
                                        AST_NODE_TYPES.TSBooleanKeyword
                                    );
                                }
                                return false;
                            }
                        );

                        if (propertyType) {
                            const name = node.value.name;
                            if (ignoreRegex && ignoreRegex.test(name)) {
                                return;
                            }
                            if (!hasValidBooleanPrefix(name)) {
                                context.report({
                                    data: {
                                        name,
                                        suggestion: generateSuggestion(name),
                                    },
                                    messageId:
                                        Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
                                    node: node.value,
                                });
                            }
                        }
                    }
                }
            }
        },

        VariableDeclarator: (node: TSESTree.VariableDeclarator) => {
            if (node.id.type === AST_NODE_TYPES.ObjectPattern) {
                if (!checkParameters) {
                    return;
                }

                if (node.init) {
                    for (const prop of node.id.properties) {
                        if (
                            prop.type === AST_NODE_TYPES.Property &&
                            prop.key.type === AST_NODE_TYPES.Identifier &&
                            prop.value.type === AST_NODE_TYPES.Identifier
                        ) {
                            const valueName = prop.value.name;

                            try {
                                const tsNode =
                                    services?.esTreeNodeToTSNodeMap?.get(
                                        prop.value
                                    );
                                if (tsNode && checker) {
                                    const type =
                                        checker.getTypeAtLocation(tsNode);
                                    const typeString =
                                        checker.typeToString(type);

                                    if (
                                        typeString === "boolean" ||
                                        typeString === "true" ||
                                        typeString === "false"
                                    ) {
                                        if (
                                            ignoreRegex &&
                                            ignoreRegex.test(valueName)
                                        ) {
                                            continue;
                                        }
                                        if (!hasValidBooleanPrefix(valueName)) {
                                            context.report({
                                                data: {
                                                    name: valueName,
                                                    suggestion:
                                                        generateSuggestion(
                                                            valueName
                                                        ),
                                                },
                                                messageId:
                                                    Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                                                node: prop.value,
                                            });
                                        }
                                    }
                                }
                            } catch {
                                // Intentionally ignore errors during type checking
                            }
                        }
                    }
                }
            }

            if (!checkVariables) {
                return;
            }

            if (node.id.type === AST_NODE_TYPES.Identifier) {
                if (
                    node.id.typeAnnotation?.typeAnnotation.type ===
                    AST_NODE_TYPES.TSBooleanKeyword
                ) {
                    const name = node.id.name;
                    if (ignoreRegex && ignoreRegex.test(name)) {
                        return;
                    }
                    if (!hasValidBooleanPrefix(name)) {
                        context.report({
                            data: {
                                name,
                                suggestion: generateSuggestion(name),
                            },
                            messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                            node: node.id,
                        });
                    }
                    return;
                }

                if (node.init) {
                    if (
                        (node.init.type ===
                            AST_NODE_TYPES.ArrowFunctionExpression ||
                            node.init.type ===
                                AST_NODE_TYPES.FunctionExpression) &&
                        functionReturnsBooleanType(node.init)
                    ) {
                        const name = node.id.name;
                        if (ignoreRegex && ignoreRegex.test(name)) {
                            return;
                        }
                        if (!hasValidBooleanPrefix(name)) {
                            context.report({
                                data: {
                                    name,
                                    suggestion: generateSuggestion(name),
                                },
                                messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
                                node: node.id,
                            });
                        }
                    } else if (isBooleanType(node.init)) {
                        const name = node.id.name;
                        if (ignoreRegex && ignoreRegex.test(name)) {
                            return;
                        }
                        if (!hasValidBooleanPrefix(name)) {
                            context.report({
                                data: {
                                    name,
                                    suggestion: generateSuggestion(name),
                                },
                                messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                                node: node.id,
                            });
                        }
                    }
                }
            }
        },
    };
};
