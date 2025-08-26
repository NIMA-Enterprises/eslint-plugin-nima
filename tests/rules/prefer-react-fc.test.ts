import { RuleTester } from "@typescript-eslint/rule-tester";

import * as PreferReactFc from "../../src/rules/prefer-react-fc";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("prefer-react-fc", PreferReactFc.rule, {
  invalid: [
    {
      code: "const Component = () => <div></div>",
      errors: [
        {
          messageId: "requireReactFC",
        },
      ],
    },
  ],
  valid: ["const Component:React.FC = () => <div></div>"],
});
