import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { isFileMatched } from "@utility/file-helpers";
import { minimatch } from "minimatch";

import { Messages, type Options } from "./config";

export const create = (
    context: RuleContext<Messages, Options>,
    [options = []]: readonly Options[number][]
) => {
    const isImportDisabled = ({
        filename,
        importName,
        importSource,
    }: {
        filename: string;
        importName: string;
        importSource: string;
    }) => {
        return options.some((option) => {
            const {
                allowImports = [],
                disableImports = [],
                files = [],
                folders = [],
                from = [],
            } = option;

            const hasFromRestriction = from.length > 0;
            if (hasFromRestriction) {
                const isSourceMatches = from.some((pattern) =>
                    minimatch(importSource, pattern)
                );
                if (!isSourceMatches) {
                    return false;
                }
            }

            let isAppliesToFile = false;
            isAppliesToFile =
                files.length === 0 && folders.length === 0
                    ? true
                    : isFileMatched({
                          filename,
                          files,
                          folders,
                      });

            if (allowImports.length > 0) {
                const isImportInAllowList = allowImports.some(
                    (imp) => imp.toLowerCase() === importName.toLowerCase()
                );

                if (isImportInAllowList) {
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
                disableImports.some(
                    (imp) => imp.toLowerCase() === importName.toLowerCase()
                )
            ) {
                return true;
            }

            return false;
        });
    };

    const checkImportDeclaration = (node: TSESTree.ImportDeclaration) => {
        const filename = context.filename;
        const importSource =
            typeof node.source.value === "string" ? node.source.value : "";

        for (const specifier of node.specifiers) {
            let importName: string;

            switch (specifier.type) {
                case AST_NODE_TYPES.ImportDefaultSpecifier: {
                    importName = specifier.local.name;

                    break;
                }
                case AST_NODE_TYPES.ImportNamespaceSpecifier: {
                    importName = specifier.local.name;

                    break;
                }
                case AST_NODE_TYPES.ImportSpecifier: {
                    importName =
                        specifier.imported.type === AST_NODE_TYPES.Identifier
                            ? specifier.imported.name
                            : specifier.imported.value;

                    break;
                }
                default: {
                    continue;
                }
            }

            if (
                isImportDisabled({
                    filename,
                    importName: importName.toLowerCase(),
                    importSource,
                })
            ) {
                context.report({
                    data: {
                        filename,
                        importName,
                    },
                    messageId: Messages.IMPORT_DISALLOWED,
                    node: specifier,
                });
            }
        }
    };

    return {
        ImportDeclaration: checkImportDeclaration,
    };
};
