import { Messages } from "@models/boolean-naming-convention.model";
import * as BooleanNamingConventions from "@rules/boolean-naming-convention";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

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
          messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
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
          messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
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
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
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
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
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
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
      ],
    },
  ],
  valid: ["const isNIMA = () => true"],
});
