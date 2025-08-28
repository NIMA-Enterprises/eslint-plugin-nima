# `restrict-console-methods`

Restricts the usage of console methods in the codebase to enforce cleaner production code and consistent logging practices.  
Console statements are often left behind during development and should be removed or replaced with proper logging solutions.

---

## Table of contents

- [Rule summary](#rule-summary)
- [What the rule checks](#what-the-rule-checks)
- [Options (all configurations)](#options-all-configurations)
  - [allowConsoleError](#allowconsoleerror)
  - [allowConsoleLog](#allowconsolelog)
  - [allowConsoleWarn](#allowconsolewarn)
- [Examples (by option)](#examples-by-option)
  - [Default behaviour](#default-behaviour)
  - [Allowing specific console methods](#allowing-specific-console-methods)
  - [Mixed configuration](#mixed-configuration)
- [Messages](#messages)
- [Implementation notes & requirements](#implementation-notes--requirements)
- [Limitations & edge cases](#limitations--edge-cases)
- [Configuration](#quick-configuration-snippets)
- [Version](#version)

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

The rule accepts a single options object with boolean flags for specific console methods. Type definition:

```ts
type Options = [
  Partial<{
    allowConsoleError: boolean;
    allowConsoleLog: boolean;
    allowConsoleWarn: boolean;
  }>
];
```

### Default options (recommended)

```json
{
  "allowConsoleError": false,
  "allowConsoleLog": false,
  "allowConsoleWarn": false
}
```

### Option details

#### allowConsoleError

- **Type:** `boolean`
- **Default:** `false`
- **Description:** When `true`, allows `console.error()` calls to pass without triggering the rule.
- **Use case:** Error logging might be acceptable in production environments.

#### allowConsoleLog

- **Type:** `boolean`
- **Default:** `false`
- **Description:** When `true`, allows `console.log()` calls to pass without triggering the rule.
- **Use case:** Rarely recommended for production, but useful during development phases.

#### allowConsoleWarn

- **Type:** `boolean`
- **Default:** `false`
- **Description:** When `true`, allows `console.warn()` calls to pass without triggering the rule.
- **Use case:** Warning messages might be acceptable for user notifications or deprecation warnings.

---

## Examples (by option)

### Default behaviour

#### ❌ Incorrect

```js
console.log("Debug message");
console.error("Something went wrong");
console.warn("Deprecated feature used");
console.info("Information message");
console.debug("Debug information");
console.trace("Stack trace");
```

#### ✅ Correct

```js
// Use proper logging library instead
logger.info("Debug message");
logger.error("Something went wrong");
logger.warn("Deprecated feature used");

// Or remove console statements entirely
// (no console usage)
```

### Allowing specific console methods

#### Configuration allowing only error logging

```jsonc
{
  "rules": {
    "nima/restrict-console-methods": ["error", { "allowConsoleError": true }]
  }
}
```

#### ❌ Incorrect (with above config)

```js
console.log("This will be flagged");
console.warn("This will be flagged");
console.info("This will be flagged");
```

#### ✅ Correct (with above config)

```js
console.error("This is allowed");
// Other console methods are still restricted
```

### Mixed configuration

#### Configuration allowing errors and warnings

```jsonc
{
  "rules": {
    "nima/restrict-console-methods": [
      "error",
      {
        "allowConsoleError": true,
        "allowConsoleWarn": true,
        "allowConsoleLog": false
      }
    ]
  }
}
```

#### ❌ Incorrect (with above config)

```js
console.log("Not allowed");
console.info("Not allowed");
console.debug("Not allowed");
```

#### ✅ Correct (with above config)

```js
console.error("Allowed for error reporting");
console.warn("Allowed for warnings");
```

---

## Messages

When triggered, this rule emits the following message:

- `NO_CONSOLE`  
  Message: `NIMA: The usage of console.{{ console }} is restricted.`

**Example reported text:**

```
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

## Common Use Cases

### Development vs Production

```js
// Instead of leaving console statements
console.log("User logged in:", user.id);

// Use environment-aware logging
if (process.env.NODE_ENV === "development") {
  logger.debug("User logged in:", user.id);
}
```

### Proper Logging Replacement

```js
// Replace console usage
console.error("API call failed:", error);
console.warn("Feature deprecated");

// With structured logging
logger.error("API call failed", { error: error.message, stack: error.stack });
logger.warn("Feature deprecated", {
  feature: "oldFeature",
  deprecationDate: "2024-01-01",
});
```

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
          allowConsoleError: false,
          allowConsoleLog: false,
          allowConsoleWarn: false,
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
        "allowConsoleError": false,
        "allowConsoleLog": false,
        "allowConsoleWarn": false
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
        "allowConsoleError": true,
        "allowConsoleLog": true,
        "allowConsoleWarn": true
      }
    ]
  }
}
```

---

## Version

Introduced in `eslint-plugin-nima@0.0.1`.

---
