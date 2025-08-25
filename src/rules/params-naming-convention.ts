import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

import { getFunctionName } from "../utility/getFunctionName.js";

export const name = "params-naming-convention";

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  create: (context, options) => {
    const ignore = options[0].ignore;
    const ignorePrefixes = options[0].ignorePrefixes;
    const allowedParameters = options[0].allowedParameters;
    const ignoreFunctions = options[0].ignoreFunctions;

    function checkParams(
      node:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
    ) {
      if (node.params.length <= allowedParameters) {
        return;
      }

      const fnName = getFunctionName(node);

      if (fnName && ignoreFunctions?.includes(fnName)) {
        return;
      }

      if (
        node.params.length > 1 &&
        node.params[1].type === AST_NODE_TYPES.Identifier &&
        node.params[1].name === "index"
      ) {
        return;
      }

      if (
        node.params[0] &&
        node.params[0].type === AST_NODE_TYPES.ObjectPattern
      )
        return;

      const paramNames = node.params
        .map((p) => {
          if (p.type === AST_NODE_TYPES.Identifier) return p.name;
          return null;
        })
        .filter((name): name is string => !!name)
        .filter(
          (name) =>
            !ignore.includes(name) &&
            !ignorePrefixes?.some((prefix) => name.startsWith(prefix))
        );

      if (paramNames.length > 0) {
        context.report({
          data: {
            count: paramNames.length.toString(),
            params: paramNames.join(", "),
          },
          messageId: "useObjectParams",
          node,
        });
      }
    }
    return {
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression":
        checkParams,
    };
  },

  defaultOptions: [
    {
      allowedParameters: 1,
      ignore: ["e"],
      ignoreFunctions: ["reduce"],
      ignorePrefixes: ["$"],
    },
  ],

  meta: {
    docs: {
      description: "Enforce using a single object parameter for all functions",
    },
    messages: {
      useObjectParams:
        "DragonSwap: Function has {{count}} parameter(s). Use a single object parameter instead: {{params}}",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowedParameters: {
            default: 1,
            type: "number",
          },
          ignore: {
            items: { type: "string" },
            type: "array",
          },
          ignoreFunctions: {
            items: { type: "string" },
            type: "array",
          },
          ignorePrefixes: {
            items: { type: "string" },
            type: "array",
          },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
});
