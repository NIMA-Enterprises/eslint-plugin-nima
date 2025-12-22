# `restrict-console-methods`

Restricts the usage of console methods in the codebase to enforce cleaner production code and consistent logging practices.  
Console statements are often left behind during development and should be removed or replaced with proper logging solutions.

---

## Table of contents

- [`restrict-console-methods`](#restrict-console-methods)
  - [Table of contents](#table-of-contents)
  - [Rule summary](#rule-summary)
  - [What the rule checks](#what-the-rule-checks)
  - [Options (all configurations)](#options-all-configurations)
    - [Default options](#default-options)
    - [Option details](#option-details)
      - [allow](#allow)
  - [Examples (by option)](#examples-by-option)
    - [Default behavior](#default-behavior)
    - [Allowing specific console methods](#allowing-specific-console-methods)
    - [Allowing multiple console methods](#allowing-multiple-console-methods)
  - [Messages](#messages)
  - [Implementation notes \& requirements](#implementation-notes--requirements)
  - [Limitations \& edge cases](#limitations--edge-cases)
  - [Quick configuration snippets](#quick-configuration-snippets)
    - [Flat ESLint config (eslint.config.js)](#flat-eslint-config-eslintconfigjs)
    - [Legacy .eslintrc.json](#legacy-eslintrcjson)
    - [Development-friendly configuration](#development-friendly-configuration)
  - [Version](#version)
  - [Further Reading](#further-reading)

---

## Rule summary

- **Goal:** Prevent console method usage in production code to maintain clean codebases and encourage proper logging practices.
- **Scope:** Detects all console method calls (e.g., `console.log`, `console.error`, `console.warn`, etc.) with configurable exceptions.
- **Type:** Suggestion rule that helps maintain code quality standards.

---

## What the rule checks

1. **Console method calls** - All `console.*` method invocations where the method exists in the known console methods set.
2. **Member expression validation** - Ensures the call is actually on the `console` object (not other objects with similar method names).
3. **Method name validation** - Only flags known console methods to avoid false positives on custom objects.

The rule reports violations for any console method usage unless explicitly allowed through configuration options.

---

## Options (all configurations)

The rule accepts a single options object with an array of allowed console methods. Type definition:

```ts
type Options = [
    Partial<{
        allow: string[];
    }>,
];
```

### Default options

```json
{
    "allow": ["info"]
}
```

### Option details

#### allow

- **Type:** `string[]`
- **Default:** `["info"]`
- **Description:** Array of console method names that are allowed. Any console method not in this array will trigger the rule.
- **Example values:** `["error", "warn", "info", "log", "debug", "trace"]`
- **Use case:** Allow specific console methods for logging while restricting others.

---

## Examples (by option)

### Default behavior

Incorrect:

```js
console.log("Debug message");
console.error("Something went wrong");
console.warn("Deprecated feature used");
console.info("Information message");
console.debug("Debug information");
console.trace("Stack trace");
```

Correct:

```js
// Use proper logging library instead
logger.info("Debug message");
logger.error("Something went wrong");
logger.warn("Deprecated feature used");

// Or remove console statements entirely
// (no console usage)
```

### Allowing specific console methods

Configuration allowing only error logging:

```jsonc
{
    "rules": {
        "nima/restrict-console-methods": ["error", { "allow": ["error"] }],
    },
}
```

Incorrect (with above config):

```js
console.log("This will be flagged");
console.warn("This will be flagged");
console.info("This will be flagged");
```

Correct (with above config):

```js
console.error("This is allowed");
// Other console methods are still restricted
```

### Allowing multiple console methods

Configuration allowing errors, warnings, and info:

```jsonc
{
    "rules": {
        "nima/restrict-console-methods": [
            "error",
            {
                "allow": ["error", "warn", "info"],
            },
        ],
    },
}
```

Incorrect (with above config):

```js
console.log("Not allowed");
console.debug("Not allowed");
console.trace("Not allowed");
```

Correct (with above config):

```js
console.error("Allowed for error reporting");
console.warn("Allowed for warnings");
console.info("Allowed for info messages");
```

---

## Messages

When triggered, this rule emits the following message:

- `NO_CONSOLE`  
  Message: `NIMA: The usage of console.{{ console }} is restricted.`

**Example reported text:**

```text
NIMA: The usage of console.log is restricted.
NIMA: The usage of console.error is restricted.
NIMA: The usage of console.warn is restricted.
```

---

## Implementation notes & requirements

- **AST Node Detection:** The rule uses AST node type checking to identify `CallExpression` nodes with `MemberExpression` callees.
- **Console Object Validation:** Ensures the object being called is specifically named "console" to avoid false positives.
- **Method Validation:** Uses a predefined set of known console methods (`CONSOLES` constant) to validate method names.
- **No Type Information Required:** Unlike some rules, this one works purely on AST structure and doesn't require TypeScript type information.
- **Suggestion Type:** This is a suggestion rule, meaning it helps maintain code quality but doesn't indicate syntax errors.

---

## Limitations & edge cases

- **Dynamic Method Calls:** The rule only catches direct console method calls like `console.log()`. It won't catch dynamic calls like `console['log']()` or `const method = 'log'; console[method]()`.
- **Aliased Console:** If console is aliased (`const c = console; c.log()`), the rule won't detect it since it specifically looks for the identifier "console".
- **Custom Console Objects:** The rule won't flag custom objects that happen to have console-like method names (e.g., `myLogger.log()` is safe).
- **Method Existence:** Only flags methods that exist in the predefined `CONSOLES` set, so unknown methods are ignored.
- **No Automatic Removal:** This rule identifies violations but doesn't provide automatic fixes - developers must manually remove or replace console statements.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
    {
        plugins: { nima: pluginNIMA },
        rules: {
            "nima/restrict-console-methods": [
                "error",
                {
                    allow: ["info"],
                },
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
        "nima/restrict-console-methods": [
            "error",
            {
                "allow": ["info"]
            }
        ]
    }
}
```

### Development-friendly configuration

For development environments where some console usage might be acceptable:

```json
{
    "plugins": ["nima"],
    "rules": {
        "nima/restrict-console-methods": [
            "warn",
            {
                "allow": ["error", "warn", "info", "log"]
            }
        ]
    }
}
```

---

## Version

Introduced in `eslint-plugin-nima@0.0.1`.

---

## Further Reading

- [Console API](https://developer.mozilla.org/en-US/docs/Web/API/Console)
- [ESLint no-console Rule](https://eslint.org/docs/latest/rules/no-console)
- [Logging Best Practices](https://betterstack.com/community/guides/logging/javascript-logging-best-practices/)
