# `prefer-arrow-functions`

Enforces using **arrow functions** over traditional function declarations, expressions, and method definitions.  
Arrow functions provide lexical `this` binding, shorter syntax, and more consistent behavior in modern JavaScript.

---

## Table of contents

- [Rule summary](#rule-summary)
- [What the rule checks](#what-the-rule-checks)
- [Options (all configurations)](#options-all-configurations)
  - [Default options](#default-options)
  - [Option details](#option-details)
- [Examples (by option)](#examples-by-option)
  - [Default behavior](#default-behavior)
  - [Function declarations](#function-declarations)
  - [Function expressions](#function-expressions)
  - [Method definitions](#method-definitions)
  - [Export handling](#export-handling)
  - [Async functions](#async-functions)
  - [Generator functions](#generator-functions)
  - [Constructor functions](#constructor-functions)
- [Messages](#messages)
- [Implementation notes & requirements](#implementation-notes--requirements)
- [Limitations & edge cases](#limitations--edge-cases)
- [Configuration](#quick-configuration-snippets)
- [Version](#version)

---

## Rule summary

- **Goal:** Promote consistent use of arrow functions throughout the codebase for better lexical scoping and modern JavaScript practices.
- **Benefits:** Lexical `this` binding, shorter syntax, consistent behavior, and elimination of function hoisting issues.
- **Auto-fix:** Automatically converts function declarations, expressions, and method definitions to arrow functions with proper handling of exports and type annotations.

---

## What the rule checks

1. **Function declarations** (`function name() {}`) and converts them to const assignments with arrow functions.
2. **Function expressions** (`const name = function() {}`) and converts them to arrow functions.
3. **Method definitions** in classes and objects, converting them to arrow function properties.
4. **Export declarations** with proper handling for both default and named exports.
5. **Type annotations** preservation for TypeScript functions.
6. **Parameter handling** with proper parentheses management for single vs multiple parameters.

The rule provides automatic fixes that preserve function behavior while converting to arrow function syntax, including proper handling of async functions, type annotations, and export statements.

---

## Options (all configurations)

The rule accepts a single options object. Type definition:

```ts
type Options = [
  Partial<{
    allowAsync: boolean;
    allowConstructors: boolean;
    allowFunctionDeclarations: boolean;
    allowFunctionExpressions: boolean;
    allowGenerators: boolean;
    allowMethodDefinitions: boolean;
  }>
];
```

### Default options

```json
{
  "allowAsync": true,
  "allowConstructors": true,
  "allowFunctionDeclarations": false,
  "allowFunctionExpressions": false,
  "allowGenerators": true,
  "allowMethodDefinitions": false
}
```

### Option details

#### allowAsync

- **Type:** `boolean`
- **Default:** `true`
- **Description:** When `true`, allows async functions without flagging them. When `false`, async functions will be flagged and converted to async arrow functions.
- **Note:** Async arrow functions are still valid, this just controls whether to enforce the conversion.

#### allowConstructors

- **Type:** `boolean`
- **Default:** `true`
- **Description:** When `true`, allows constructor methods in classes. Constructor functions cannot be arrow functions due to JavaScript limitations.

#### allowFunctionDeclarations

- **Type:** `boolean`
- **Default:** `false`
- **Description:** When `true`, allows function declarations without flagging them. When `false`, all function declarations are flagged for conversion to arrow functions.

#### allowFunctionExpressions

- **Type:** `boolean`
- **Default:** `false`
- **Description:** When `true`, allows function expressions without flagging them. When `false`, function expressions are converted to arrow functions.

#### allowGenerators

- **Type:** `boolean`
- **Default:** `true`
- **Description:** When `true`, allows generator functions without flagging them. Generator functions cannot be converted to arrow functions.

#### allowMethodDefinitions

- **Type:** `boolean`
- **Default:** `false`
- **Description:** When `true`, allows method definitions in classes and objects. When `false`, method definitions are converted to arrow function properties.

---

## Examples (by option)

### Default behavior

Incorrect:

```ts
function greet(name) {
  return `Hello, ${name}!`;
}

const calculate = function (a, b) {
  return a + b;
};

class MyClass {
  method() {
    return "hello";
  }
}

const obj = {
  method() {
    return "world";
  },
};
```

Correct (after auto-fix):

```ts
const greet = (name) => {
  return `Hello, ${name}!`;
};

const calculate = (a, b) => {
  return a + b;
};

class MyClass {
  method = () => {
    return "hello";
  };
}

const obj = {
  method: () => {
    return "world";
  },
};
```

### Function declarations

Incorrect:

```ts
function add(a, b) {
  return a + b;
}

function processData(data) {
  return data.map((item) => item * 2);
}

// With TypeScript types
function multiply(a: number, b: number): number {
  return a * b;
}
```

Correct (after auto-fix):

```ts
const add = (a, b) => {
  return a + b;
};

const processData = (data) => {
  return data.map((item) => item * 2);
};

// TypeScript types preserved
const multiply = (a: number, b: number): number => {
  return a * b;
};
```

### Function expressions

Incorrect:

```ts
const handler = function (event) {
  event.preventDefault();
};

const callback = function () {
  console.log("called");
};

// Single parameter without parentheses after conversion
const transform = function (value) {
  return value.toString();
};
```

Correct (after auto-fix):

```ts
const handler = (event) => {
  event.preventDefault();
};

const callback = () => {
  console.log("called");
};

// Single parameter without type annotation gets no parentheses
const transform = (value) => {
  return value.toString();
};
```

### Method definitions

Incorrect:

```ts
class Calculator {
  add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

const utils = {
  format(value) {
    return `Value: ${value}`;
  },

  parse(str) {
    return parseInt(str);
  },
};
```

Correct (after auto-fix):

```ts
class Calculator {
  add = (a, b) => {
    return a + b;
  };

  static multiply = (a, b) => {
    return a * b;
  };
}

const utils = {
  format: (value) => {
    return `Value: ${value}`;
  },

  parse: (str) => {
    return parseInt(str);
  },
};
```

### Export handling

Incorrect:

```ts
export function helper(data) {
  return data.processed;
}

export default function main() {
  return "main function";
}

function internal() {
  return "internal";
}
```

Correct (after auto-fix):

```ts
export const helper = (data) => {
  return data.processed;
};

const main = () => {
  return "main function";
};
export default main;

const internal = () => {
  return "internal";
};
```

### Async functions

With `allowAsync: false`:

Incorrect:

```ts
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

const processAsync = async function (data) {
  return await transformData(data);
};
```

Correct (after auto-fix):

```ts
const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const processAsync = async (data) => {
  return await transformData(data);
};
```

### Generator functions

With `allowGenerators: true` (default), generator functions are not flagged:

```ts
function* generateNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = function* () {
  yield "hello";
  yield "world";
};
```

### Constructor functions

With `allowConstructors: true` (default), constructor functions are not flagged:

```ts
class MyClass {
  constructor(value) {
    this.value = value;
  }

  // Other methods would be flagged if allowMethodDefinitions: false
  method() {
    return this.value;
  }
}
```

---

## Messages

When triggered, this rule emits one of the following messages:

- `PREFER_ARROW_FUNCTIONS`  
  Message: `NIMA: Prefer arrow functions over function declarations.`

- `PREFER_ARROW_FUNCTION_EXPRESSION`  
  Message: `NIMA: Prefer arrow functions over function expressions.`

- `PREFER_ARROW_METHOD`  
  Message: `NIMA: Prefer arrow functions over method definitions.`

**Example reported text:**

```text
NIMA: Prefer arrow functions over function declarations.
```

---

## Implementation notes & requirements

- **Auto-fix capability:** This rule provides comprehensive automatic fixes for all flagged function types.
- **Export handling:** Properly handles both named and default exports, creating separate const declarations when necessary.
- **Type preservation:** Maintains TypeScript type annotations in the converted arrow functions.
- **Parameter formatting:** Automatically handles parentheses for parameters (single untyped parameters don't need parentheses).
- **Static methods:** Properly converts static class methods to static arrow function properties.
- **Scope preservation:** Maintains proper scoping and variable names during conversion.

---

## Limitations & edge cases

- **Generator functions:** Cannot be converted to arrow functions due to JavaScript syntax limitations.
- **Constructor methods:** Cannot be converted to arrow functions as constructors must be regular functions.
- **Hoisting behavior:** Converting function declarations to const assignments changes hoisting behavior - functions will no longer be available before their declaration.
- **`this` binding:** Arrow functions have lexical `this` binding, which may change behavior in some contexts (though this is usually desired).
- **`arguments` object:** Arrow functions don't have an `arguments` object, which may break existing code that relies on it.
- **Function names:** Named function expressions lose their name in the conversion, which may affect stack traces.
- **Complex parameter patterns:** Very complex destructuring or default parameter patterns may not be handled perfectly in auto-fixes.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    plugins: { nima: pluginNIMA },
    rules: {
      "nima/prefer-arrow-functions": [
        "error",
        {
          allowAsync: true,
          allowConstructors: true,
          allowFunctionDeclarations: false,
          allowFunctionExpressions: false,
          allowGenerators: true,
          allowMethodDefinitions: false,
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
    "nima/prefer-arrow-functions": [
      "error",
      {
        "allowAsync": true,
        "allowConstructors": true,
        "allowFunctionDeclarations": false,
        "allowFunctionExpressions": false,
        "allowGenerators": true,
        "allowMethodDefinitions": false
      }
    ]
  }
}
```

---

## Version

Introduced in `eslint-plugin-nima@0.0.1`.

---
