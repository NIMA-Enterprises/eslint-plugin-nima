import { RuleTester } from "@typescript-eslint/rule-tester";

import * as ManageFunctions from "../../src/rules/manage-functions";

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
      errors: [{ messageId: "noOptional" }],
      filename: "/src/routes/index.ts",
      options: [
        {
          options: [
            {
              disableFunctions: ["optional"],
              files: [],
              folders: ["**/routes"],
            },
          ],
        },
      ],
    },
    {
      code: "Route.useParams()",
      errors: [{ messageId: "noOptional" }],
      filename: "/src/components/atoms/Button.tsx",
      options: [
        {
          options: [
            {
              allowFunctions: ["useParams"],
              files: ["*Page.tsx"],
            },
          ],
        },
      ],
    },
  ],
  valid: [
    {
      code: "z.string().optional()",
      filename: "/src/utils/index.ts",
      options: [
        {
          options: [
            {
              disableFunctions: ["optional"],
              files: [],
              folders: ["routes"],
            },
          ],
        },
      ],
    },
    {
      code: "z.string()",
      filename: "/src/routes/index.ts",
      options: [
        {
          options: [
            {
              disableFunctions: ["string"],
              files: ["page.tsx"],
              folders: [],
            },
          ],
        },
      ],
    },
  ],
});
