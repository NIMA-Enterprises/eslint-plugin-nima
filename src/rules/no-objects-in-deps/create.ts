import { HOOKS_WITH_DEPS } from "@constants/hooks";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { getCalleeName } from "@utility/call-expression-helpers";

import { Messages, type Options } from "./config";

export const create = (context: RuleContext<Messages, Options>) => {
    const services = context.sourceCode.parserServices;
    const checker = services?.program?.getTypeChecker();

    const isObjectType = (element: TSESTree.Expression): boolean => {
        if (element.type === AST_NODE_TYPES.ObjectExpression) {
            return true;
        }

        if (element.type === AST_NODE_TYPES.NewExpression) {
            return true;
        }

        if (
            element.type === AST_NODE_TYPES.Literal ||
            element.type === AST_NODE_TYPES.TemplateLiteral ||
            element.type === AST_NODE_TYPES.ArrayExpression ||
            element.type === AST_NODE_TYPES.ArrowFunctionExpression ||
            element.type === AST_NODE_TYPES.FunctionExpression
        ) {
            return false;
        }

        if (!checker || !services?.esTreeNodeToTSNodeMap) {
            return false;
        }

        try {
            const tsNode = services.esTreeNodeToTSNodeMap.get(element);
            if (!tsNode) {
                return false;
            }

            const type = checker.getTypeAtLocation(tsNode);
            if (!type) {
                return false;
            }

            const typeString = checker.typeToString(type);

            const primitiveTypes = [
                "string",
                "number",
                "boolean",
                "symbol",
                "bigint",
                "null",
                "undefined",
                "void",
            ];

            if (primitiveTypes.includes(typeString)) {
                return false;
            }

            if (type.getCallSignatures().length > 0) {
                return false;
            }

            if (typeString.endsWith("[]") || typeString.startsWith("Array<")) {
                return false;
            }

            const properties = type.getProperties();
            if (properties.length > 0) {
                return true;
            }

            return false;
        } catch {
            return false;
        }
    };

    const checkDep = (element: TSESTree.Expression) => {
        if (isObjectType(element)) {
            context.report({
                data: {
                    object: context.sourceCode.getText(element),
                },
                messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                node: element,
            });
        }
    };

    const checkCallExpression = (node: TSESTree.CallExpression) => {
        const calleeName = getCalleeName(node);
        if (!calleeName || !HOOKS_WITH_DEPS.has(calleeName)) {
            return;
        }

        const deps = node.arguments[1];
        if (deps?.type === AST_NODE_TYPES.ArrayExpression) {
            for (const element of deps.elements) {
                if (!element || element.type === AST_NODE_TYPES.SpreadElement) {
                    continue;
                }
                checkDep(element);
            }
        }
    };

    return {
        CallExpression: checkCallExpression,
    };
};
