export const enum Messages {
  REQUIRE_REACT_FC = "REQUIRE_REACT_FC",
}

export type Options = [
  Partial<{
    allowArrowFunctions: boolean;
    allowFunctionDeclarations: boolean;
  }>
];
