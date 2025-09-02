/*  Test file for prefer-react-with-hooks rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 25
    Invalid tests: 15
    Valid tests: 10
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

    // 3. Named import of multiple hooks
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

    // 4. Named import with other non-hook imports
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

    // 5. Named import and default import together
    {
      code: `import React, { useState } from "react";\nuseState();`,
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

    // === HOOK CALLS INSIDE FUNCTIONS ===

    // 6. Hook call within a function expression
    {
      code: `const MyComponent = () => {\n  useState();\n};`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nconst MyComponent = () => {\n  React.useState();\n};`,
    },

    // 7. Hook call within a function declaration
    {
      code: `function MyComponent() {\n  useEffect();\n}`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nfunction MyComponent() {\n  React.useEffect();\n}`,
    },

    // 8. Nested hook calls
    {
      code: `useEffect(() => { useState(); });`,
      errors: [
        { messageId: Messages.PREFER_REACT_PREFIX },
        { messageId: Messages.PREFER_REACT_PREFIX },
      ],
      output: `import React from "react";\nReact.useEffect(() => { React.useState(); });`,
    },

    // 9. Direct hook call with arguments
    {
      code: `useState(0);`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nReact.useState(0);`,
    },

    // === MIXED IMPORTS AND HOOK CALLS ===

    // 10. Mixed imports and hook calls
    {
      code: `import { FC, useEffect, useState } from "react";\nconst MyComponent: FC = () => {\n  useState();\n  useEffect();\n};`,
      errors: [
        {
          data: { hook: "useEffect and useState" },
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
      output: `import React, { FC } from "react";\nconst MyComponent: FC = () => {\n  React.useState();\n  React.useEffect();\n};`,
    },

    // 11. Dummy invalid: direct hook call with whitespace
    {
      code: `  useEffect ( );`,
      errors: [
        {
          messageId: Messages.PREFER_REACT_PREFIX,
        },
      ],
      output: `import React from "react";\n  React.useEffect ( );`,
    },

    // 12. Dummy invalid: named import with alias
    {
      code: `import { useState as useS } from "react";\nuseS();`,
      errors: [
        {
          messageId: Messages.PREFER_REACT_PREFIX,
        },
      ],
      output: `import React from "react";\nReact.useS();`,
    },

    // 13. Dummy invalid: hook call in nested function
    {
      code: `function outer() { function inner() { useEffect(); } }`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nfunction outer() { function inner() { React.useEffect(); } }`,
    },

    // 14. Dummy invalid: hook call in class method
    {
      code: `class C { m() { useState(); } }`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nclass C { m() { React.useState(); } }`,
    },

    // 15. Dummy invalid: hook call with comment
    {
      code: `// call hook\nuseEffect();`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\n// call hook\nReact.useEffect();`,
    },
  ],
  valid: [
    // === VALID HOOK USAGE ===

    // 16. Valid: React hook call with React namespace
    "React.useEffect()",

    // 17. Valid: React hook call with argument
    "React.useState(0)",

    // 18. Valid: React import and hook call
    "import React from 'react'; React.useState();",

    // 19. Valid: Namespace import and hook call
    "import * as React from 'react'; React.useState();",

    // 20. Valid: Default and named import, valid hook usage
    "import React, { memo } from 'react'; React.useState();",

    // 21. Valid: Non-hook import and function call
    "import { someOtherFunction } from 'some-library'; someOtherFunction();",

    // 22. Valid: Object method, not a hook
    "const myObject = { method: () => { console.log('hello'); } };",

    // 23. Valid: Hook call inside arrow function with React namespace
    "const MyComponent = () => { return React.useState(0); };",

    // 24. Dummy valid: unrelated code
    "const x = 5;",

    // 25. Dummy valid: unrelated import
    "import { something } from 'other';",
  ],
});
