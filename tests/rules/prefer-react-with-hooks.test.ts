import { RuleTester } from "@typescript-eslint/rule-tester";

import * as PreferReactWithHooks from "../../src/rules/prefer-react-with-hooks";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("prefer-react-with-hooks", PreferReactWithHooks.rule, {
  invalid: [
    {
      code: "useEffect()",
      errors: [
        {
          data: {
            hook: "useEffect",
          },
          messageId: "preferReactPrefix",
        },
      ],
      output: `import React from "react";\nReact.useEffect()`,
    },
  ],
  valid: ["React.useEffect()"],
});
