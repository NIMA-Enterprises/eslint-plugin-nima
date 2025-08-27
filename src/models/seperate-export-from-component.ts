export const enum Messages {
  SEPARATE_COMPONENT_EXPORT = "SEPARATE_COMPONENT_EXPORT",
}

export type Options = [
  Partial<{
    allowGenerators: boolean;
    allowMethodDefinitions: boolean;
  }>
];
