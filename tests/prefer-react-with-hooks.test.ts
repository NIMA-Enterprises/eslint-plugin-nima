import { Messages } from "@models/prefer-react-with-hooks.model";
import * as PreferReactWithHooks from "@rules/prefer-react-with-hooks";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-react-with-hooks", PreferReactWithHooks.rule, {
  invalid: [
    // Case 1: Direct hook call without any import
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
    // Case 2: Named import of a single hook
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
    // Case 3: Named import of multiple hooks
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
    // Case 4: Named import with other non-hook imports
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
    // Case 5: Named import and default import together
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
    // Case 6: Hook call within a function expression
    {
      code: `const MyComponent = () => {\n  useState();\n};`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nconst MyComponent = () => {\n  React.useState();\n};`,
    },
    // Case 7: Hook call within a function declaration
    {
      code: `function MyComponent() {\n  useEffect();\n}`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nfunction MyComponent() {\n  React.useEffect();\n}`,
    },
    // Case 8: Nested hook calls
    {
      code: `useEffect(() => { useState(); });`,
      errors: [
        { messageId: Messages.PREFER_REACT_PREFIX },
        { messageId: Messages.PREFER_REACT_PREFIX },
      ],
      output: `import React from "react";\nReact.useEffect(() => { React.useState(); });`,
    },
    // Case 9: Direct hook call with arguments
    {
      code: `useState(0);`,
      errors: [{ messageId: Messages.PREFER_REACT_PREFIX }],
      output: `import React from "react";\nReact.useState(0);`,
    },
    // Case 10: Mixed imports and hook calls
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
  ],
  valid: [
    "React.useEffect()",
    "React.useState(0)",
    "import React from 'react'; React.useState();",
    "import * as React from 'react'; React.useState();",
    "import React, { memo } from 'react'; React.useState();",
    "import { someOtherFunction } from 'some-library'; someOtherFunction();",
    "const myObject = { method: () => { console.log('hello'); } };",
    "const MyComponent = () => { return React.useState(0); };",
  ],
});
