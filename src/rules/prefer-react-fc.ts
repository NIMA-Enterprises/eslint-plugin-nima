import { Messages, type Options } from "@models/prefer-react-fc.model";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/utils";
import {
  getFunctionName,
  isComponentFunction,
} from "@utility/function-helpers";

export const name = "prefer-react-fc";

export const rule = ESLintUtils.RuleCreator.withoutDocs<Options, Messages>({
  create(context) {
    function isReactComponent(node: TSESTree.FunctionLike) {
      const fnName = getFunctionName(node);

      if (!isComponentFunction(fnName)) {
        return;
      }

      return hasJSXReturn(node);
    }

    function hasJSXReturn(node: TSESTree.FunctionLike) {
      if (!node.body) {
        return false;
      }

      if (node.body.type === AST_NODE_TYPES.BlockStatement) {
        return checkBlockForJSX(node.body);
      } else {
        return isJSXExpression(node.body);
      }
    }

    function checkBlockForJSX(block: TSESTree.BlockStatement) {
      for (const statement of block.body) {
        if (
          statement.type === AST_NODE_TYPES.ReturnStatement &&
          statement.argument
        ) {
          if (isJSXExpression(statement.argument)) {
            return true;
          }
        }
        if (statement.type === AST_NODE_TYPES.IfStatement) {
          if (
            statement.consequent.type === AST_NODE_TYPES.BlockStatement &&
            checkBlockForJSX(statement.consequent)
          ) {
            return true;
          }
          if (
            statement.alternate?.type === AST_NODE_TYPES.BlockStatement &&
            checkBlockForJSX(statement.alternate)
          ) {
            return true;
          }
        }
      }
      return false;
    }

    function isJSXExpression(node: TSESTree.Node): boolean {
      return (
        node.type === AST_NODE_TYPES.JSXElement ||
        node.type === AST_NODE_TYPES.JSXFragment ||
        (node.type === AST_NODE_TYPES.ConditionalExpression &&
          (isJSXExpression(node.consequent) ||
            isJSXExpression(node.alternate))) ||
        (node.type === AST_NODE_TYPES.LogicalExpression &&
          isJSXExpression(node.right))
      );
    }

    function hasReactFCAnnotation(node: TSESTree.Node) {
      if (
        node.parent?.type === AST_NODE_TYPES.VariableDeclarator &&
        node.parent.id.type === AST_NODE_TYPES.Identifier &&
        node.parent.id.typeAnnotation
      ) {
        const typeAnnotation = node.parent.id.typeAnnotation.typeAnnotation;
        return containsReactFCType(typeAnnotation);
      }
      if (node.type === AST_NODE_TYPES.FunctionDeclaration && node.returnType) {
        return containsReactFCType(node.returnType.typeAnnotation);
      }
      return false;
    }

    function hasCustomComponentTypeAnnotation(node: TSESTree.Node) {
      if (
        node.parent?.type === AST_NODE_TYPES.VariableDeclarator &&
        node.parent.id.type === AST_NODE_TYPES.Identifier &&
        node.parent.id.typeAnnotation
      ) {
        const typeAnnotation = node.parent.id.typeAnnotation.typeAnnotation;
        return hasCustomComponentType(typeAnnotation);
      }
      if (node.type === AST_NODE_TYPES.FunctionDeclaration && node.returnType) {
        return hasCustomComponentType(node.returnType.typeAnnotation);
      }
      return false;
    }

    function hasCustomComponentType(typeNode: TSESTree.Node) {
      if (typeNode.type === AST_NODE_TYPES.TSIntersectionType) {
        return typeNode.types.some((type) => isCustomComponentType(type));
      }

      if (typeNode.type === AST_NODE_TYPES.TSUnionType) {
        return typeNode.types.some((type) => isCustomComponentType(type));
      }

      return isCustomComponentType(typeNode);
    }

    function isCustomComponentType(typeNode: TSESTree.Node) {
      if (typeNode.type === AST_NODE_TYPES.TSTypeReference) {
        const typeName = typeNode.typeName;

        if (typeName.type === AST_NODE_TYPES.TSQualifiedName) {
          return true;
        }

        if (typeName.type === AST_NODE_TYPES.Identifier) {
          const name = typeName.name;
          if (name === "FC" || name === "FunctionComponent") {
            return false;
          }
          return name.endsWith("Component");
        }
      }
      return false;
    }

    function containsReactFCType(typeNode: TSESTree.Node) {
      if (typeNode.type === AST_NODE_TYPES.TSIntersectionType) {
        return typeNode.types.some((type) => isReactFCType(type));
      }

      if (typeNode.type === AST_NODE_TYPES.TSUnionType) {
        return typeNode.types.some((type) => isReactFCType(type));
      }

      return isReactFCType(typeNode);
    }

    function isReactFCType(typeNode: TSESTree.Node) {
      if (
        typeNode.type === AST_NODE_TYPES.TSTypeReference &&
        typeNode.typeName.type === AST_NODE_TYPES.TSQualifiedName &&
        typeNode.typeName.left.type === AST_NODE_TYPES.Identifier &&
        typeNode.typeName.left.name === "React" &&
        typeNode.typeName.right.type === AST_NODE_TYPES.Identifier &&
        (typeNode.typeName.right.name === "FC" ||
          typeNode.typeName.right.name === "FunctionComponent")
      ) {
        return true;
      }
      if (
        typeNode.type === AST_NODE_TYPES.TSTypeReference &&
        typeNode.typeName.type === AST_NODE_TYPES.Identifier &&
        (typeNode.typeName.name === "FC" ||
          typeNode.typeName.name === "FunctionComponent")
      ) {
        return true;
      }
      return false;
    }

    return {
      ArrowFunctionExpression(node) {
        if (
          isReactComponent(node) &&
          !hasReactFCAnnotation(node) &&
          !hasCustomComponentTypeAnnotation(node)
        ) {
          context.report({
            messageId: Messages.REQUIRE_REACT_FC,
            node,
          });
        }
      },
      FunctionDeclaration(node) {
        if (
          isReactComponent(node) &&
          !hasReactFCAnnotation(node) &&
          !hasCustomComponentTypeAnnotation(node)
        ) {
          context.report({
            messageId: Messages.REQUIRE_REACT_FC,
            node: node.id || node,
          });
        }
      },
    };
  },

  defaultOptions: [
    {
      allowArrowFunctions: true,
      allowFunctionDeclarations: true,
    },
  ],

  meta: {
    docs: {
      description:
        "Enforce React.FC type annotation for React component functions",
    },
    fixable: "code",
    messages: {
      [Messages.REQUIRE_REACT_FC]:
        "NIMA: Component functions must use React.FC type annotation.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowArrowFunctions: {
            default: true,
            type: "boolean",
          },
          allowFunctionDeclarations: {
            default: true,
            type: "boolean",
          },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
});
