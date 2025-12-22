# `prefer-void-for-optional-param`

Enforces using `void` union type for optional parameters and destructuring them in the function body.  
This pattern prevents runtime errors by explicitly handling cases where no argument is passed to functions with optional object parameters.

---

## Table of contents

- [`prefer-void-for-optional-param`](#prefer-void-for-optional-param)
  - [Table of contents](#table-of-contents)
  - [Rule summary](#rule-summary)
  - [What the rule checks](#what-the-rule-checks)
  - [Options (all configurations)](#options-all-configurations)
    - [Default options](#default-options)
  - [Examples (by option)](#examples-by-option)
    - [Default behavior](#default-behavior)
    - [Arrow functions](#arrow-functions)
    - [Function declarations](#function-declarations)
    - [Function expressions](#function-expressions)
    - [Parameters with default values](#parameters-with-default-values)
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

- **Goal:** Ensure functions with optional object parameters use `void` union type and destructure inside the function body.
- **Pattern:** Replace parameter destructuring with a `props` parameter typed as `Type | void`, then destructure using `props ?? {}` inside the function.
- **Benefits:** Prevents runtime errors when functions are called without arguments, explicit handling of undefined parameters.

---

## What the rule checks

1. **Object pattern parameters** with optional properties in function declarations, expressions, and arrow functions.
2. **Type annotations** to detect when all properties in an object parameter are optional.
3. **Parameter destructuring** that should be moved inside the function body.
4. **Missing `void` union** in parameter types that have optional properties.

When a function parameter uses object destructuring with all optional properties, the rule reports an error and suggests using a `props` parameter with `| void` type union, then destructuring inside the function body.

---

## Options (all configurations)

This rule has no configuration options.

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

Incorrect:

```typescript
const fn = ({ a, b, c }: { a?: number; b?: string; c?: boolean }) => {
    console.log(a, b, c);
};

function fn({ a, b }: { a?: number; b?: string }) {
    return a + (b?.length ?? 0);
}
```

Correct:

```typescript
const fn = (props: { a?: number; b?: string; c?: boolean } | void) => {
    const { a, b, c } = props ?? {};
    console.log(a, b, c);
};

function fn(props: { a?: number; b?: string } | void) {
    const { a, b } = props ?? {};
    return a + (b?.length ?? 0);
}
```

### Arrow functions

Incorrect:

```typescript
const processData = ({ id, name }: { id?: string; name?: string }) => {
    return `${id}: ${name}`;
};
```

Correct:

```typescript
const processData = (props: { id?: string; name?: string } | void) => {
    const { id, name } = props ?? {};
    return `${id}: ${name}`;
};
```

### Function declarations

Incorrect:

```typescript
function updateUser({ email, age }: { email?: string; age?: number }) {
    console.log(email, age);
}
```

Correct:

```typescript
function updateUser(props: { email?: string; age?: number } | void) {
    const { email, age } = props ?? {};
    console.log(email, age);
}
```

### Function expressions

Incorrect:

```typescript
const handler = function ({ value }: { value?: boolean }) {
    return value ?? false;
};
```

Correct:

```typescript
const handler = function (props: { value?: boolean } | void) {
    const { value } = props ?? {};
    return value ?? false;
};
```

### Parameters with default values

Incorrect:

```typescript
const fn = ({ a = 10, b = "test" }: { a?: number; b?: string }) => {
    console.log(a, b);
};
```

Correct:

```typescript
const fn = (props: { a?: number; b?: string } | void) => {
    const { a = 10, b = "test" } = props ?? {};
    console.log(a, b);
};
```

---

## Messages

When triggered, this rule emits the following message:

- `PREFER_VOID_FOR_OPTIONAL_PARAM`  
  Message: `NIMA: Parameter with all optional properties should use 'props: Type | void' and be destructured inside the function body.`

---

## Implementation notes & requirements

- **Type Analysis:** The rule analyzes TypeScript type annotations to determine if all properties in an object parameter are optional.
- **Auto-fix:** Provides automatic fixes that rename the parameter to `props`, add `| void` to the type annotation, and insert a destructuring statement at the beginning of the function body.
- **Default Values Preservation:** When properties have default values in the original destructuring, these are preserved in the destructuring statement inside the function body.
- **TypeScript Required:** This rule requires TypeScript and type information to function properly.

---

## Limitations & edge cases

- **JavaScript Files:** This rule only works with TypeScript files that have type annotations. It won't affect plain JavaScript files.
- **Non-optional Parameters:** If an object parameter has at least one required (non-optional) property, the rule doesn't apply.
- **Mixed Parameters:** Functions with multiple parameters where only one uses optional object destructuring will have that parameter converted.
- **Rest Properties:** Rest properties in destructuring patterns (`...rest`) are preserved in the conversion.
- **Nested Destructuring:** Complex nested destructuring patterns may not be handled correctly by the auto-fix.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
    {
        plugins: { nima: pluginNIMA },
        rules: {
            "nima/prefer-void-for-optional-param": "error",
        },
    },
];
```

### Legacy .eslintrc.json

```json
{
    "plugins": ["nima"],
    "rules": {
        "nima/prefer-void-for-optional-param": "error"
    }
}
```

---

## Version

Introduced in `eslint-plugin-nima@1.2.4`.

---

## Further Reading

- [TypeScript Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Nullish Coalescing Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [TypeScript Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)
