import { HOOKS_WITH_DEPS } from "@constants/hooks";
import { Messages, Options } from "@models/no-objects-in-deps.model";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { createRule } from "@utility/core";

export const name = "no-objects-in-deps";

export const rule = createRule<Options, Messages>({
  create: (context) => {
    const services = context.sourceCode.parserServices;
    const checker = services?.program?.getTypeChecker();

    const getCalleeName = (node: TSESTree.CallExpression) => {
      const callee = node.callee;

      if (callee.type === AST_NODE_TYPES.Identifier) {
        return callee.name;
      }

      if (callee.type === AST_NODE_TYPES.MemberExpression) {
        if (
          !callee.computed &&
          callee.property.type === AST_NODE_TYPES.Identifier
        ) {
          return callee.property.name;
        }
        if (
          callee.computed &&
          callee.property.type === AST_NODE_TYPES.Literal
        ) {
          return String(callee.property.value);
        }
      }

      return null;
    };

    const isObjectType = (element: TSESTree.Expression): boolean => {
      // Always report direct object literals
      if (element.type === AST_NODE_TYPES.ObjectExpression) {
        return true;
      }

      // Always report new expressions (new Date(), etc.)
      if (element.type === AST_NODE_TYPES.NewExpression) {
        return true;
      }

      // Skip literals, arrays, and functions - these are safe
      if (
        element.type === AST_NODE_TYPES.Literal ||
        element.type === AST_NODE_TYPES.TemplateLiteral ||
        element.type === AST_NODE_TYPES.ArrayExpression ||
        element.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        element.type === AST_NODE_TYPES.FunctionExpression
      ) {
        return false;
      }

      // If no TypeScript info, be conservative and don't report
      if (!checker || !services?.esTreeNodeToTSNodeMap) {
        return false;
      }

      // Use TypeScript type checker for identifiers and other expressions
      try {
        const tsNode = services.esTreeNodeToTSNodeMap.get(element);
        if (!tsNode) return false;

        const type = checker.getTypeAtLocation(tsNode);
        if (!type) return false;

        const typeString = checker.typeToString(type);

        // Primitives are safe
        const primitiveTypes = [
          "string",
          "number",
          "boolean",
          "symbol",
          "bigint",
          "null",
          "undefined",
          "void",
        ];

        if (primitiveTypes.includes(typeString)) {
          return false;
        }

        // Check if it's a function type
        if (type.getCallSignatures().length > 0) {
          return false;
        }

        // Check if it's an array type
        if (typeString.endsWith("[]") || typeString.startsWith("Array<")) {
          return false;
        }

        // If it has object-like properties, it's an object
        const properties = type.getProperties();
        if (properties.length > 0) {
          return true;
        }

        return false;
      } catch {
        // If type checking fails, don't report to avoid false positives
        return false;
      }
    };

    const checkDep = (element: TSESTree.Expression) => {
      if (isObjectType(element)) {
        context.report({
          data: {
            object: context.sourceCode.getText(element),
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
          node: element,
        });
      }
    };

    return {
      CallExpression: (node) => {
        const calleeName = getCalleeName(node);
        if (!calleeName || !HOOKS_WITH_DEPS.has(calleeName)) return;

        const deps = node.arguments[1];
        if (deps?.type === AST_NODE_TYPES.ArrayExpression) {
          for (const element of deps.elements) {
            if (!element || element.type === AST_NODE_TYPES.SpreadElement)
              continue;
            checkDep(element);
          }
        }
      },
    };
  },
  defaultOptions: [],

  meta: {
    docs: {
      description: "Suggests to not use objects in dependency arrays",
      recommended: false,
      url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/no-objects-in-deps.md",
    },
    messages: {
      [Messages.NO_OBJECTS_IN_DEPENDENCIES]:
        "NIMA: Objects inside of dependency arrays aren't allowed. Try doing JSON.stringify({{ object }}).",
    },
    schema: [],
    type: "suggestion",
  },

  name,
});
