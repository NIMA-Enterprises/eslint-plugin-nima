import { REACT_HOOKS } from "@constants/hooks";
import { Messages, Options } from "@models/prefer-react-with-hooks.model";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

export const name = "prefer-react-with-hooks";

export const rule = ESLintUtils.RuleCreator.withoutDocs<Options, Messages>({
  create: (context) => {
    const sourceCode = context.sourceCode;
    const program = sourceCode.ast;

    let hasReactImport = false;
    let reactImportNode: null | TSESTree.ImportDeclaration = null;
    let isAnalysisComplete = false;

    const analyzeImports = () => {
      if (isAnalysisComplete) return;

      for (const node of program.body) {
        if (
          node.type === AST_NODE_TYPES.ImportDeclaration &&
          node.source.value === "react"
        ) {
          reactImportNode = node;
          hasReactImport = node.specifiers.some(
            (spec) =>
              spec.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
              (spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier &&
                spec.local.name === "React")
          );
          break;
        }
      }
      isAnalysisComplete = true;
    };

    return {
      CallExpression: (node) => {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          REACT_HOOKS.has(node.callee.name)
        ) {
          analyzeImports();

          const hookName = node.callee.name;
          context.report({
            data: { hook: hookName },
            fix: (fixer) => {
              const fixes = [];

              if (!hasReactImport) {
                if (reactImportNode) {
                  const importText = sourceCode.getText(reactImportNode);

                  if (
                    importText.includes("{") &&
                    !importText.match(/^import\s+\w+\s*,/)
                  ) {
                    fixes.push(
                      fixer.replaceText(
                        reactImportNode,
                        importText.replace(/^import\s*{/, "import React, {")
                      )
                    );
                  }
                }
                fixes.push(
                  fixer.insertTextBefore(
                    program.body.length > 0 ? program.body[0] : node,
                    'import React from "react";\n'
                  )
                );
              }

              fixes.push(fixer.insertTextBefore(node.callee, "React."));

              return fixes;
            },
            messageId: Messages.PREFER_REACT_PREFIX,
            node: node.callee,
          });
        }
      },

      ImportDeclaration: (node) => {
        if (node.source.value === "react") {
          reactImportNode = node;

          hasReactImport = node.specifiers.some(
            (spec) =>
              spec.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
              (spec.type === AST_NODE_TYPES.ImportNamespaceSpecifier &&
                spec.local.name === "React")
          );

          const useImports = node.specifiers.filter(
            (s): s is TSESTree.ImportSpecifier =>
              s.type === AST_NODE_TYPES.ImportSpecifier &&
              s.imported.type === AST_NODE_TYPES.Identifier &&
              REACT_HOOKS.has(s.imported.name)
          );

          if (useImports.length > 0) {
            const firstHookImport = useImports[0];
            const hookNames = useImports
              .map((spec) =>
                spec.imported.type === AST_NODE_TYPES.Identifier
                  ? spec.imported.name
                  : ""
              )
              .filter(Boolean);

            context.report({
              data: {
                hook:
                  hookNames.length === 1
                    ? hookNames[0]
                    : `${hookNames
                        .slice(0, -1)
                        .join(", ")} and ${hookNames.slice(-1)}`,
              },
              fix: (fixer) => {
                const sourceCode = context.sourceCode;
                const fixes = [];

                const remainingSpecifiers = node.specifiers.filter(
                  (spec) =>
                    !(
                      spec.type === AST_NODE_TYPES.ImportSpecifier &&
                      spec.imported.type === AST_NODE_TYPES.Identifier &&
                      REACT_HOOKS.has(spec.imported.name)
                    )
                );

                if (remainingSpecifiers.length === 0 && !hasReactImport) {
                  fixes.push(
                    fixer.replaceText(node, 'import React from "react";')
                  );
                } else if (remainingSpecifiers.length > 0 && !hasReactImport) {
                  const nonDefaultSpecifiers = remainingSpecifiers.filter(
                    (spec) =>
                      spec.type !== AST_NODE_TYPES.ImportDefaultSpecifier
                  );

                  if (nonDefaultSpecifiers.length > 0) {
                    const specifierTexts = nonDefaultSpecifiers
                      .map((spec) => sourceCode.getText(spec))
                      .join(", ");
                    fixes.push(
                      fixer.replaceText(
                        node,
                        `import React, { ${specifierTexts} } from "react";`
                      )
                    );
                  } else {
                    fixes.push(
                      fixer.replaceText(node, 'import React from "react";')
                    );
                  }
                } else if (hasReactImport) {
                  const hasDefaultReact = remainingSpecifiers.some(
                    (spec) =>
                      spec.type === AST_NODE_TYPES.ImportDefaultSpecifier
                  );

                  const namedSpecifiers = remainingSpecifiers.filter(
                    (spec) => spec.type === AST_NODE_TYPES.ImportSpecifier
                  );

                  if (hasDefaultReact && namedSpecifiers.length > 0) {
                    const specifierTexts = namedSpecifiers
                      .map((spec) => sourceCode.getText(spec))
                      .join(", ");
                    fixes.push(
                      fixer.replaceText(
                        node,
                        `import React, { ${specifierTexts} } from "react";`
                      )
                    );
                  } else if (hasDefaultReact && namedSpecifiers.length === 0) {
                    fixes.push(
                      fixer.replaceText(node, 'import React from "react";')
                    );
                  } else if (!hasDefaultReact && namedSpecifiers.length > 0) {
                    const specifierTexts = namedSpecifiers
                      .map((spec) => sourceCode.getText(spec))
                      .join(", ");
                    fixes.push(
                      fixer.replaceText(
                        node,
                        `import { ${specifierTexts} } from "react";`
                      )
                    );
                  }
                }

                return fixes;
              },
              messageId: Messages.PREFER_REACT,
              node: firstHookImport,
            });
          }
        }
      },
    };
  },

  defaultOptions: [],

  meta: {
    docs: {
      description: "Enforce React.use* over named use* imports",
    },
    fixable: "code",
    messages: {
      [Messages.PREFER_REACT]:
        "NIMA: Use React.{{hook}} instead of importing {{hook}} directly.",
      [Messages.PREFER_REACT_PREFIX]: "NIMA: Prefix {{hook}} with React.",
    },
    schema: [],
    type: "problem",
  },
});
