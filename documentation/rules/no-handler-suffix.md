# `no-handler-suffix`

Enforces using the **handle** prefix instead of the **handler** suffix for function names.  
Consistent prefixes improve readability and make function intent more explicit.

---

## Table of contents

- [Rule summary](#rule-summary)
- [What the rule checks](#what-the-rule-checks)
- [Options (all configurations)](#options-all-configurations)
- [Examples (by option)](#examples-by-option)
  - [Default behavior](#default-behavior)
  - [Function declarations](#function-declarations)
  - [Arrow functions](#arrow-functions)
  - [Function expressions](#function-expressions)
  - [Auto-fix behavior](#auto-fix-behavior)
- [Messages](#messages)
- [Implementation notes & requirements](#implementation-notes--requirements)
- [Limitations & edge cases](#limitations--edge-cases)
- [Configuration](#quick-configuration-snippets)
- [Version](#version)

---

## Rule summary

- **Goal:** Ensure functions ending with "handler" suffix are renamed to use "handle" prefix instead.
- **Transformation:** `clickHandler` → `handleClick`, `submitHandler` → `handleSubmit`
- **Auto-fix:** Automatically renames the function and all its references in the current scope.

---

## What the rule checks

1. **Function declarations** with names ending in "handler" (case-insensitive).
2. **Arrow functions** assigned to variables with names ending in "handler".
3. **Function expressions** (both named and assigned to variables) with names ending in "handler".

When a function name ending with "handler" is detected, the rule reports an error and provides an automatic fix that:

- Removes the "handler" suffix
- Adds the "handle" prefix
- Capitalizes the remaining part appropriately
- Renames all references to the function within its scope

---

## Options (all configurations)

This rule has no configuration options. It uses a fixed transformation pattern.

```ts
type Options = [];
```

### Default options

```json
{}
```

---

## Examples (by option)

### Default behavior

#### ❌ Incorrect

```ts
function clickHandler() {
  console.log("clicked");
}

const submitHandler = () => {
  console.log("submitted");
};

const deleteHandler = function () {
  console.log("deleted");
};
```

#### ✅ Correct

```ts
function handleClick() {
  console.log("clicked");
}

const handleSubmit = () => {
  console.log("submitted");
};

const handleDelete = function () {
  console.log("deleted");
};
```

### Function declarations

#### ❌ Incorrect

```ts
function mouseOverHandler(event) {
  event.preventDefault();
}

function keyPressHandler() {
  // handle key press
}

// Usage
document.addEventListener("mouseover", mouseOverHandler);
document.addEventListener("keypress", keyPressHandler);
```

#### ✅ Correct (after auto-fix)

```ts
function handleMouseOver(event) {
  event.preventDefault();
}

function handleKeyPress() {
  // handle key press
}

// Usage (automatically updated)
document.addEventListener("mouseover", handleMouseOver);
document.addEventListener("keypress", handleKeyPress);
```

### Arrow functions

#### ❌ Incorrect

```ts
const changeHandler = (value) => {
  setState(value);
};

const errorHandler = (error) => {
  console.error(error);
};
```

#### ✅ Correct (after auto-fix)

```ts
const handleChange = (value) => {
  setState(value);
};

const handleError = (error) => {
  console.error(error);
};
```

### Function expressions

#### ❌ Incorrect

```ts
const clickHandler = function clickHandler() {
  // handle click
};

const submitHandler = function () {
  // anonymous function expression
};
```

#### ✅ Correct (after auto-fix)

```ts
const handleClick = function handleClick() {
  // handle click
};

const handleSubmit = function () {
  // anonymous function expression
};
```

### Auto-fix behavior

The rule automatically handles name conflicts by generating unique names:

#### ❌ Incorrect

```ts
function handleClick() {
  // existing function
}

function clickHandler() {
  // conflicting name after transformation
}
```

#### ✅ Correct (after auto-fix)

```ts
function handleClick() {
  // existing function
}

function handleClick2() {
  // automatically renamed to avoid conflict
}
```

---

## Messages

When triggered, this rule emits the following message:

- `BAD_HANDLER_NAME`  
  Message: `NIMA: You shouldn't use the handler suffix, use the handle prefix instead ({{ fnWithGoodName }})`

**Example reported text:**

```
NIMA: You shouldn't use the handler suffix, use the handle prefix instead (handleClick)
```

---

## Implementation notes & requirements

- **Automatic fixing:** This rule provides automatic code fixes that rename both the function declaration and all references within the current scope.
- **Name collision handling:** If the suggested name already exists in the scope, the rule automatically generates a unique name by appending a number (e.g., `handleClick2`, `handleClick3`).
- **Case-insensitive matching:** The rule detects "handler" suffix regardless of case (`Handler`, `HANDLER`, `handler` all match).
- **Scope-aware renaming:** All references to the renamed function within its scope are automatically updated.
- **Reference tracking:** Uses ESLint's scope analysis to find and rename all variable references.

---

## Limitations & edge cases

- **Scope limitations:** The rule only renames references within the current scope. References from other modules or global scope are not automatically updated.
- **Dynamic references:** String-based references (e.g., `window['clickHandler']`) are not automatically renamed.
- **Destructured assignments:** Complex destructuring patterns may not be fully supported for reference tracking.
- **Empty base names:** If a function is named just "handler", it becomes "handle" after transformation.
- **Nested scopes:** References in nested scopes are handled, but complex closure scenarios may need manual verification.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    plugins: { nima: pluginNIMA },
    rules: {
      "nima/no-handler-suffix": "error",
    },
  },
];
```

### Legacy .eslintrc.json

```json
{
  "plugins": ["nima"],
  "rules": {
    "nima/no-handler-suffix": "error"
  }
}
```

---

## Version

Introduced in `eslint-plugin-nima@0.0.1`.

---
