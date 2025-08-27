import { Messages, type Options } from "@models/prefer-arrow-functions.model";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/utils";

export const name = "prefer-arrow-functions";

export const rule = ESLintUtils.RuleCreator.withoutDocs<Options, Messages>({
  create: (context, [options]) => {
    const {
      allowAsync = true,
      allowConstructors = true,
      allowFunctionDeclarations = true,
      allowFunctionExpressions = true,
      allowGenerators = true,
      allowMethodDefinitions = true,
    } = options;

    const sourceCode = context.sourceCode;

    const shouldSkipFunction = (node: TSESTree.FunctionLike) => {
      if (
        allowConstructors &&
        node.parent?.type === AST_NODE_TYPES.MethodDefinition &&
        node.parent.kind === "constructor"
      ) {
        return true;
      }
      if (allowGenerators && node?.generator) {
        return true;
      }
      if (!allowAsync && node?.async) {
        return false;
      }
      if (node.type === AST_NODE_TYPES.TSEmptyBodyFunctionExpression) {
        return true;
      }
      return false;
    };
    const generateArrowFunction = (node: TSESTree.FunctionLike) => {
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
          messageId: Messages.PREFER_ARROW_FUNCTIONS,
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
          messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
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
              const key = sourceCode.getText(node.key);
              const arrowFunction = generateArrowFunction(node.value);
              const static_ = node.static ? "static " : "";
              const replacement = `${static_}${key} = ${arrowFunction}`;
              return fixer.replaceText(node, replacement);
            },
            messageId: Messages.PREFER_ARROW_METHOD,
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
              const key = sourceCode.getText(node.key);
              const arrowFunction = generateArrowFunction(fn);
              const replacement = `${key}: ${arrowFunction}`;
              return fixer.replaceText(node, replacement);
            },
            messageId: Messages.PREFER_ARROW_METHOD,
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
      [Messages.PREFER_ARROW_FUNCTION_EXPRESSION]:
        "NIMA: Prefer arrow functions over function expressions.",
      [Messages.PREFER_ARROW_FUNCTIONS]:
        "NIMA: Prefer arrow functions over function declarations.",
      [Messages.PREFER_ARROW_METHOD]:
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
