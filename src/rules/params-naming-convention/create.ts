import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { getFunctionName } from "@utility/function-helpers";

import { Messages, type Options } from "./config";

export const create = (
    context: RuleContext<Messages, Options>,
    [options]: readonly Options[number][]
) => {
    const {
        allowedParameters = 1,
        ignore = ["e"],
        ignoreFunctions = ["reduce"],
        ignorePrefixes = ["$"],
    } = options;

    const checkParams = (node: TSESTree.FunctionLike) => {
        const parameters = node.params;
        const fnName = getFunctionName(node);

        if (parameters.length <= allowedParameters) {
            return;
        }

        if (fnName && ignoreFunctions.includes(fnName)) {
            return;
        }

        if (
            parameters.length === 1 &&
            parameters[0].type === AST_NODE_TYPES.ObjectPattern
        ) {
            return;
        }

        if (
            parameters.length > 1 &&
            parameters[1].type === AST_NODE_TYPES.Identifier &&
            parameters[1].name === "index"
        ) {
            return;
        }

        const identifiers = parameters.filter(
            (p): p is TSESTree.Identifier =>
                p.type === AST_NODE_TYPES.Identifier
        );

        const parameterNames = identifiers.filter(
            (p) =>
                !ignore.includes(p.name) &&
                !ignorePrefixes?.some((prefix) => p.name.startsWith(prefix))
        );

        const suggestedParameters = ignorePrefixes.flatMap((ignoredPrefix) =>
            parameterNames
                .slice(-(parameterNames.length - allowedParameters))
                .map((parameter) => ignoredPrefix + parameter.name)
        );

        if (parameterNames.length > 0) {
            context.report({
                data: {
                    count: suggestedParameters.length.toString(),
                    params: suggestedParameters.join(", "),
                },
                messageId: Messages.USE_OBJECT_PARAMETERS,
                node,
            });
        }
    };

    return {
        ArrowFunctionExpression: checkParams,
        FunctionDeclaration: checkParams,
        FunctionExpression: checkParams,
    };
};
