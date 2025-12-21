import {
  Messages,
  type Options,
} from "@models/prefer-void-for-optional-param.model";
import {
  AST_NODE_TYPES,
  type TSESLint,
  type TSESTree,
} from "@typescript-eslint/utils";
import { createRule } from "@utility/core";

export const name = "prefer-void-for-optional-param";

const areAllPropertiesOptional = (
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
      member.type === AST_NODE_TYPES.TSPropertySignature && member.optional
  );
};

const buildTypeWithVoid = ({
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

    cleanTypeText = isNeedsParentheses ? `(${cleanTypeText}) | void` : `${cleanTypeText} | void`;
  }

  return cleanTypeText;
};

const extractProperties = ({
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

const hasVoidOrUndefinedInUnion = ({
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

export const rule = createRule<Options, Messages>({
  create: (context) => {
    const sourceCode = context.sourceCode;

    const checkFunction = (
      node:
        | TSESTree.ArrowFunctionExpression
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
    ) => {
      const paramsToFix: Array<{
        areAllPropsOptional: boolean;
        hasParamDefault: boolean;
        hasVoidOrUndefined: boolean;
        originalParam: TSESTree.Parameter;
        param: TSESTree.ObjectPattern;
        paramDefaultValue: string;
        paramIndex: number;
        paramName: string;
        properties: string[];
        typeAnnotation: TSESTree.TypeNode;
        typeText: string;
      }> = [];

      for (let paramIndex = 0; paramIndex < node.params.length; paramIndex++) {
        let param = node.params[paramIndex];
        let hasParamDefault = false;
        let paramDefaultValue = "";

        if (param.type === AST_NODE_TYPES.AssignmentPattern) {
          hasParamDefault = true;
          paramDefaultValue = sourceCode.getText(param.right);
          param = param.left as TSESTree.ObjectPattern;
        }

        if (param.type !== AST_NODE_TYPES.ObjectPattern) {
          continue;
        }

        if (!param.typeAnnotation) {
          continue;
        }

        const typeAnnotation = param.typeAnnotation.typeAnnotation;
        const { baseType, hasUndefined, hasVoid } = hasVoidOrUndefinedInUnion({
          typeAnnotation,
        });

        const hasVoidOrUndefined = hasVoid || hasUndefined;
        const areAllPropsOptional = areAllPropertiesOptional(baseType);

        if (!hasVoidOrUndefined && !areAllPropsOptional && !hasParamDefault) {
          continue;
        }

        const originalParam = node.params[paramIndex];
        const typeText = sourceCode.getText(param.typeAnnotation);
        const properties = extractProperties({ param, sourceCode });

        const paramName =
          paramsToFix.length === 0 ? "props" : `props${paramsToFix.length + 1}`;

        paramsToFix.push({
          areAllPropsOptional,
          hasParamDefault,
          hasVoidOrUndefined,
          originalParam,
          param,
          paramDefaultValue,
          paramIndex,
          paramName,
          properties,
          typeAnnotation,
          typeText,
        });
      }

      for (const paramData of paramsToFix) {
        const { hasVoidOrUndefined, param } = paramData;

        context.report({
          fix: (fixer) => {
            const allDestructuringStatements = paramsToFix
              .map((p) => {
                const props = p.properties.join(", ");
                return `const { ${props} } = ${p.paramName} ?? {};`;
              })
              .join("\n  ");

            const fixes: ReturnType<typeof fixer.replaceText>[] = [];

            for (const fixData of paramsToFix) {
              const { hasVoid: isPHasVoid } = hasVoidOrUndefinedInUnion({
                typeAnnotation: fixData.typeAnnotation,
              });

              const pCleanTypeText = buildTypeWithVoid({
                hasVoid: isPHasVoid,
                typeAnnotation: fixData.typeAnnotation,
                typeText: fixData.typeText,
              });

              let pNewParam = `${fixData.paramName}: ${pCleanTypeText}`;
              if (
                fixData.hasParamDefault &&
                node.body.type === AST_NODE_TYPES.BlockStatement
              ) {
                pNewParam += ` = ${fixData.paramDefaultValue}`;
              }
              fixes.push(
                fixer.replaceTextRange(fixData.originalParam.range, pNewParam)
              );
            }

            if (node.body.type === AST_NODE_TYPES.BlockStatement) {
              const firstStatement = node.body.body[0];

              if (firstStatement) {
                fixes.push(
                  fixer.replaceTextRange(
                    [node.body.range[0] + 1, firstStatement.range[0]],
                    `\n\n  ${allDestructuringStatements}\n  `
                  )
                );
              } else {
                fixes.push(
                  fixer.insertTextAfterRange(
                    [node.body.range[0] + 1, node.body.range[0] + 1],
                    `\n  ${allDestructuringStatements}\n`
                  )
                );
              }

              return fixes;
            } else {
              const bodyText = sourceCode.getText(node.body);

              const newBody = ` {\n  ${allDestructuringStatements}\n  return ${bodyText};\n}`;

              const arrowToken = sourceCode.getTokenBefore(
                node.body,
                (token) => token.value === "=>"
              );
              if (arrowToken) {
                fixes.push(
                  fixer.replaceTextRange(
                    [arrowToken.range[1], node.range[1]],
                    newBody
                  )
                );
              } else {
                fixes.push(fixer.replaceText(node.body, newBody));
              }

              return fixes;
            }
          },
          messageId: hasVoidOrUndefined
            ? Messages.PREFER_VOID_FOR_OPTIONAL_PARAM
            : Messages.ADD_VOID_UNION,
          node: param,
        });
      }
    };

    return {
      ArrowFunctionExpression: checkFunction,
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Enforce void union type for optional parameters and destructure them in the function body",
      recommended: false,
      url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/prefer-void-for-optional-param.md",
    },
    fixable: "code",
    messages: {
      [Messages.ADD_VOID_UNION]:
        "NIMA: Destructure parameters inside function body and add | void to the parameter type.",
      [Messages.PREFER_VOID_FOR_OPTIONAL_PARAM]:
        "NIMA: Destructure parameters inside function body with ?? {} instead of in parameter list.",
    },
    schema: [],
    type: "suggestion",
  },
  name,
});
