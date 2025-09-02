import { Messages } from "@models/restrict-function-usage.model";
import * as ManageFunctions from "@rules/restrict-function-usage";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("manage-functions", ManageFunctions.rule, {
  invalid: [
    // Existing test cases
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

    // New test cases for 'disableFunctions'
    {
      code: "console.log('debug');",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/utils/logger.ts",
      options: [
        [
          {
            disableFunctions: ["log"],
            folders: ["**/utils"],
          },
        ],
      ],
    },
    {
      code: "window.alert('danger!');",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/utils/index.ts",
      options: [
        [
          {
            disableFunctions: ["alert"],
            files: ["index.ts"],
          },
        ],
      ],
    },

    // New test cases for 'allowFunctions' (negative test - outside allowed location)
    {
      code: "useId()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/other/hooks/useOtherHook.ts",
      options: [
        [
          {
            allowFunctions: ["useId"],
            folders: ["**/components"],
          },
        ],
      ],
    },
    {
      code: "useReducer()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/hooks/my-hook.ts",
      options: [
        [
          {
            allowFunctions: ["useReducer"],
            files: ["App.tsx"],
          },
        ],
      ],
    },

    // Corrected test case that was in the wrong place
    {
      code: "useContext()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/components/atoms/Button.tsx",
      options: [
        [
          {
            allowFunctions: ["useContext", "useState"],
            folders: ["**/components"],
          },
        ],
      ],
    },

    // New test cases for mixed options and no options
    {
      code: "myFunc();",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/index.ts",
      options: [
        [
          {
            disableFunctions: ["myFunc"],
          },
        ],
      ],
    },
    {
      code: "fetch()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/services/api.ts",
      options: [
        [
          {
            allowFunctions: ["fetch"],
            folders: ["**/services/data"],
          },
        ],
      ],
    },
  ],
  valid: [
    // Existing test cases
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

    // New test cases for 'disableFunctions' (valid test - outside disabled location)
    {
      code: "console.log('Allowed here')",
      filename: "/src/components/MyComponent.tsx",
      options: [
        [
          {
            disableFunctions: ["log"],
            folders: ["**/utils"],
          },
        ],
      ],
    },
    {
      code: "alert('Safe to use')",
      filename: "/src/utils/test.ts",
      options: [
        [
          {
            disableFunctions: ["alert"],
            files: ["index.ts"],
          },
        ],
      ],
    },

    // New test cases for 'allowFunctions' (positive test - inside allowed location)
    {
      code: "useContext()",
      filename: "/src/components/atoms/Button.tsx",
      options: [
        [
          {
            allowFunctions: ["useContext", "useState"],
            folders: ["**/components/**"],
          },
        ],
      ],
    },
    {
      code: "useParams()",
      filename: "/src/pages/userPage.tsx",
      options: [
        [
          {
            allowFunctions: ["useParams"],
            files: ["*Page.tsx"],
          },
        ],
      ],
    },

    // New test cases for mixed options and no options
    {
      code: "myFunc()",
      filename: "/src/lib/myFunc.ts",
      options: [
        [
          {
            allowFunctions: ["myFunc"],
            folders: ["**/lib"],
          },
        ],
      ],
    },
    {
      code: "console.table(data)",
      filename: "/src/index.ts",
      options: [
        [
          {
            disableFunctions: ["log"],
            files: ["*.ts"],
          },
        ],
      ],
    },
    {
      code: "anotherFunction()",
      filename: "/src/some-file.js",
      options: [
        [
          {
            disableFunctions: ["myFunc"],
          },
        ],
      ],
    },
  ],
});
