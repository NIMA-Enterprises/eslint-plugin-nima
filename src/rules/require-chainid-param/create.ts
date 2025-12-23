import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext, RuleFixer } from "@typescript-eslint/utils/ts-eslint";

import { Messages, type Options } from "./config";

type FixAddChainIdDefaultParams = {
    defaultChainId: string;
    fixer: RuleFixer;
    prop: TSESTree.Property;
};

type FixAddChainIdParamParams = {
    chainIdType: string;
    defaultChainId: string;
    fixer: RuleFixer;
    fn: FunctionNode;
    sourceCode: string;
};

type FixAddChainIdToCallParams = {
    fixer: RuleFixer;
    node: TSESTree.CallExpression;
    sourceCode: string;
};

type FixAddImportsParams = {
    fixer: RuleFixer;
    lastImportNode: null | TSESTree.ImportDeclaration;
    missingImports: string[];
    walletConnectionImportNode: null | TSESTree.ImportDeclaration;
};

type FunctionNode =
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression;

type WagmiImport = {
    functionName: string;
    node: TSESTree.ImportSpecifier;
};

const getOptionsObjectFromCall = (
    node: TSESTree.CallExpression
): null | TSESTree.ObjectExpression => {
    for (const arg of node.arguments) {
        if (arg.type === AST_NODE_TYPES.ObjectExpression) {
            return arg;
        }
    }
    return null;
};

const fixAddChainIdDefault = ({
    defaultChainId,
    fixer,
    prop,
}: FixAddChainIdDefaultParams): ReturnType<RuleFixer["insertTextAfter"]> => {
    return fixer.insertTextAfter(prop.value, ` = ${defaultChainId}`);
};

const fixAddChainIdToCall = ({
    fixer,
    node,
    sourceCode,
}: FixAddChainIdToCallParams): null | ReturnType<
    RuleFixer["insertTextAfter"]
> => {
    const optionsObj = getOptionsObjectFromCall(node);
    if (!optionsObj || optionsObj.properties.length === 0) {
        return null;
    }

    const lastProp = optionsObj.properties.at(-1);
    if (!lastProp) {
        return null;
    }

    const textAfterLastProp = sourceCode.slice(lastProp.range[1]);
    const commaMatch = /^(\s*)(,)?/.exec(textAfterLastProp);
    const hasTrailingComma = commaMatch?.[2] === ",";

    if (hasTrailingComma) {
        const commaIndex =
            lastProp.range[1] + (commaMatch?.[1]?.length ?? 0) + 1;
        return fixer.insertTextAfterRange(
            [lastProp.range[0], commaIndex],
            "\n        chainId"
        );
    } else {
        return fixer.insertTextAfter(lastProp, ",\n        chainId");
    }
};

const fixAddChainIdParam = ({
    chainIdType,
    defaultChainId,
    fixer,
    fn,
    sourceCode,
}: FixAddChainIdParamParams):
    | null
    | ReturnType<RuleFixer["insertTextAfter"]>[] => {
    const params = fn.params;

    for (const param of params) {
        if (param.type === AST_NODE_TYPES.ObjectPattern) {
            const typeAnnotation = param.typeAnnotation;
            const lastProp = param.properties.at(-1);

            if (lastProp) {
                const fixes: ReturnType<RuleFixer["insertTextAfter"]>[] = [];

                fixes.push(
                    fixer.insertTextAfter(
                        lastProp,
                        `,\n    chainId = ${defaultChainId}`
                    )
                );

                if (
                    typeAnnotation &&
                    typeAnnotation.typeAnnotation.type ===
                        AST_NODE_TYPES.TSTypeLiteral
                ) {
                    const typeLiteral = typeAnnotation.typeAnnotation;
                    const lastTypeMember = typeLiteral.members.at(-1);
                    if (lastTypeMember) {
                        const memberText = sourceCode.slice(
                            lastTypeMember.range[0],
                            lastTypeMember.range[1]
                        );
                        const hasMemberSemicolon = memberText
                            .trimEnd()
                            .endsWith(";");

                        const textAfterMember = sourceCode.slice(
                            lastTypeMember.range[1]
                        );
                        const hasTrailingSemicolonOutside =
                            /^\s*;/.exec(textAfterMember) !== null;

                        const shouldUseSemicolons =
                            hasMemberSemicolon || hasTrailingSemicolonOutside;
                        const separator = shouldUseSemicolons ? "" : ";";
                        const trailingSemi = shouldUseSemicolons ? ";" : "";

                        fixes.push(
                            fixer.insertTextAfter(
                                lastTypeMember,
                                `${separator}\n    chainId?: ${chainIdType}${trailingSemi}`
                            )
                        );
                    }
                }

                return fixes;
            }
        }
    }

    return null;
};

const fixAddImports = ({
    fixer,
    lastImportNode,
    missingImports,
    walletConnectionImportNode,
}: FixAddImportsParams): null | ReturnType<RuleFixer["insertTextAfter"]> => {
    if (missingImports.length === 0) {
        return null;
    }

    if (walletConnectionImportNode) {
        const specifiers = walletConnectionImportNode.specifiers.filter(
            (s): s is TSESTree.ImportSpecifier =>
                s.type === AST_NODE_TYPES.ImportSpecifier
        );

        if (specifiers.length > 0) {
            const lastSpecifier = specifiers.at(-1);
            if (lastSpecifier) {
                const importText = missingImports.join(", ");
                return fixer.insertTextAfter(lastSpecifier, `, ${importText}`);
            }
        }
    }

    if (lastImportNode) {
        const importText = missingImports.join(", ");
        return fixer.insertTextAfter(
            lastImportNode,
            `\nimport { ${importText} } from "wallet-connection";`
        );
    }

    return null;
};

export const create = (
    context: RuleContext<Messages, Options>,
    [options = {}]: readonly Options[number][]
) => {
    const {
        chainIdType = '(typeof wagmiConfig)["chains"][number]["id"]',
        defaultChainId = "seiMainnet.id",
        functionNames = ["simulateContract", "readContract"],
        importSource = "wagmi/actions",
    } = options;

    const sourceCode = context.sourceCode.getText();
    const wagmiImports: WagmiImport[] = [];
    let hasSeiMainnetImport = false;
    let hasWagmiConfigImport = false;
    let walletConnectionImportNode: null | TSESTree.ImportDeclaration = null;
    let lastImportNode: null | TSESTree.ImportDeclaration = null;
    let hasReportedImportIssue = false;

    const findEnclosingFunction = (
        node: TSESTree.Node
    ): FunctionNode | null => {
        let current: TSESTree.Node | undefined = node.parent;
        while (current) {
            if (
                current.type === AST_NODE_TYPES.FunctionDeclaration ||
                current.type === AST_NODE_TYPES.FunctionExpression ||
                current.type === AST_NODE_TYPES.ArrowFunctionExpression
            ) {
                return current;
            }
            current = current.parent;
        }
        return null;
    };

    const hasChainIdParam = (fn: FunctionNode): boolean => {
        const params = fn.params;

        for (const param of params) {
            if (param.type === AST_NODE_TYPES.ObjectPattern) {
                for (const prop of param.properties) {
                    if (
                        prop.type === AST_NODE_TYPES.Property &&
                        prop.key.type === AST_NODE_TYPES.Identifier &&
                        prop.key.name === "chainId"
                    ) {
                        return true;
                    }
                }
            } else if (
                param.type === AST_NODE_TYPES.Identifier &&
                param.name === "chainId"
            ) {
                return true;
            }
        }
        return false;
    };

    const getChainIdParamWithoutDefault = (
        fn: FunctionNode
    ): null | TSESTree.Property => {
        const params = fn.params;

        for (const param of params) {
            if (param.type === AST_NODE_TYPES.ObjectPattern) {
                for (const prop of param.properties) {
                    if (
                        prop.type === AST_NODE_TYPES.Property &&
                        prop.key.type === AST_NODE_TYPES.Identifier &&
                        prop.key.name === "chainId" &&
                        prop.value.type === AST_NODE_TYPES.Identifier
                    ) {
                        return prop;
                    }
                }
            }
        }
        return null;
    };

    const hasChainIdInCallOptions = (
        node: TSESTree.CallExpression
    ): boolean => {
        const args = node.arguments;

        for (const arg of args) {
            if (arg.type === AST_NODE_TYPES.ObjectExpression) {
                for (const prop of arg.properties) {
                    if (
                        prop.type === AST_NODE_TYPES.Property &&
                        prop.key.type === AST_NODE_TYPES.Identifier &&
                        prop.key.name === "chainId"
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const reportMissingImports = (fallbackNode: TSESTree.Node) => {
        if (hasReportedImportIssue) {
            return;
        }
        hasReportedImportIssue = true;

        const targetNode = walletConnectionImportNode ?? fallbackNode;
        const missingImports: string[] = [];

        if (!hasSeiMainnetImport) {
            missingImports.push("seiMainnet");
        }
        if (!hasWagmiConfigImport) {
            missingImports.push("wagmiConfig");
        }

        if (walletConnectionImportNode) {
            if (!hasSeiMainnetImport && !hasWagmiConfigImport) {
                context.report({
                    fix: (fixer) =>
                        fixAddImports({
                            fixer,
                            lastImportNode,
                            missingImports,
                            walletConnectionImportNode,
                        }),
                    messageId: Messages.MISSING_IMPORTS,
                    node: targetNode,
                });
            } else if (!hasSeiMainnetImport) {
                context.report({
                    fix: (fixer) =>
                        fixAddImports({
                            fixer,
                            lastImportNode,
                            missingImports: ["seiMainnet"],
                            walletConnectionImportNode,
                        }),
                    messageId: Messages.MISSING_SEI_MAINNET_IMPORT,
                    node: targetNode,
                });
            } else if (!hasWagmiConfigImport) {
                context.report({
                    fix: (fixer) =>
                        fixAddImports({
                            fixer,
                            lastImportNode,
                            missingImports: ["wagmiConfig"],
                            walletConnectionImportNode,
                        }),
                    messageId: Messages.MISSING_WAGMI_CONFIG_IMPORT,
                    node: targetNode,
                });
            }
        } else {
            context.report({
                fix: (fixer) =>
                    fixAddImports({
                        fixer,
                        lastImportNode,
                        missingImports,
                        walletConnectionImportNode,
                    }),
                messageId: Messages.MISSING_IMPORTS,
                node: targetNode,
            });
        }
    };

    const reportedFunctions = new Set<TSESTree.Node>();

    return {
        CallExpression: (node: TSESTree.CallExpression) => {
            if (node.callee.type !== AST_NODE_TYPES.Identifier) {
                return;
            }

            const calleeName = node.callee.name;

            const wagmiImport = wagmiImports.find(
                (imp) => imp.functionName === calleeName
            );

            if (!wagmiImport) {
                return;
            }

            const enclosingFn = findEnclosingFunction(node);

            if (!enclosingFn) {
                return;
            }

            const chainIdWithoutDefault =
                getChainIdParamWithoutDefault(enclosingFn);

            if (chainIdWithoutDefault && !reportedFunctions.has(enclosingFn)) {
                reportedFunctions.add(enclosingFn);
                context.report({
                    fix: (fixer) =>
                        fixAddChainIdDefault({
                            defaultChainId,
                            fixer,
                            prop: chainIdWithoutDefault,
                        }),
                    messageId: Messages.MISSING_CHAINID_DEFAULT,
                    node: chainIdWithoutDefault,
                });
            } else if (
                !hasChainIdParam(enclosingFn) &&
                !reportedFunctions.has(enclosingFn)
            ) {
                reportedFunctions.add(enclosingFn);
                context.report({
                    data: {
                        functionName: calleeName,
                    },
                    fix: (fixer) =>
                        fixAddChainIdParam({
                            chainIdType,
                            defaultChainId,
                            fixer,
                            fn: enclosingFn,
                            sourceCode,
                        }),
                    messageId: Messages.MISSING_CHAINID_PARAM,
                    node: enclosingFn,
                });
            }

            if (!hasChainIdInCallOptions(node)) {
                context.report({
                    data: {
                        functionName: calleeName,
                    },
                    fix: (fixer) =>
                        fixAddChainIdToCall({
                            fixer,
                            node,
                            sourceCode,
                        }),
                    messageId: Messages.MISSING_CHAINID_IN_CALL,
                    node,
                });
            }

            if (!hasSeiMainnetImport || !hasWagmiConfigImport) {
                reportMissingImports(node);
            }
        },

        ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
            lastImportNode = node;

            const source =
                typeof node.source.value === "string" ? node.source.value : "";

            if (source === importSource) {
                for (const specifier of node.specifiers) {
                    if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
                        const importedName =
                            specifier.imported.type ===
                            AST_NODE_TYPES.Identifier
                                ? specifier.imported.name
                                : specifier.imported.value;

                        if (functionNames.includes(importedName)) {
                            wagmiImports.push({
                                functionName: specifier.local.name,
                                node: specifier,
                            });
                        }
                    }
                }
            }

            if (source === "wallet-connection") {
                walletConnectionImportNode = node;
                for (const specifier of node.specifiers) {
                    if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
                        const importedName =
                            specifier.imported.type ===
                            AST_NODE_TYPES.Identifier
                                ? specifier.imported.name
                                : specifier.imported.value;

                        if (importedName === "seiMainnet") {
                            hasSeiMainnetImport = true;
                        }
                        if (importedName === "wagmiConfig") {
                            hasWagmiConfigImport = true;
                        }
                    }
                }
            }
        },
    };
};
