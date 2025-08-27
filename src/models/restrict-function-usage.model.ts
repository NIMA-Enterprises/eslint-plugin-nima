export const enum Messages {
  FUNCTION_DISALLOWED = "FUNCTION_DISALLOWED",
}

export type Options = [
  Partial<{
    allowFunctions: string[];
    disableFunctions: string[];
    files: string[];
    folders: string[];
  }>[]
];
