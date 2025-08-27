import { Messages } from "@models/restrict-function-usage.model";
import * as ManageFunctions from "@rules/restrict-function-usage";
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

ruleTester.run("manage-functions", ManageFunctions.rule, {
  invalid: [
    {
      code: "z.string().optional()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/routes/index.ts",
      options: [
        [
          {
            disableFunctions: ["optional"],
            files: [],
            folders: ["**/routes"],
          },
        ],
      ],
    },
    {
      code: "Route.useParams()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/components/atoms/Button.tsx",
      options: [
        [
          {
            allowFunctions: ["useParams"],
            files: ["*Page.tsx"],
          },
        ],
      ],
    },
  ],
  valid: [
    {
      code: "z.string().optional()",
      filename: "/src/utils/index.ts",
      options: [
        [
          {
            disableFunctions: ["optional"],
            files: [],
            folders: ["routes"],
          },
        ],
      ],
    },
    {
      code: "z.string()",
      filename: "/src/routes/index.ts",
      options: [
        [
          {
            disableFunctions: ["string"],
            files: ["page.tsx"],
            folders: [],
          },
        ],
      ],
    },
  ],
});
