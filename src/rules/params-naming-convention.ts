import { Messages, type Options } from "@models/params-naming-convention.model";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";
import { getFunctionName } from "@utility/function-helpers";

export const name = "params-naming-convention";

export const rule = createRule<Options, Messages>({
  create: (context, [options]) => {
    const {
      allowedParameters = 1,
      ignore = ["e"],
      ignoreFunctions = ["reduce"],
      ignorePrefixes = ["$"],
    } = options;

    function checkParams(node: TSESTree.FunctionLike) {
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
      )
        return;

      if (
        parameters.length > 1 &&
        parameters[1].type === AST_NODE_TYPES.Identifier &&
        parameters[1].name === "index"
      ) {
        return;
      }

      const identifiers = parameters.filter(
        (p): p is TSESTree.Identifier => p.type === AST_NODE_TYPES.Identifier
      );

      const parameterNames = identifiers.filter(
        (p) =>
          !ignore.includes(p.name) &&
          !ignorePrefixes?.some((prefix) => p.name.startsWith(prefix))
      );

      const suggestedParameters = ignorePrefixes.flatMap((ignoredPrefix) =>
        parameterNames.map((parameter) => ignoredPrefix + parameter.name)
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
      recommended: false,
      url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/params-naming-convention.md",
    },
    messages: {
      [Messages.USE_OBJECT_PARAMETERS]:
        "NIMA: Function has {{count}} parameter(s). Either prefix them: {{params}}, or put all parameters in one object.",
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

  name,
});
