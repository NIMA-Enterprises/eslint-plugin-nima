# `restrict-optional-call-expression`

Restricts the use of optional chaining in call expressions (e.g., `callback?.()`) to enforce more explicit null/undefined handling patterns.  
Optional call expressions can hide potential issues and make code behavior less predictable.

---

## Table of contents

- [`restrict-optional-call-expression`](#restrict-optional-call-expression)
  - [Table of contents](#table-of-contents)
  - [Rule summary](#rule-summary)
  - [What the rule checks](#what-the-rule-checks)
  - [Options](#options)
  - [Examples](#examples)
    - [Incorrect code](#incorrect-code)
    - [Correct code](#correct-code)
  - [Messages](#messages)
  - [Implementation notes \& requirements](#implementation-notes--requirements)
  - [Limitations \& edge cases](#limitations--edge-cases)
  - [Quick configuration snippets](#quick-configuration-snippets)
    - [Flat ESLint config (eslint.config.js)](#flat-eslint-config-eslintconfigjs)
    - [Legacy .eslintrc.json](#legacy-eslintrcjson)
  - [Version](#version)
  - [Further Reading](#further-reading)

---

## Rule summary

- **Goal:** Prevent optional chaining on call expressions to encourage explicit null/undefined checks before invoking functions.
- **Scope:** Detects all call expressions that use optional chaining syntax (e.g., `fn?.()`).
- **Type:** Suggestion rule that helps maintain explicit and predictable code patterns.

---

## What the rule checks

1. **Optional call expressions** - Any function or method invocation using the `?.()` syntax.
2. **CallExpression nodes** - The rule checks if the `optional` property is `true` on `CallExpression` AST nodes.

The rule reports violations for any call expression that uses optional chaining, encouraging developers to use explicit conditional checks instead.

---

## Options

This rule has no configurable options.

```ts
type Options = [];
```

---

## Examples

### Incorrect code

```js
// Optional call on a callback
callback?.();

// Optional call on an object method
obj.method?.();

// Optional call with arguments
handler?.('arg1', 'arg2');

// Nested optional call
obj.nested.method?.();

// Optional call in arrow function
const fn = () => callback?.();
```

### Correct code

```js
// Regular function call
callback();

// Regular method call
obj.method();

// Explicit null check before calling
if (callback) {
    callback();
}

// Optional chaining on property access (not the call itself)
obj?.method();

// Nested optional property access with regular call
obj?.nested?.method();

// Using optional chaining in arguments is allowed
fn(obj?.value);
```

---

## Messages

| Message ID            | Message                                                   |
| --------------------- | --------------------------------------------------------- |
| `BAD_CALL_EXPRESSION` | NIMA: Avoid using optional chaining on call expressions.  |

---

## Implementation notes & requirements

- This rule uses the `CallExpression` AST node visitor.
- It checks the `optional` property of the `CallExpression` node, which is `true` when the call uses `?.()` syntax.
- The rule does not have any options or configuration - it simply flags all optional call expressions.

---

## Limitations & edge cases

1. **Optional property access vs optional call** - The rule only flags optional call expressions (`fn?.()`), not optional property access (`obj?.prop`). These are different AST patterns.

2. **Chained optionals** - Code like `obj?.method()` is NOT flagged because the optional chaining is on the property access, not the call itself. Only `obj.method?.()` would be flagged.

3. **No auto-fix** - This rule does not provide an auto-fix because the correct replacement depends on the specific use case and desired null-handling behavior.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import nima from "eslint-plugin-nima";

export default [
    {
        plugins: {
            nima,
        },
        rules: {
            "nima/restrict-optional-call-expression": "error",
        },
    },
];
```

### Legacy .eslintrc.json

```json
{
    "plugins": ["nima"],
    "rules": {
        "nima/restrict-optional-call-expression": "error"
    }
}
```

---

## Version

This rule was introduced in eslint-plugin-nima.

---

## Further Reading

- [MDN: Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [TypeScript: Optional Chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)
