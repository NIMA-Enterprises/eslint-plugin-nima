import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import {
    areAllPropertiesOptional,
    buildTypeWithVoid,
    extractProperties,
    hasVoidOrUndefinedInUnion,
} from "@utility/void-helpers";

import { Messages, type Options } from "./config";

export const create = (context: RuleContext<Messages, Options>) => {
    const sourceCode = context.sourceCode;

    const checkFunction = (
        node:
            | TSESTree.ArrowFunctionExpression
            | TSESTree.FunctionDeclaration
            | TSESTree.FunctionExpression
    ) => {
        const paramsToFix: Array<{
            areAllPropsOptional: boolean;
            hasParamDefault: boolean;
            hasVoidOrUndefined: boolean;
            originalParam: TSESTree.Parameter;
            param: TSESTree.ObjectPattern;
            paramDefaultValue: string;
            paramIndex: number;
            paramName: string;
            properties: string[];
            typeAnnotation: TSESTree.TypeNode;
            typeText: string;
        }> = [];

        for (
            let paramIndex = 0;
            paramIndex < node.params.length;
            paramIndex++
        ) {
            let param = node.params[paramIndex];
            let hasParamDefault = false;
            let paramDefaultValue = "";

            if (param.type === AST_NODE_TYPES.AssignmentPattern) {
                hasParamDefault = true;
                paramDefaultValue = sourceCode.getText(param.right);
                param = param.left as TSESTree.ObjectPattern;
            }

            if (param.type !== AST_NODE_TYPES.ObjectPattern) {
                continue;
            }

            if (!param.typeAnnotation) {
                continue;
            }

            const typeAnnotation = param.typeAnnotation.typeAnnotation;
            const { baseType, hasUndefined, hasVoid } =
                hasVoidOrUndefinedInUnion({
                    typeAnnotation,
                });

            const hasVoidOrUndefined = hasVoid || hasUndefined;
            const areAllPropsOptional = areAllPropertiesOptional(baseType);

            if (
                !hasVoidOrUndefined &&
                !areAllPropsOptional &&
                !hasParamDefault
            ) {
                continue;
            }

            const originalParam = node.params[paramIndex];
            const typeText = sourceCode.getText(param.typeAnnotation);
            const properties = extractProperties({
                param,
                sourceCode,
            });

            const paramName =
                paramsToFix.length === 0
                    ? "props"
                    : `props${paramsToFix.length + 1}`;

            paramsToFix.push({
                areAllPropsOptional,
                hasParamDefault,
                hasVoidOrUndefined,
                originalParam,
                param,
                paramDefaultValue,
                paramIndex,
                paramName,
                properties,
                typeAnnotation,
                typeText,
            });
        }

        for (const paramData of paramsToFix) {
            const { hasVoidOrUndefined, param } = paramData;

            context.report({
                fix: (fixer) => {
                    const allDestructuringStatements = paramsToFix
                        .map((p) => {
                            const props = p.properties.join(", ");
                            return `const { ${props} } = ${p.paramName} ?? {};`;
                        })
                        .join("\n  ");

                    const fixes: ReturnType<typeof fixer.replaceText>[] = [];

                    for (const fixData of paramsToFix) {
                        const { hasVoid: isPHasVoid } =
                            hasVoidOrUndefinedInUnion({
                                typeAnnotation: fixData.typeAnnotation,
                            });

                        const pCleanTypeText = buildTypeWithVoid({
                            hasVoid: isPHasVoid,
                            typeAnnotation: fixData.typeAnnotation,
                            typeText: fixData.typeText,
                        });

                        let pNewParam = `${fixData.paramName}: ${pCleanTypeText}`;
                        if (
                            fixData.hasParamDefault &&
                            node.body.type === AST_NODE_TYPES.BlockStatement
                        ) {
                            pNewParam += ` = ${fixData.paramDefaultValue}`;
                        }
                        fixes.push(
                            fixer.replaceTextRange(
                                fixData.originalParam.range,
                                pNewParam
                            )
                        );
                    }

                    if (node.body.type === AST_NODE_TYPES.BlockStatement) {
                        const firstStatement = node.body.body[0];

                        if (firstStatement) {
                            fixes.push(
                                fixer.replaceTextRange(
                                    [
                                        node.body.range[0] + 1,
                                        firstStatement.range[0],
                                    ],
                                    `\n\n  ${allDestructuringStatements}\n  `
                                )
                            );
                        } else {
                            fixes.push(
                                fixer.insertTextAfterRange(
                                    [
                                        node.body.range[0] + 1,
                                        node.body.range[0] + 1,
                                    ],
                                    `\n  ${allDestructuringStatements}\n`
                                )
                            );
                        }

                        return fixes;
                    } else {
                        const bodyText = sourceCode.getText(node.body);

                        const newBody = ` {\n  ${allDestructuringStatements}\n  return ${bodyText};\n}`;

                        const arrowToken = sourceCode.getTokenBefore(
                            node.body,
                            (token) => token.value === "=>"
                        );
                        if (arrowToken) {
                            fixes.push(
                                fixer.replaceTextRange(
                                    [arrowToken.range[1], node.range[1]],
                                    newBody
                                )
                            );
                        } else {
                            fixes.push(fixer.replaceText(node.body, newBody));
                        }

                        return fixes;
                    }
                },
                messageId: hasVoidOrUndefined
                    ? Messages.PREFER_VOID_FOR_OPTIONAL_PARAM
                    : Messages.ADD_VOID_UNION,
                node: param,
            });
        }
    };

    return {
        ArrowFunctionExpression: checkFunction,
        FunctionDeclaration: checkFunction,
        FunctionExpression: checkFunction,
    };
};
