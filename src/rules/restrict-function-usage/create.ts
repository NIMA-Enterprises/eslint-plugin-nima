import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { isFileMatched } from "@utility/file-helpers";

import { Messages, type Options } from "./config";

export const create = (
    context: RuleContext<Messages, Options>,
    [options = []]: readonly Options[number][]
) => {
    const isFunctionDisabled = ({
        filename,
        fnName,
    }: {
        filename: string;
        fnName: string;
    }) => {
        return options.some((option) => {
            const {
                allowFunctions = [],
                disableFunctions = [],
                files = [],
                folders = [],
            } = option;

            let isAppliesToFile = false;
            isAppliesToFile =
                files.length === 0 && folders.length === 0
                    ? true
                    : isFileMatched({
                          filename,
                          files,
                          folders,
                      });

            if (allowFunctions.length > 0) {
                const isFunctionInAllowList = allowFunctions.some(
                    (fn) => fn.toLowerCase() === fnName.toLowerCase()
                );

                if (isFunctionInAllowList) {
                    return files.length === 0 && folders.length === 0
                        ? false
                        : !isAppliesToFile;
                }
                return false;
            }

            if (!isAppliesToFile) {
                return false;
            }

            if (
                disableFunctions.some(
                    (fn) => fn.toLowerCase() === fnName.toLowerCase()
                )
            ) {
                return true;
            }

            return false;
        });
    };

    const checkCallExpression = (node: TSESTree.CallExpression) => {
        const callee = node.callee;
        const filename = context.filename;

        if (callee.type === AST_NODE_TYPES.Identifier) {
            if (
                isFunctionDisabled({
                    filename,
                    fnName: callee.name.toLowerCase(),
                })
            ) {
                context.report({
                    data: {
                        filename,
                        fnName: callee.name,
                    },
                    messageId: Messages.FUNCTION_DISALLOWED,
                    node: callee,
                });
            }
        } else if (
            callee.type === AST_NODE_TYPES.MemberExpression &&
            callee.property.type === AST_NODE_TYPES.Identifier &&
            isFunctionDisabled({
                filename,
                fnName: callee.property.name.toLowerCase(),
            })
        ) {
            context.report({
                data: {
                    filename,
                    fnName: callee.property.name,
                },
                messageId: Messages.FUNCTION_DISALLOWED,
                node: callee.property,
            });
        }
    };

    return {
        CallExpression: checkCallExpression,
    };
};
