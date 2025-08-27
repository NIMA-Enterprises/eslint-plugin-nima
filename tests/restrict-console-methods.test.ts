import { Messages } from "@models/restrict-console-methods.model";
import * as RestrictConsoleMethods from "@rules/restrict-console-methods";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

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
  ],
  valid: ["console.doc(123)"],
});
