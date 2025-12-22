import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

export const getType = ({
  context,
  node,
}: {
  context: Readonly<TSESLint.RuleContext<string, unknown[]>>;
  node: TSESTree.Node;
}) => {
  const sourceCode = context.sourceCode;
  const services = sourceCode.parserServices;

  if (!services?.program?.getTypeChecker) {
    return;
  }

  const checker = services.program.getTypeChecker();

  try {
    const tsNode = services.esTreeNodeToTSNodeMap?.get(node);
    if (!tsNode) return;

    const type = checker.getTypeAtLocation(tsNode);
    const typeString = checker.typeToString(type);

    return typeString;
  } catch {
    return;
  }
};
