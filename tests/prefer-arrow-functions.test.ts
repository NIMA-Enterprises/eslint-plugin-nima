import { Messages } from "@models/prefer-arrow-functions.model";
import * as PreferArrowFunctions from "@rules/prefer-arrow-functions";
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

ruleTester.run("prefer-arrow-functions", PreferArrowFunctions.rule, {
  invalid: [
    {
      code: "function NIMALabs() {}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_FUNCTIONS,
        },
      ],
      output: "const NIMALabs = () => {}",
    },
    {
      code: "const NIMALabs = function () {}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
        },
      ],
      output: "const NIMALabs = () => {}",
    },
    {
      code: "const NIMA = {\nNIMALabs() {}}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_METHOD,
        },
      ],
      output: "const NIMA = {\nNIMALabs: () => {}}",
    },
  ],
  valid: ["const NIMALabs = () => {}"],
});
