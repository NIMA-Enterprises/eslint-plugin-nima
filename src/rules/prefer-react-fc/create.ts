import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import {
    getFunctionName,
    isComponentFunction,
} from "@utility/function-helpers";
import {
    hasCustomComponentTypeAnnotation,
    hasJSXReturn,
    hasReactFCAnnotation,
} from "@utility/react-helpers";

import { Messages, type Options } from "./config";

export const create = (context: RuleContext<Messages, Options>) => {
    const isReactComponent = (node: TSESTree.FunctionLike) => {
        const fnName = getFunctionName(node);

        if (!fnName || !isComponentFunction(fnName)) {
            return;
        }

        return hasJSXReturn(node);
    };

    const checkFunction = (node: TSESTree.FunctionLike) => {
        if (
            isReactComponent(node) &&
            !hasReactFCAnnotation(node) &&
            !hasCustomComponentTypeAnnotation(node)
        ) {
            const reportNode =
                node.type === AST_NODE_TYPES.FunctionDeclaration && node.id
                    ? node.id
                    : node;
            context.report({
                messageId: Messages.REQUIRE_REACT_FC,
                node: reportNode,
            });
        }
    };

    return {
        ArrowFunctionExpression: checkFunction,
        FunctionDeclaration: checkFunction,
        FunctionExpression: checkFunction,
    };
};
