import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

export const getCalleeName = (node: TSESTree.CallExpression) => {
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
