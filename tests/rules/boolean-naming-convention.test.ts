import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

import * as BooleanNamingConventions from "../../src/rules/boolean-naming-convention";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
      tsconfigRootDir: __dirname,
    },
  },
});

ruleTester.run("boolean-naming-convention", BooleanNamingConventions.rule, {
  invalid: [
    {
      code: "const NIMA = () => true",
      errors: [
        {
          data: {
            name: "NIMA",
            suggestion: "isNIMA",
          },
          messageId: "booleanFunctionName",
        },
      ],
    },
    {
      code: "const NIMA = true",
      errors: [
        {
          data: {
            name: "NIMA",
            suggestion: "isNIMA",
          },
          messageId: "booleanVariableName",
        },
      ],
    },
    {
      code: "const NIMA = (nima: boolean) => {}",
      errors: [
        {
          data: {
            name: "nima",
            suggestion: "isNima",
          },
          messageId: "booleanParameterName",
        },
      ],
    },
    {
      code: "const NIMA = {\nnima: true}",
      errors: [
        {
          data: {
            name: "nima",
            suggestion: "isNima",
          },
          messageId: "booleanPropertyName",
        },
      ],
    },
    {
      code: "const NIMA = {\nnima: () => true}",
      errors: [
        {
          data: {
            name: "nima",
            suggestion: "isNima",
          },
          messageId: "booleanPropertyName",
        },
      ],
    },
  ],
  valid: ["const isNIMA = () => true"],
});
