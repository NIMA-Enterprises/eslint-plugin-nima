export const enum Messages {
  USE_OBJECT_PARAMETERS = "USE_OBJECT_PARAMETERS",
}

export type Options = [
  Partial<{
    allowedParameters: number;
    ignore: string[];
    ignoreFunctions: string[];
    ignorePrefixes: string[];
  }>
];
