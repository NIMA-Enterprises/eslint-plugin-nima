# `restrict-function-usage`

Disallows the use of specific functions in specified files or folders, with support for allow-lists and deny-lists.  
This rule provides fine-grained control over function usage across your codebase, enabling architectural constraints and security policies.

---

## Table of contents

- [`restrict-function-usage`](#restrict-function-usage)
  - [Table of contents](#table-of-contents)
  - [Rule summary](#rule-summary)
  - [What the rule checks](#what-the-rule-checks)
  - [Options (all configurations)](#options-all-configurations)
    - [Default options](#default-options)
    - [Option details](#option-details)
      - [allowFunctions](#allowfunctions)
      - [disableFunctions](#disablefunctions)
      - [files](#files)
      - [folders](#folders)
    - [Configuration Logic](#configuration-logic)
  - [Examples (by option)](#examples-by-option)
    - [Default behavior](#default-behavior)
    - [Disabling functions globally](#disabling-functions-globally)
    - [Disabling functions in specific files](#disabling-functions-in-specific-files)
    - [Disabling functions in specific folders](#disabling-functions-in-specific-folders)
    - [Allow-list approach](#allow-list-approach)
    - [Mixed file and folder restrictions](#mixed-file-and-folder-restrictions)
    - [Multiple configuration blocks](#multiple-configuration-blocks)
  - [Messages](#messages)
  - [Implementation notes \& requirements](#implementation-notes--requirements)
    - [Configuration Processing Logic](#configuration-processing-logic)
  - [Limitations \& edge cases](#limitations--edge-cases)
  - [Quick configuration snippets](#quick-configuration-snippets)
    - [Flat ESLint config (eslint.config.js)](#flat-eslint-config-eslintconfigjs)
    - [Legacy .eslintrc.json](#legacy-eslintrcjson)
    - [Security-focused configuration](#security-focused-configuration)
  - [Version](#version)
  - [Further Reading](#further-reading)

---

## Rule summary

- **Goal:** Control function usage across your codebase by restricting or allowing specific functions in targeted files/folders.
- **Scope:** Supports both direct function calls (`functionName()`) and method calls (`object.method()`).
- **Flexibility:** Configure multiple rules with different scopes and function lists.
- **Pattern Matching:** Uses minimatch for flexible file and folder pattern matching.

---

## What the rule checks

1. **Direct function calls** - Functions called directly like `dangerousFunction()` or `eval()`.
2. **Method calls** - Methods called on objects like `fs.unlinkSync()` or `process.exit()`.
3. **File pattern matching** - Applies restrictions based on file path patterns using minimatch.
4. **Folder pattern matching** - Applies restrictions based on directory patterns using minimatch.

The rule supports both allow-list and deny-list approaches, giving you flexible control over function usage patterns.

---

## Options (all configurations)

The rule accepts an array of configuration objects, each defining a scope and function restrictions. Type definition:

```ts
type Options = [
    Partial<{
        allowFunctions: string[];
        disableFunctions: string[];
        files: string[];
        folders: string[];
    }>[],
];
```

### Default options

```json
[[]]
```

The rule is disabled by default and requires explicit configuration to activate.

### Option details

#### allowFunctions

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** List of functions that are explicitly allowed. When used, all other functions are implicitly restricted in the specified scope.
- **Case sensitivity:** Case-insensitive matching.
- **Behavior:** Creates an allow-list - only listed functions are permitted.

#### disableFunctions

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** List of functions that are explicitly forbidden in the specified scope.
- **Case sensitivity:** Case-insensitive matching.
- **Behavior:** Creates a deny-list - listed functions are prohibited.

#### files

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** File patterns (using minimatch) where the function restrictions apply.
- **Pattern support:** Supports wildcards like `*.test.js`, `**/*.spec.ts`, etc.
- **Path matching:** Matches against the basename of files.

#### folders

- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Folder patterns (using minimatch) where the function restrictions apply.
- **Pattern support:** Supports wildcards like `**/test/**`, `src/utils`, etc.
- **Path matching:** Matches against the directory path.

### Configuration Logic

- **No scope specified** (`files: [], folders: []`): Applies globally to all files.
- **Both files and folders specified**: Must match BOTH a file pattern AND a folder pattern.
- **Only files specified**: Must match a file pattern.
- **Only folders specified**: Must match a folder pattern.
- **Allow-list behavior**: When `allowFunctions` is used, functions NOT in the list are restricted.
- **Deny-list behavior**: When `disableFunctions` is used, functions IN the list are restricted.

---

## Examples (by option)

### Default behavior

With no configuration, the rule does nothing:

```js
// All function calls are allowed
dangerousFunction();
eval("code");
fs.unlinkSync("file.txt");
```

### Disabling functions globally

Configuration:

```jsonc
{
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "disableFunctions": ["eval", "setTimeout", "setInterval"],
                },
            ],
        ],
    },
}
```

Incorrect:

```js
// In any file
eval("some code");
setTimeout(() => {}, 1000);
setInterval(() => {}, 1000);
```

Correct:

```js
// Use alternatives
JSON.parse("some json");
requestAnimationFrame(() => {});
```

### Disabling functions in specific files

Configuration:

```jsonc
{
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "disableFunctions": ["console.log", "debugger"],
                    "files": ["*.prod.js", "*.min.js"],
                },
            ],
        ],
    },
}
```

Incorrect (in files matching `*.prod.js` or `*.min.js`):

```js
// In app.prod.js
console.log("Debug message");
debugger;
```

Correct:

```js
// In app.prod.js - use proper logging
logger.info("Production message");

// In app.dev.js - console.log is allowed
console.log("Development debug");
```

### Disabling functions in specific folders

Configuration:

```jsonc
{
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "disableFunctions": ["fetch", "XMLHttpRequest"],
                    "folders": ["**/components/**", "**/utils/**"],
                },
            ],
        ],
    },
}
```

Incorrect (in components/ or utils/ folders):

```js
// In src/components/UserCard.js
fetch("/api/users");
new XMLHttpRequest();
```

Correct:

```js
// In src/components/UserCard.js - use dependency injection
function UserCard({ apiService }) {
    // apiService handles the HTTP calls
    const users = apiService.getUsers();
}

// In src/services/api.js - fetch is allowed outside restricted folders
fetch("/api/users");
```

### Allow-list approach

Configuration:

```jsonc
{
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "allowFunctions": ["console.log", "console.error"],
                    "folders": ["**/production/**"],
                },
            ],
        ],
    },
}
```

Incorrect (in production/ folders):

```js
// In src/production/app.js
console.warn("This is not allowed");
console.info("This is not allowed");
alert("This is not allowed");
```

Correct (in production/ folders):

```js
// In src/production/app.js
console.log("This is allowed");
console.error("This is allowed");
```

### Mixed file and folder restrictions

Configuration:

```jsonc
{
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "disableFunctions": ["localStorage", "sessionStorage"],
                    "files": ["*.component.js"],
                    "folders": ["**/components/**"],
                },
            ],
        ],
    },
}
```

Files must match BOTH patterns - be named `*.component.js` AND be in a `components/` folder.

Incorrect (in `src/components/User.component.js`):

```js
localStorage.setItem("user", data);
sessionStorage.getItem("token");
```

Correct:

```js
// In src/components/User.component.js - use props/state
function UserComponent({ user, onUserChange }) {
    // Manage state through props, not direct storage access
}

// In src/components/User.js - different filename, rule doesn't apply
localStorage.setItem("user", data); // Allowed

// In src/services/User.component.js - different folder, rule doesn't apply
localStorage.setItem("user", data); // Allowed
```

### Multiple configuration blocks

Configuration:

```jsonc
{
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "disableFunctions": ["eval", "Function"],
                    "folders": ["**/src/**"],
                },
                {
                    "allowFunctions": ["console.log"],
                    "files": ["*.test.js"],
                },
                {
                    "disableFunctions": ["process.exit"],
                    "files": ["*.js"],
                    "folders": ["**/routes/**"],
                },
            ],
        ],
    },
}
```

This creates three separate rules:

1. Disable `eval` and `Function` in all src/ folders
2. Allow only `console.log` in test files
3. Disable `process.exit` in .js files within routes/ folders

---

## Messages

When triggered, this rule emits the following message:

- `FUNCTION_DISALLOWED`  
  Message: `Do not use {{ fnName }} inside {{ filename }}.`

**Example reported text:**

```text
Do not use eval inside src/utils/helper.js.
Do not use setTimeout inside components/App.component.js.
Do not use fetch inside src/components/UserList.js.
```

---

## Implementation notes & requirements

- **Pattern Matching:** Uses `minimatch` library for flexible file and folder pattern matching with support for wildcards and globbing.
- **Case Insensitive:** Function name matching is case-insensitive for better usability.
- **Path Resolution:** Uses Node.js `path` module for reliable file and directory path handling.
- **AST Analysis:** Detects both direct function calls (`Identifier`) and method calls (`MemberExpression`).
- **Multiple Configurations:** Supports multiple configuration objects for complex restriction scenarios.
- **Problem Type:** Classified as a "problem" rule, indicating it identifies actual issues rather than style preferences.

### Configuration Processing Logic

1. For each function call, the rule iterates through all configuration objects
2. Determines if the current file matches the scope (files/folders patterns)
3. For allow-lists: If function is in `allowFunctions`, it's permitted (unless scope doesn't match)
4. For deny-lists: If function is in `disableFunctions` and scope matches, it's forbidden
5. Returns early on first matching restriction

---

## Limitations & edge cases

- **Dynamic Function Calls:** Cannot detect dynamically constructed function calls like `window[functionName]()` or `eval()` calls that construct function names.
- **Computed Property Access:** Method calls using computed properties like `obj['method']()` are not detected.
- **Function Variables:** If a function is assigned to a variable and then called, the rule won't detect it: `const fn = dangerousFunction; fn();`
- **Aliasing:** Function aliases won't be detected: `const log = console.log; log("test");`
- **Pattern Matching Complexity:** Very complex glob patterns might have performance implications on large codebases.
- **No Cross-File Analysis:** The rule only analyzes individual files and doesn't track function definitions across modules.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
    {
        plugins: { nima: pluginNIMA },
        rules: {
            "nima/restrict-function-usage": [
                "error",
                [
                    {
                        disableFunctions: ["eval", "setTimeout"],
                        folders: ["**/src/**"],
                    },
                    {
                        allowFunctions: ["console.log", "console.error"],
                        files: ["*.test.js"],
                    },
                ],
            ],
        },
    },
];
```

### Legacy .eslintrc.json

```json
{
    "plugins": ["nima"],
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "disableFunctions": ["eval", "Function"],
                    "folders": ["**/production/**"]
                },
                {
                    "allowFunctions": ["fetch"],
                    "folders": ["**/services/**"]
                }
            ]
        ]
    }
}
```

### Security-focused configuration

```json
{
    "plugins": ["nima"],
    "rules": {
        "nima/restrict-function-usage": [
            "error",
            [
                {
                    "disableFunctions": [
                        "eval",
                        "Function",
                        "setTimeout",
                        "setInterval",
                        "setImmediate"
                    ]
                }
            ]
        ]
    }
}
```

---

## Version

Introduced in `eslint-plugin-nima@1.0.0`.

---

## Further Reading

- [ESLint Custom Rules](https://eslint.org/docs/latest/extend/custom-rules)
- [Minimatch Pattern Matching](https://github.com/isaacs/minimatch)
- [Architectural Decision Records](https://adr.github.io/)
