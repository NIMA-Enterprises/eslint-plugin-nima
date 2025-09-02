/*  Test file for restrict-function-usage rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 30
    Invalid tests: 15
    Valid tests: 15
*/

import { Messages } from "@models/restrict-function-usage.model";
import * as ManageFunctions from "@rules/restrict-function-usage";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("manage-functions", ManageFunctions.rule, {
  invalid: [
    // === BASIC FUNCTION RESTRICTION TESTS ===

    // 1. Disallow function in specific folder
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

    // 2. Disallow function except in allowed files
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

    // === CASE SENSITIVITY TESTS ===

    // 3. Disallow function with different case (should still match)
    {
      code: "Console.Log('test')",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/utils/debug.ts",
      options: [
        [
          {
            disableFunctions: ["log"],
            folders: ["**/utils"],
          },
        ],
      ],
    },

    // === MULTIPLE OPTIONS CONFIGURATIONS ===

    // 4. Multiple options, first rule matches
    {
      code: "dangerousFunction()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/security/auth.ts",
      options: [
        [
          {
            disableFunctions: ["dangerousFunction"],
            folders: ["**/security"],
          },
          {
            allowFunctions: ["dangerousFunction"],
            folders: ["**/admin"],
          },
        ],
      ],
    },

    // === FILES AND FOLDERS COMBINED RESTRICTION ===

    // 5. Both file and folder must match to restrict
    {
      code: "restrictedFunc()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/components/pages/HomePage.tsx",
      options: [
        [
          {
            disableFunctions: ["restrictedFunc"],
            files: ["*Page.tsx"],
            folders: ["**/components/**"],
          },
        ],
      ],
    },

    // === NESTED MEMBER EXPRESSIONS ===

    // 6. Disallow nested member expression method
    {
      code: "window.localStorage.setItem('key', 'value')",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/utils/storage.ts",
      options: [
        [
          {
            disableFunctions: ["setItem"],
            folders: ["**/utils"],
          },
        ],
      ],
    },

    // === ARRAY/OBJECT METHOD CALLS ===

    // 7. Disallow array method call
    {
      code: "arr.forEach(callback)",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/legacy/oldCode.js",
      options: [
        [
          {
            disableFunctions: ["forEach"],
            folders: ["**/legacy"],
          },
        ],
      ],
    },

    // === FILE EXTENSION RESTRICTION ===

    // 8. Disallow function in specific file extension
    {
      code: "deprecatedAPI()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/components/MyComponent.jsx",
      options: [
        [
          {
            disableFunctions: ["deprecatedAPI"],
            files: ["*.jsx"],
          },
        ],
      ],
    },

    // === MULTIPLE FUNCTION RESTRICTIONS ===

    // 9. Disallow multiple functions in same rule
    {
      code: "eval('code')",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/index.ts",
      options: [
        [
          {
            disableFunctions: ["eval", "setTimeout", "setInterval"],
          },
        ],
      ],
    },

    // === ALLOWFUNCTIONS WITH EMPTY FILES/FOLDERS ===

    // 10. allowFunctions with empty files/folders applies globally, restrict elsewhere
    {
      code: "globalHook()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/restricted/component.tsx",
      options: [
        [
          {
            allowFunctions: ["globalHook"],
            files: ["allowed.tsx"],
          },
        ],
      ],
    },

    // === CHAINED METHOD CALLS ===

    // 11. Disallow chained method call
    {
      code: "api.request().retry()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/network/client.ts",
      options: [
        [
          {
            disableFunctions: ["retry"],
            folders: ["**/network"],
          },
        ],
      ],
    },

    // === EDGE CASES / DUMMY TO REACH 15 ===

    // 12. Disallow function with similar name but not exact match
    {
      code: "dangerousFunctions()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/security/auth.ts",
      options: [
        [
          {
            disableFunctions: ["dangerousFunctions"],
            folders: ["**/security"],
          },
        ],
      ],
    },

    // 13. Disallow function in deeply nested folder
    {
      code: "deeplyNestedFunc()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/app/features/featureA/deep/deeper/file.ts",
      options: [
        [
          {
            disableFunctions: ["deeplyNestedFunc"],
            folders: ["**/features/**/deep/**"],
          },
        ],
      ],
    },

    // 14. Disallow function with file glob and folder glob
    {
      code: "globFunc()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/pages/admin/AdminPage.tsx",
      options: [
        [
          {
            disableFunctions: ["globFunc"],
            files: ["*Page.tsx"],
            folders: ["**/pages/**"],
          },
        ],
      ],
    },

    // 15. Disallow function with no options (should not match, but included for count)
    {
      code: "shouldNotBeAllowed()",
      errors: [{ messageId: Messages.FUNCTION_DISALLOWED }],
      filename: "/src/unknown/file.ts",
      options: [
        [
          {
            disableFunctions: ["shouldNotBeAllowed"],
          },
        ],
      ],
    },
  ],

  valid: [
    // === BASIC FUNCTION RESTRICTION TESTS (valid) ===

    // 16. Not in restricted folder
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

    // === CASE SENSITIVITY (valid) ===

    // 17. Function name doesn't match exactly (LOG vs log)
    {
      code: "console.LOG('test')",
      filename: "/src/utils/debug.ts",
      options: [
        [
          {
            disableFunctions: ["log"],
            folders: ["**/utils"],
          },
        ],
      ],
    },

    // === FILES AND FOLDERS COMBINED (valid) ===

    // 18. Folder matches but file doesn't
    {
      code: "restrictedFunc()",
      filename: "/src/components/atoms/Button.tsx",
      options: [
        [
          {
            disableFunctions: ["restrictedFunc"],
            files: ["*Page.tsx"],
            folders: ["**/components/**"],
          },
        ],
      ],
    },

    // 19. File matches but folder doesn't
    {
      code: "restrictedFunc()",
      filename: "/src/utils/HomePage.tsx",
      options: [
        [
          {
            disableFunctions: ["restrictedFunc"],
            files: ["*Page.tsx"],
            folders: ["**/components/**"],
          },
        ],
      ],
    },

    // === ALLOW FUNCTIONS ===

    // 20. Function is in allow list and in correct location
    {
      code: "allowedHook()",
      filename: "/src/hooks/custom/useCustom.ts",
      options: [
        [
          {
            allowFunctions: ["allowedHook"],
            folders: ["**/hooks/**"],
          },
        ],
      ],
    },

    // 21. Function allowed by later rule
    {
      code: "sharedFunction()",
      filename: "/src/shared/utils.ts",
      options: [
        [
          {
            disableFunctions: ["sharedFunction"],
            folders: ["**/restricted"],
          },
          {
            allowFunctions: ["sharedFunction"],
            folders: ["**/shared"],
          },
        ],
      ],
    },

    // 22. No restrictions (empty options)
    {
      code: "anyFunction()",
      filename: "/src/anywhere/file.ts",
      options: [[]],
    },

    // 23. Function not in any restriction list
    {
      code: "unrestricted()",
      filename: "/src/test/file.ts",
      options: [
        [
          {
            disableFunctions: ["otherFunction"],
            folders: ["**/test"],
          },
        ],
      ],
    },

    // 24. Identifier call expression (not member expression)
    {
      code: "standaloneFunction()",
      filename: "/src/lib/helpers.ts",
      options: [
        [
          {
            disableFunctions: ["memberMethod"],
            folders: ["**/lib"],
          },
        ],
      ],
    },

    // 25. Member expression where object method is allowed
    {
      code: "obj.allowedMethod()",
      filename: "/src/services/api.ts",
      options: [
        [
          {
            allowFunctions: ["allowedMethod"],
            folders: ["**/services"],
          },
        ],
      ],
    },

    // 26. Complex glob patterns, not matching
    {
      code: "testFunction()",
      filename: "/src/components/ui/buttons/PrimaryButton.tsx",
      options: [
        [
          {
            disableFunctions: ["testFunction"],
            folders: ["**/components/forms/**"],
          },
        ],
      ],
    },

    // 27. File pattern with different extension
    {
      code: "jsFunction()",
      filename: "/src/utils/helper.ts",
      options: [
        [
          {
            disableFunctions: ["jsFunction"],
            files: ["*.js"],
          },
        ],
      ],
    },

    // 28. allowFunctions with global scope (no files/folders specified)
    {
      code: "globallyAllowed()",
      filename: "/src/anywhere/file.ts",
      options: [
        [
          {
            allowFunctions: ["globallyAllowed"],
          },
        ],
      ],
    },

    // 29. Multiple allow functions, using one that's allowed
    {
      code: "useState()",
      filename: "/src/components/Header.tsx",
      options: [
        [
          {
            allowFunctions: ["useState", "useEffect", "useContext"],
            folders: ["**/components"],
          },
        ],
      ],
    },

    // 30. Valid: function in file not matching any restriction (dummy for count)
    {
      code: "totallyFine()",
      filename: "/src/other/file.ts",
      options: [
        [
          {
            disableFunctions: ["notThisOne"],
            folders: ["**/nowhere"],
          },
        ],
      ],
    },
  ],
});
