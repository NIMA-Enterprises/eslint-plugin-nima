import {
    AST_NODE_TYPES,
    type TSESLint,
    type TSESTree,
} from "@typescript-eslint/utils";

export const areAllPropertiesOptional = (
    typeAnnotation: TSESTree.TypeNode
): boolean => {
    if (typeAnnotation.type !== AST_NODE_TYPES.TSTypeLiteral) {
        return false;
    }

    const propertySignatures = typeAnnotation.members.filter(
        (member) => member.type === AST_NODE_TYPES.TSPropertySignature
    );

    if (propertySignatures.length === 0) {
        return false;
    }

    return propertySignatures.every(
        (member) =>
            member.type === AST_NODE_TYPES.TSPropertySignature &&
            member.optional
    );
};

export const buildTypeWithVoid = ({
    hasVoid,
    typeAnnotation,
    typeText,
}: {
    hasVoid: boolean;
    typeAnnotation: TSESTree.TypeNode;
    typeText: string;
}) => {
    let cleanTypeText = typeText.replace(/^:\s*/, "");

    if (!hasVoid) {
        const isNeedsParentheses =
            typeAnnotation.type !== AST_NODE_TYPES.TSTypeLiteral &&
            typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference &&
            typeAnnotation.type !== AST_NODE_TYPES.TSUnionType;

        cleanTypeText = isNeedsParentheses
            ? `(${cleanTypeText}) | void`
            : `${cleanTypeText} | void`;
    }

    return cleanTypeText;
};

export const extractProperties = ({
    param,
    sourceCode,
}: {
    param: TSESTree.ObjectPattern;
    sourceCode: TSESLint.SourceCode;
}) => {
    const properties: string[] = [];

    for (const prop of param.properties) {
        if (
            prop.type === AST_NODE_TYPES.Property &&
            prop.key.type === AST_NODE_TYPES.Identifier
        ) {
            const propName = prop.key.name;

            if (prop.value.type === AST_NODE_TYPES.AssignmentPattern) {
                const defaultValue = sourceCode.getText(prop.value.right);
                properties.push(`${propName} = ${defaultValue}`);
            } else {
                properties.push(propName);
            }
        } else if (
            prop.type === AST_NODE_TYPES.RestElement &&
            prop.argument.type === AST_NODE_TYPES.Identifier
        ) {
            properties.push(`...${prop.argument.name}`);
        }
    }

    return properties;
};

export const hasVoidOrUndefinedInUnion = ({
    typeAnnotation,
}: {
    typeAnnotation: TSESTree.TypeNode;
}) => {
    let hasVoid = false;
    let hasUndefined = false;
    let baseType = typeAnnotation;

    if (typeAnnotation.type === AST_NODE_TYPES.TSUnionType) {
        hasVoid = typeAnnotation.types.some(
            (t) => t.type === AST_NODE_TYPES.TSVoidKeyword
        );
        hasUndefined = typeAnnotation.types.some(
            (t) => t.type === AST_NODE_TYPES.TSUndefinedKeyword
        );

        const nonVoidUndefinedType = typeAnnotation.types.find(
            (t) =>
                t.type !== AST_NODE_TYPES.TSVoidKeyword &&
                t.type !== AST_NODE_TYPES.TSUndefinedKeyword
        );
        if (nonVoidUndefinedType) {
            baseType = nonVoidUndefinedType;
        }
    }

    return { baseType, hasUndefined, hasVoid };
};
