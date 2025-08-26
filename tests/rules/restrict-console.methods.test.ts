import { RuleTester } from "@typescript-eslint/rule-tester";

import * as RestrictConsoleMethods from "../../src/rules/restrict-console-methods";

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
          messageId: "noConsole",
        },
      ],
    },
  ],
  valid: ["console.doc(123)"],
});
