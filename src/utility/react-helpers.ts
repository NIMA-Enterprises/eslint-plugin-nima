import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

export const isJSXExpression = (node: TSESTree.Node): boolean => {
    return (
        node.type === AST_NODE_TYPES.JSXElement ||
        node.type === AST_NODE_TYPES.JSXFragment ||
        (node.type === AST_NODE_TYPES.ConditionalExpression &&
            (isJSXExpression(node.consequent) ||
                isJSXExpression(node.alternate))) ||
        (node.type === AST_NODE_TYPES.LogicalExpression &&
            isJSXExpression(node.right))
    );
};

export const checkBlockForJSX = (block: TSESTree.BlockStatement): boolean => {
    for (const statement of block.body) {
        if (
            statement.type === AST_NODE_TYPES.ReturnStatement &&
            statement.argument &&
            isJSXExpression(statement.argument)
        ) {
            return true;
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
};

export const hasJSXReturn = (node: TSESTree.FunctionLike) => {
    if (!node.body) {
        return false;
    }

    return node.body.type === AST_NODE_TYPES.BlockStatement
        ? checkBlockForJSX(node.body)
        : isJSXExpression(node.body);
};

export const isReactFCType = (typeNode: TSESTree.Node) => {
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
};

export const hasReactFCType = (typeNode: TSESTree.Node): boolean => {
    if (typeNode.type === AST_NODE_TYPES.TSIntersectionType) {
        return typeNode.types.some((type) => isReactFCType(type));
    }

    if (typeNode.type === AST_NODE_TYPES.TSUnionType) {
        return typeNode.types.some((type) => isReactFCType(type));
    }

    return isReactFCType(typeNode);
};

export const isCustomComponentType = (typeNode: TSESTree.Node) => {
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
};

export const hasCustomComponentType = (typeNode: TSESTree.Node): boolean => {
    if (typeNode.type === AST_NODE_TYPES.TSIntersectionType) {
        return typeNode.types.some((type) => isCustomComponentType(type));
    }

    if (typeNode.type === AST_NODE_TYPES.TSUnionType) {
        return typeNode.types.some((type) => isCustomComponentType(type));
    }

    return isCustomComponentType(typeNode);
};

export const hasReactFCAnnotation = (node: TSESTree.Node) => {
    if (
        node.parent?.type === AST_NODE_TYPES.VariableDeclarator &&
        node.parent.id.type === AST_NODE_TYPES.Identifier &&
        node.parent.id.typeAnnotation
    ) {
        const typeAnnotation = node.parent.id.typeAnnotation.typeAnnotation;
        return hasReactFCType(typeAnnotation);
    }
    if (node.type === AST_NODE_TYPES.FunctionDeclaration && node.returnType) {
        return hasReactFCType(node.returnType.typeAnnotation);
    }
    return false;
};

export const hasCustomComponentTypeAnnotation = (node: TSESTree.Node) => {
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
};
