import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export const getFunctionName = (node: TSESTree.FunctionLike) => {
  if (node.id?.type === AST_NODE_TYPES.Identifier) {
    return node.id.name;
  }

  if (!node.parent) return null;

  switch (node.parent.type) {
    case AST_NODE_TYPES.ArrayExpression:
      break;

    case AST_NODE_TYPES.AssignmentExpression:
      if (node.parent.left.type === AST_NODE_TYPES.Identifier) {
        return node.parent.left.name;
      }
      if (node.parent.left.type === AST_NODE_TYPES.MemberExpression && node.parent.left.property.type === AST_NODE_TYPES.Identifier) {
          return node.parent.left.property.name;
        }
      break;

    case AST_NODE_TYPES.CallExpression:
      if (
        node.parent.callee.type === AST_NODE_TYPES.MemberExpression &&
        node.parent.callee.property.type === AST_NODE_TYPES.Identifier
      ) {
        return node.parent.callee.property.name;
      }
      if (node.parent.callee.type === AST_NODE_TYPES.Identifier) {
        return node.parent.callee.name;
      }
      break;

    case AST_NODE_TYPES.ExportDefaultDeclaration:
      return "default";

    case AST_NODE_TYPES.MethodDefinition:
      if (
        node.parent.key.type === AST_NODE_TYPES.Identifier &&
        !node.parent.computed
      ) {
        const prefix = node.parent.static ? "static " : "";
        const kind =
          node.parent.kind === "method" ? "" : `${node.parent.kind} `;
        return `${prefix}${kind}${node.parent.key.name}`;
      }
      break;

    case AST_NODE_TYPES.NewExpression:
      if (node.parent.callee.type === AST_NODE_TYPES.Identifier) {
        return node.parent.callee.name;
      }
      break;

    case AST_NODE_TYPES.Property:
      if (
        node.parent.key.type === AST_NODE_TYPES.Identifier &&
        !node.parent.computed
      ) {
        return node.parent.key.name;
      }
      break;

    case AST_NODE_TYPES.VariableDeclarator:
      if (node.parent.id.type === AST_NODE_TYPES.Identifier) {
        return node.parent.id.name;
      }
      break;
  }

  return null;
};

export const getFunctionNameWithContext = (node: TSESTree.FunctionLike) => {
  const name = getFunctionName(node);

  if (!name) return null;

  let context = "function";

  if (node.parent) {
    switch (node.parent.type) {
      case AST_NODE_TYPES.AssignmentExpression:
        context = "assignment";
        break;
      case AST_NODE_TYPES.CallExpression:
        context = "callback";
        break;
      case AST_NODE_TYPES.ExportDefaultDeclaration:
        context = "export";
        break;
      case AST_NODE_TYPES.MethodDefinition:
        context = "method";
        break;
      case AST_NODE_TYPES.Property:
        context = node.parent.method ? "method" : "property";
        break;
      case AST_NODE_TYPES.VariableDeclarator:
        context = "variable";
        break;
    }
  }

  return { context, name };
};

export const isComponentFunction = (fnName: string) => {
  return !!/^[A-Z]/.test(fnName);
};

export const hasReactTypeAnnotation = (
  declarator: TSESTree.VariableDeclarator
): boolean => {
  if (
    declarator.id.type === AST_NODE_TYPES.Identifier &&
    declarator.id.typeAnnotation
  ) {
    const typeAnnotation = declarator.id.typeAnnotation.typeAnnotation;

    if (typeAnnotation.type === AST_NODE_TYPES.TSTypeReference) {
      const typeName = typeAnnotation.typeName;

      if (typeName.type === AST_NODE_TYPES.Identifier) {
        return typeName.name === "FunctionComponent";
      }

      if (
        typeName.type === AST_NODE_TYPES.TSQualifiedName &&
        typeName.left.type === AST_NODE_TYPES.Identifier &&
        typeName.left.name === "React" &&
        typeName.right.type === AST_NODE_TYPES.Identifier
      ) {
        return (
          typeName.right.name === "FC" ||
          typeName.right.name === "FunctionComponent"
        );
      }
    }
  }

  return false;
};

export const isReactReturn = (node: TSESTree.FunctionLike): boolean => {
  if (node.returnType?.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference) {
    const typeName = node.returnType.typeAnnotation.typeName;
    if (
      (typeName.type === AST_NODE_TYPES.Identifier &&
        (typeName.name === "ReactNode" || typeName.name === "JSX.Element")) ||
      (typeName.type === AST_NODE_TYPES.TSQualifiedName &&
        typeName.left.type === AST_NODE_TYPES.Identifier &&
        typeName.left.name === "React" &&
        typeName.right.type === AST_NODE_TYPES.Identifier &&
        (typeName.right.name === "ReactNode" ||
          typeName.right.name === "Element"))
    ) {
      return true;
    }
  }

  if (node.body?.type === AST_NODE_TYPES.BlockStatement) {
    const returnStatement = node.body.body.find(
      (statement) => statement.type === AST_NODE_TYPES.ReturnStatement
    );
    if (returnStatement?.argument) {
      return returnStatement.argument.type.startsWith("JSX");
    }
  } else if (node.body?.type.startsWith("JSX")) {
    return true;
  }

  return false;
};
