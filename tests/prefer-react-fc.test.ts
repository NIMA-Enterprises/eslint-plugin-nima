import { Messages } from "@models/prefer-react-fc.model";
import * as PreferReactFc from "@rules/prefer-react-fc";
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

ruleTester.run("prefer-react-fc", PreferReactFc.rule, {
  invalid: [
    {
      code: "const Component = () => <div></div>",
      errors: [
        {
          messageId: Messages.REQUIRE_REACT_FC,
        },
      ],
    },
  ],
  valid: ["const Component:React.FC = () => <div></div>"],
});
