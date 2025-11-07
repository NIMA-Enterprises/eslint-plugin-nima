export const enum Messages {
  EXPORT_BELOW_COMPONENT = "EXPORT_BELOW_COMPONENT",
}

export type Options = [
  Partial<{
    allowGenerators: boolean;
    allowMethodDefinitions: boolean;
  }>
];
