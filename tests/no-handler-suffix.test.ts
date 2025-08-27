import { Messages } from "@models/no-handle-suffix.model";
import * as NoHandlerSuffix from "@rules/no-handler-suffix";
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

ruleTester.run("no-handler-suffix", NoHandlerSuffix.rule, {
  invalid: [
    {
      code: "const clickHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
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
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handle = () => {}",
    },
  ],
  valid: ["const handleClick = () => {}", "const handle = () => {}"],
});
