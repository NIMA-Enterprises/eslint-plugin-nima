export const enum Messages {
  NO_CONSOLE = "NO_CONSOLE",
}

export type Options = [
  Partial<{
    allowConsoleError: boolean;
    allowConsoleLog: boolean;
    allowConsoleWarn: boolean;
  }>
];
