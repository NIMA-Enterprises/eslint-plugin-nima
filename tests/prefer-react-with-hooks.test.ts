/* Test file for prefer-react-with-hooks rule
    Refined and stripped of redundant tests
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 9
    Invalid tests: 5
    Valid tests: 4
*/

import { Messages } from "@models/prefer-react-with-hooks.model";
import * as PreferReactWithHooks from "@rules/prefer-react-with-hooks";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-react-with-hooks", PreferReactWithHooks.rule, {
  invalid: [
    // === DIRECT HOOK CALLS WITHOUT REACT IMPORT ===

    // 1. Direct hook call without any import
    {
      code: "useEffect();",
      errors: [
        {
          data: { hook: "useEffect" },
          messageId: Messages.PREFER_REACT_PREFIX,
        },
      ],
      output: `import React from "react";\nReact.useEffect();`,
    },

    // === NAMED IMPORTS OF HOOKS ===

    // 2. Named import of a single hook
    {
      code: `import { useState } from "react";\nuseState();`,
      errors: [
        {
          data: { hook: "useState" },
          messageId: Messages.PREFER_REACT,
        },
        {
          data: { hook: "useState" },
          messageId: Messages.PREFER_REACT_PREFIX,
        },
      ],
      output: `import React from "react";\nReact.useState();`,
    },

    // 3. Named import of a single hook with other non-hook imports
    {
      code: `import { useState, FC } from "react";\nuseState();`,
      errors: [
        {
          data: { hook: "useState" },
          messageId: Messages.PREFER_REACT,
        },
        {
          data: { hook: "useState" },
          messageId: Messages.PREFER_REACT_PREFIX,
        },
      ],
      output: `import React, { FC } from "react";\nReact.useState();`,
    },

    // 4. Multiple hook calls from a named import
    {
      code: `import { useState, useEffect } from "react";\nuseState();\nuseEffect();`,
      errors: [
        {
          data: { hook: "useState and useEffect" },
          messageId: Messages.PREFER_REACT,
        },
        {
          data: { hook: "useState" },
          messageId: Messages.PREFER_REACT_PREFIX,
        },
        {
          data: { hook: "useEffect" },
          messageId: Messages.PREFER_REACT_PREFIX,
        },
      ],
      output: `import React from "react";\nReact.useState();\nReact.useEffect();`,
    },

    // 5. Hook call with arguments in a function expression
    {
      code: `const MyComponent = () => {\n  useState(0);\n};`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nconst MyComponent = () => {\n  React.useState(0);\n};`,
    },
  ],
  valid: [
    // === VALID HOOK USAGE ===

    // 6. Valid: React namespace import and hook call
    "import React from 'react'; React.useState();",

    // 7. Valid: Namespace import and hook call
    "import * as React from 'react'; React.useState();",

    // 8. Valid: Default and named import, valid hook usage
    "import React, { memo } from 'react'; React.useState();",

    // 9. Valid: Non-hook import and function call
    "import { someOtherFunction } from 'some-library'; someOtherFunction();",
  ],
});
