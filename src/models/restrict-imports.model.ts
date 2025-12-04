export const enum Messages {
  IMPORT_DISALLOWED = "IMPORT_DISALLOWED",
}

export type Options = [
  Partial<{
    allowImports: string[];
    disableImports: string[];
    files: string[];
    folders: string[];
  }>[]
];
