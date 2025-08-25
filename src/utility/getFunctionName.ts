import {
  AST_NODE_TYPES,
  type TSESTree,
} from "@typescript-eslint/typescript-estree";

export function getFunctionName(
  node:
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.FunctionExpression
) {
  if (node.parent?.type === AST_NODE_TYPES.CallExpression) {
    const callExpr = node.parent;

    if (
      callExpr.callee.type === AST_NODE_TYPES.MemberExpression &&
      callExpr.callee.property.type === AST_NODE_TYPES.Identifier
    ) {
      return callExpr.callee.property.name;
    }

    if (callExpr.callee.type === AST_NODE_TYPES.Identifier) {
      return callExpr.callee.name;
    }
  }

  if ("id" in node && node.id?.type === AST_NODE_TYPES.Identifier) {
    return node.id.name;
  }

  if (
    node.parent?.type === AST_NODE_TYPES.Property &&
    node.parent.key.type === AST_NODE_TYPES.Identifier
  ) {
    return node.parent.key.name;
  }

  if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression &&
    node.parent?.type === AST_NODE_TYPES.VariableDeclarator &&
    node.parent.id.type === AST_NODE_TYPES.Identifier
  ) {
    return node.parent.id.name;
  }

  if (
    node.type === AST_NODE_TYPES.FunctionExpression &&
    node.parent?.type === AST_NODE_TYPES.VariableDeclarator &&
    node.parent.id.type === AST_NODE_TYPES.Identifier
  ) {
    return node.parent.id.name;
  }

  return null;
}
