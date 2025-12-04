# `restrict-imports`

Disallows the use of specific imports in specified files or folders, with support for allow-lists and deny-lists.  
This rule provides fine-grained control over import usage across your codebase, enabling architectural constraints and security policies.

---

## Table of contents

- [`restrict-imports`](#restrict-imports)
  - [Table of contents](#table-of-contents)
  - [Rule summary](#rule-summary)
  - [What the rule checks](#what-the-rule-checks)
  - [Options (all configurations)](#options-all-configurations)
    - [Default options](#default-options)
    - [Option details](#option-details)
      - [allowImports](#allowimports)
      - [disableImports](#disableimports)
      - [files](#files)
      - [folders](#folders)
      - [from](#from)
  - [Examples (by option)](#examples-by-option)
    - [Default behavior](#default-behavior)
    - [Disabling imports globally](#disabling-imports-globally)
    - [Disabling imports in specific files](#disabling-imports-in-specific-files)
    - [Disabling imports in specific folders](#disabling-imports-in-specific-folders)
    - [Allow-list approach](#allow-list-approach)
    - [Mixed file and folder restrictions](#mixed-file-and-folder-restrictions)
    - [Multiple configuration blocks](#multiple-configuration-blocks)
    - [Restricting imports from specific modules](#restricting-imports-from-specific-modules)
  - [Messages](#messages)
  - [Implementation notes \& requirements](#implementation-notes--requirements)
  - [Limitations \& edge cases](#limitations--edge-cases)
  - [Common use cases](#common-use-cases)
    - [Restrict Route to Page components only](#restrict-route-to-page-components-only)
    - [Restrict Route from react-router to Page components only (ignore lucide-react)](#restrict-route-from-react-router-to-page-components-only-ignore-lucide-react)
    - [Prevent Node.js imports in frontend code](#prevent-nodejs-imports-in-frontend-code)
    - [Enforce using date-fns over moment](#enforce-using-date-fns-over-moment)
    - [Restrict test utilities to test files](#restrict-test-utilities-to-test-files)
  - [Quick configuration snippets](#quick-configuration-snippets)
    - [Minimal (disable a single import)](#minimal-disable-a-single-import)
    - [File-scoped restriction](#file-scoped-restriction)
    - [Folder-scoped restriction](#folder-scoped-restriction)
    - [Module-scoped restriction (using `from`)](#module-scoped-restriction-using-from)
  - [Version](#version)

---

## Rule summary

- **Goal:** Control import usage across your codebase by restricting or allowing specific imports in targeted files/folders.
- **Scope:** Supports named imports (`import { Route }`), default imports (`import Route`), and namespace imports (`import * as Router`).
- **Flexibility:** Configure multiple rules with different scopes and import lists.
- **Pattern Matching:** Uses minimatch for flexible file and folder pattern matching.

---

## What the rule checks

1. **Named imports** - Imports like `import { Route, Link } from 'react-router'`.
2. **Default imports** - Imports like `import Route from 'react-router'`.
3. **Namespace imports** - Imports like `import * as Router from 'react-router'`.
4. **File pattern matching** - Applies restrictions based on file path patterns using minimatch.
5. **Folder pattern matching** - Applies restrictions based on directory patterns using minimatch.

The rule supports both allow-list and deny-list approaches, giving you flexible control over import usage patterns.

---

## Options (all configurations)

The rule accepts an array of configuration objects, each defining a scope and import restrictions. Type definition:

```ts
type Options = [
  Partial<{
    allowImports: string[];
    disableImports: string[];
    files: string[];
    folders: string[];
    from: string[];
  }>[]
];
```

### Default options

```json
[[]]
```

The rule is disabled by default and requires explicit configuration to activate.

### Option details

#### allowImports

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** List of imports that are explicitly allowed. When used with file/folder patterns, these imports are permitted in matching locations.
- **Case sensitivity:** Case-insensitive matching.
- **Behavior:** Creates an allow-list - only listed imports are permitted in the specified scope.

#### disableImports

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** List of imports that are explicitly forbidden in the specified scope.
- **Case sensitivity:** Case-insensitive matching.
- **Behavior:** Creates a deny-list - listed imports are prohibited.

#### files

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** File patterns (using minimatch) where the import restrictions apply.
- **Pattern support:** Supports wildcards like `*.test.js`, `**/*.spec.ts`, `*Page.tsx`, etc.

#### folders

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Folder patterns (using minimatch) where the import restrictions apply.
- **Pattern support:** Supports wildcards like `**/utils`, `src/components/**`, etc.

#### from

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Module source patterns (using minimatch) to match against the import source. When specified, the rule only applies to imports from matching modules.
- **Pattern support:** Supports wildcards like `react-router*`, `@tanstack/*`, `lodash*`, etc.
- **Use case:** Distinguish between imports with the same name from different packages (e.g., `Route` from `react-router` vs `Route` from `lucide-react`).

---

## Examples (by option)

### Default behavior

By default, the rule is disabled and does not restrict any imports.

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": "error", // No effect without configuration
    },
  },
];
```

### Disabling imports globally

Restrict specific imports across the entire codebase:

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": [
        "error",
        [
          {
            disableImports: ["lodash", "moment"],
          },
        ],
      ],
    },
  },
];
```

❌ Invalid:

```ts
import { merge } from "lodash";
import moment from "moment";
```

✅ Valid:

```ts
import { merge } from "lodash-es";
import { format } from "date-fns";
```

### Disabling imports in specific files

Restrict imports only in files matching a pattern:

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": [
        "error",
        [
          {
            disableImports: ["enzyme"],
            files: ["*.test.tsx", "*.spec.tsx"],
          },
        ],
      ],
    },
  },
];
```

### Disabling imports in specific folders

Restrict imports in specific directories:

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": [
        "error",
        [
          {
            disableImports: ["fs", "path"],
            folders: ["**/client/**", "**/frontend/**"],
          },
        ],
      ],
    },
  },
];
```

### Allow-list approach

Allow specific imports only in certain files (your use case - Route only in Page files):

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": [
        "error",
        [
          {
            disableImports: ["Route"],
          },
          {
            allowImports: ["Route"],
            files: ["*Page.tsx"],
          },
        ],
      ],
    },
  },
];
```

❌ Invalid (in `Button.tsx`):

```ts
import { Route } from "react-router";
```

✅ Valid (in `HomePage.tsx`):

```ts
import { Route } from "react-router";
```

### Mixed file and folder restrictions

Combine file and folder patterns for precise control:

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": [
        "error",
        [
          {
            disableImports: ["internalApi"],
            files: ["*.public.ts"],
            folders: ["**/api/**"],
          },
        ],
      ],
    },
  },
];
```

### Multiple configuration blocks

Use multiple configuration blocks for complex scenarios:

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": [
        "error",
        [
          // Disable Route globally
          {
            disableImports: ["Route"],
          },
          // Allow Route in Page files
          {
            allowImports: ["Route"],
            files: ["*Page.tsx"],
          },
          // Disable fs in frontend code
          {
            disableImports: ["fs"],
            folders: ["**/frontend/**"],
          },
        ],
      ],
    },
  },
];
```

### Restricting imports from specific modules

Use the `from` option to restrict imports only from specific modules. This is useful when the same import name exists in multiple packages:

```ts
// eslint.config.js
import nima from "eslint-plugin-nima";

export default [
  {
    plugins: { nima },
    rules: {
      "nima/restrict-imports": [
        "error",
        [
          {
            allowImports: ["Route"],
            files: ["*Page.tsx"],
            from: ["react-router", "react-router-dom"],
          },
        ],
      ],
    },
  },
];
```

❌ Invalid (in `Button.tsx`):

```ts
import { Route } from "react-router"; // Blocked - Route from react-router not allowed here
```

✅ Valid (in `Button.tsx`):

```ts
import { Route } from "lucide-react"; // Allowed - different module, not affected by the rule
```

✅ Valid (in `HomePage.tsx`):

```ts
import { Route } from "react-router"; // Allowed - file matches *Page.tsx pattern
```

You can also use glob patterns in `from`:

```ts
"nima/restrict-imports": [
  "error",
  [
    {
      allowImports: ["Route"],
      files: ["*Page.tsx"],
      from: ["react-router*"], // Matches react-router, react-router-dom, etc.
    },
  ],
]
```

---

## Messages

| Message ID          | Template                                                |
| ------------------- | ------------------------------------------------------- |
| `IMPORT_DISALLOWED` | `Do not import {{ importName }} inside {{ filename }}.` |

---

## Implementation notes & requirements

1. **Import matching is case-insensitive** - `Route` and `route` are treated as the same import.
2. **Pattern matching uses minimatch** - All file and folder patterns support glob syntax.
3. **Multiple configuration blocks are evaluated in order** - First matching rule wins.
4. **Allow-lists override deny-lists** - If an import is in an allow-list for a matching scope, it's permitted.

---

## Limitations & edge cases

1. **Dynamic imports** - The rule does not check dynamic imports like `import('module')`.
2. **Re-exports** - The rule checks import statements, not re-exports.
3. **Type imports** - Type-only imports (`import type { X }`) are checked the same as regular imports.

---

## Common use cases

### Restrict Route to Page components only

```ts
"nima/restrict-imports": [
  "error",
  [
    { disableImports: ["Route"] },
    { allowImports: ["Route"], files: ["*Page.tsx"] },
  ],
]
```

### Restrict Route from react-router to Page components only (ignore lucide-react)

```ts
"nima/restrict-imports": [
  "error",
  [
    {
      allowImports: ["Route"],
      files: ["*Page.tsx"],
      from: ["react-router*"],
    },
  ],
]
```

### Prevent Node.js imports in frontend code

```ts
"nima/restrict-imports": [
  "error",
  [
    {
      disableImports: ["fs", "path", "child_process"],
      folders: ["**/client/**", "**/frontend/**"],
    },
  ],
]
```

### Enforce using date-fns over moment

```ts
"nima/restrict-imports": [
  "error",
  [
    { disableImports: ["moment"] },
  ],
]
```

### Restrict test utilities to test files

```ts
"nima/restrict-imports": [
  "error",
  [
    { disableImports: ["@testing-library/react"] },
    {
      allowImports: ["@testing-library/react"],
      files: ["*.test.tsx", "*.spec.tsx"],
    },
  ],
]
```

---

## Quick configuration snippets

### Minimal (disable a single import)

```ts
"nima/restrict-imports": ["error", [{ disableImports: ["lodash"] }]]
```

### File-scoped restriction

```ts
"nima/restrict-imports": [
  "error",
  [{ disableImports: ["Route"] }, { allowImports: ["Route"], files: ["*Page.tsx"] }],
]
```

### Folder-scoped restriction

```ts
"nima/restrict-imports": [
  "error",
  [{ disableImports: ["fs"], folders: ["**/client/**"] }],
]
```

### Module-scoped restriction (using `from`)

```ts
"nima/restrict-imports": [
  "error",
  [{ allowImports: ["Route"], files: ["*Page.tsx"], from: ["react-router*"] }],
]
```

---

## Version

Introduced in `eslint-plugin-nima@1.2.2`.

---
