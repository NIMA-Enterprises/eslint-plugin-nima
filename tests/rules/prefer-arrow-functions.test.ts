import { RuleTester } from "@typescript-eslint/rule-tester";

import * as PreferArrowFunctions from "../../src/rules/prefer-arrow-functions";

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
          messageId: "preferArrowFunction",
        },
      ],
      output: "const NIMALabs = () => {}",
    },
    {
      code: "const NIMALabs = function () {}",
      errors: [
        {
          messageId: "preferArrowFunctionExpression",
        },
      ],
      output: "const NIMALabs = () => {}",
    },
    {
      code: "const NIMA = {\nNIMALabs() {}}",
      errors: [
        {
          messageId: "preferArrowMethod",
        },
      ],
      output: "const NIMA = {\nNIMALabs: () => {}}",
    },
  ],
  valid: ["const NIMALabs = () => {}"],
});
