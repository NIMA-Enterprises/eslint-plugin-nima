import { Messages } from "@models/params-naming-convention.model";
import * as ParamsNamingConventions from "@rules/params-naming-convention";
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

ruleTester.run("params-naming-convention", ParamsNamingConventions.rule, {
  invalid: [
    {
      code: "const NIMALabs = (amar: number, murga: number) => {}",
      errors: [
        {
          data: {
            count: "2",
            params: "$amar, $murga",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },
    {
      code: "const NIMALabs = (amar: number, {murga: number}) => {}",
      errors: [
        {
          data: {
            count: "1",
            params: "$amar",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },
    {
      code: "['NIMA'].map((element, idx) => {})",
      errors: [
        {
          data: {
            count: "2",
            params: "$element, $idx",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },
    {
      code: "['NIMA'].map((e, idx) => {})",
      errors: [
        {
          data: {
            count: "1",
            params: "$idx",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },
  ],
  valid: [
    "const NIMALabs = (singleParameter: number) => {}",
    "const NIMALabs = ({amar: number, murga: number}) => {}",
    "const NIMALabs = ($prefix: number, $prefix: number) => {}",
    "const NIMALabs = (e: number, $specialWord: number) => {}",
    "['NIMA'].map((e, index, array) => {})",
    "['NIMA'].forEach((e, index, array) => {})",
    "['NIMA'].reduce((acc, curr, index, array) => {})",
  ],
});
