import { Messages } from "@models/prefer-react-with-hooks.model";
import * as PreferReactWithHooks from "@rules/prefer-react-with-hooks";
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

ruleTester.run("prefer-react-with-hooks", PreferReactWithHooks.rule, {
  invalid: [
    {
      code: "useEffect()",
      errors: [
        {
          data: {
            hook: "useEffect",
          },
          messageId: Messages.PREFER_REACT_PREFIX,
        },
      ],
      output: `import React from "react";\nReact.useEffect()`,
    },
  ],
  valid: ["React.useEffect()"],
});
