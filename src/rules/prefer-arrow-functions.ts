import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/utils";

export const name = "prefer-arrow-functions";

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  create: (context, options) => {
    const allowConstructors = options[0].allowConstructors;
    const allowAsync = options[0].allowAsync;
    const allowFunctionDeclarations = options[0].allowFunctionDeclarations;
    const allowFunctionExpressions = options[0].allowFunctionExpressions;
    const allowGenerators = options[0].allowGenerators;
    const allowMethodDefinitions = options[0].allowMethodDefinitions;

    const shouldSkipFunction = (node: TSESTree.FunctionLike) => {
      if (
        allowConstructors &&
        node.parent?.type === AST_NODE_TYPES.MethodDefinition &&
        node.parent.kind === "constructor"
      ) {
        return true;
      }
      if (allowGenerators && "generator" in node && node.generator) {
        return true;
      }
      if (!allowAsync && "async" in node && node.async) {
        return false;
      }
      if (node.type === AST_NODE_TYPES.TSEmptyBodyFunctionExpression) {
        return true;
      }
      return false;
    };
    const generateArrowFunction = (
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.TSEmptyBodyFunctionExpression
    ) => {
      const sourceCode = context.getSourceCode();
      const asyncKeyword = node.async ? "async " : "";
      const params =
        node.params.length === 0
          ? "()"
          : node.params.length === 1 &&
            node.params[0].type === AST_NODE_TYPES.Identifier &&
            !node.params[0].typeAnnotation
          ? sourceCode.getText(node.params[0])
          : `(${node.params.map((p) => sourceCode.getText(p)).join(", ")})`;
      const returnType = node.returnType
        ? `: ${sourceCode.getText(node.returnType.typeAnnotation)}`
        : "";

      const body = node.body ? sourceCode.getText(node.body) : "";
      return `${asyncKeyword}${params}${returnType} => ${body}`;
    };
    return {
      FunctionDeclaration: (node) => {
        if (allowFunctionDeclarations || shouldSkipFunction(node)) {
          return;
        }
        context.report({
          fix: (fixer) => {
            if (!node.id) return null;
            const functionName = node.id.name;
            const arrowFunction = generateArrowFunction(node);
            let replacement;
            if (node.parent?.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
              const constDeclaration = `const ${functionName} = ${arrowFunction}`;
              const exportDeclaration = `export default ${functionName}`;
              replacement = `${constDeclaration};\n${exportDeclaration}`;
              return fixer.replaceText(node.parent, replacement);
            } else if (
              node.parent?.type === AST_NODE_TYPES.ExportNamedDeclaration
            ) {
              replacement = `export const ${functionName} = ${arrowFunction}`;
              return fixer.replaceText(node.parent, replacement);
            } else {
              replacement = `const ${functionName} = ${arrowFunction}`;
              return fixer.replaceText(node, replacement);
            }
          },
          messageId: "preferArrowFunction",
          node: node.id || node,
        });
      },
      FunctionExpression: (node) => {
        if (allowFunctionExpressions || shouldSkipFunction(node)) {
          return;
        }
        if (
          node.parent?.type === AST_NODE_TYPES.MethodDefinition ||
          node.parent?.type === AST_NODE_TYPES.Property
        ) {
          if (!allowMethodDefinitions) {
            return;
          }
          return;
        }
        context.report({
          fix: (fixer) => {
            const arrowFunction = generateArrowFunction(node);
            return fixer.replaceText(node, arrowFunction);
          },
          messageId: "preferArrowFunctionExpression",
          node,
        });
      },
      MethodDefinition: (node) => {
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
              const sourceCode = context.getSourceCode();
              const key = sourceCode.getText(node.key);
              const arrowFunction = generateArrowFunction(node.value);
              const static_ = node.static ? "static " : "";
              const replacement = `${static_}${key} = ${arrowFunction}`;
              return fixer.replaceText(node, replacement);
            },
            messageId: "preferArrowMethod",
            node: node.key,
          });
        }
      },
      Property: (node) => {
        if (allowMethodDefinitions) {
          return;
        }
        if (
          node.method &&
          node.value.type === AST_NODE_TYPES.FunctionExpression &&
          !shouldSkipFunction(node.value)
        ) {
          const fn = node.value as
            | TSESTree.FunctionExpression
            | TSESTree.TSEmptyBodyFunctionExpression;

          context.report({
            fix: (fixer) => {
              const sourceCode = context.getSourceCode();
              const key = sourceCode.getText(node.key);
              const arrowFunction = generateArrowFunction(fn);
              const replacement = `${key}: ${arrowFunction}`;
              return fixer.replaceText(node, replacement);
            },
            messageId: "preferArrowMethod",
            node: node.key,
          });
        }
      },
    };
  },

  defaultOptions: [
    {
      allowAsync: true,
      allowConstructors: true,
      allowFunctionDeclarations: false,
      allowFunctionExpressions: false,
      allowGenerators: true,
      allowMethodDefinitions: false,
    },
  ],

  meta: {
    docs: {
      description:
        "Prefer arrow functions over function declarations and expressions",
    },
    fixable: "code",
    messages: {
      preferArrowFunction:
        "NIMA: Prefer arrow functions over function declarations.",
      preferArrowFunctionExpression:
        "NIMA: Prefer arrow functions over function expressions.",
      preferArrowMethod:
        "NIMA: Prefer arrow functions over method definitions.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowAsync: {
            default: true,
            description:
              "Allow async functions (they can still be arrow functions)",
            type: "boolean",
          },
          allowConstructors: {
            default: true,
            description: "Allow constructor functions",
            type: "boolean",
          },
          allowFunctionDeclarations: {
            default: false,
            description: "Allow function declarations (function name() {})",
            type: "boolean",
          },
          allowFunctionExpressions: {
            default: false,
            description:
              "Allow function expressions (const name = function() {})",
            type: "boolean",
          },
          allowGenerators: {
            default: true,
            description: "Allow generator functions",
            type: "boolean",
          },
          allowMethodDefinitions: {
            default: false,
            description: "Allow method definitions in classes and objects",
            type: "boolean",
          },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },
});
