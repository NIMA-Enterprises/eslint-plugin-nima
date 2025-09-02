import { Messages } from "@models/restrict-console-methods.model";
import * as RestrictConsoleMethods from "@rules/restrict-console-methods";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("restrict-console-methods", RestrictConsoleMethods.rule, {
  invalid: [
    {
      code: "console.error('oops')",
      errors: [
        {
          data: {
            console: "error",
          },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },
    // Test case for console.log with default options (disallowed)
    {
      code: "console.log('hello')",
      errors: [
        {
          data: { console: "log" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },
    // Test case for console.warn with default options (disallowed)
    {
      code: "console.warn('warning')",
      errors: [
        {
          data: { console: "warn" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },
    // Test case for mixed calls with some disallowed
    {
      code: "console.log('foo'); console.error('bar');",
      errors: [
        { data: { console: "log" }, messageId: Messages.NO_CONSOLE },
        { data: { console: "error" }, messageId: Messages.NO_CONSOLE },
      ],
    },
    // Test case with allowConsoleLog: true, but still invalid for other methods
    {
      code: "console.warn('uh oh')",
      errors: [
        {
          data: { console: "warn" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
      options: [{ allowConsoleLog: true }],
    },
    // Test case with allowConsoleWarn: true, but still invalid for other methods
    {
      code: "console.error('uh oh')",
      errors: [
        {
          data: { console: "error" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
      options: [{ allowConsoleWarn: true }],
    },
    // Test case with nested disallowed call
    {
      code: `function myFunction() {
        if (true) {
          console.log('inside a function');
        }
      }`,
      errors: [
        {
          data: { console: "log" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },
  ],
  valid: [
    "console.doc(123)",
    // Other valid console methods that are not restricted
    "console.info('info')",
    "console.debug('debug')",
    "console.table(data)",
    // Test case with allowed methods via options
    {
      code: "console.log('This is allowed')",
      options: [{ allowConsoleLog: true }],
    },
    {
      code: "console.warn('This warning is allowed')",
      options: [{ allowConsoleWarn: true }],
    },
    {
      code: "console.error('This error is allowed')",
      options: [{ allowConsoleError: true }],
    },
    // Test case with multiple allowed methods
    {
      code: `
        console.log('log');
        console.warn('warn');
        console.error('error');
      `,
      options: [
        {
          allowConsoleError: true,
          allowConsoleLog: true,
          allowConsoleWarn: true,
        },
      ],
    },
    // Test case with a different member expression that is not console
    "myObject.log('not a console log')",
    "const obj = { console: { log: () => {} } }; obj.console.log('valid');",
  ],
});
