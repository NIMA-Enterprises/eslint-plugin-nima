import { RuleTester } from "@typescript-eslint/rule-tester";

import * as NoHandlerSuffix from "../../src/rules/no-handler-suffix";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-handler-suffix", NoHandlerSuffix.rule, {
  invalid: [
    {
      code: "const clickHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: "badHandleName",
        },
      ],
      output: "const handleClick = () => {}",
    },
    {
      code: "const handler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handle",
          },
          messageId: "badHandleName",
        },
      ],
      output: "const handle = () => {}",
    },
  ],
  valid: ["const handleClick = () => {}", "const handle = () => {}"],
});
