# Rule Overview

This is where the magic happens. This plugin covers a wide range of rules. There’s no single philosophy-these rules just fix and enforce conventions to speed up code review and make the codebase better.

Each rule has three levels of explanation:

1. **Short explanation** (this page): A quick one-liner.
1. **Medium explanation** (this page, further down): A few sentences with a code example.
1. **Full explanation**: A dedicated page with all the details.

---

## Short explanation

### Conventions

- **boolean-naming-convention**  
  Enforces prefixes like `is`, `has`, `will` for boolean values.

- **params-naming-convention**  
  Improves readability by enforcing objects as function parameters.

### Restrictions

- **restrict-console-methods**  
  Disallows the use of any `console` methods.

- **restrict-function-usage**  
  Lets you configure which functions can be used in specific files or folders.

- **restrict-imports**  
  Disallows specific imports in specified files or folders with allow-list and deny-list support.

- **no-objects-in-deps**  
  Prevents objects in dependency arrays.

- **no-handler-suffix**  
  Disallows functions with the `handler` suffix.

### Preferences

- **prefer-arrow-functions**  
  Enforces the use of arrow functions instead of other function forms.

- **prefer-void-for-optional-param**  
  Enforces destructuring function parameters inside the function body with `| void` union type.

- **prefer-export-under-component**  
  Requires components to be exported below their declaration.

- **prefer-react-fc**  
  Enforces typing components as `React.FC` for consistency and props typing.

- **prefer-react-with-hooks**  
  Enforces `React.useState` instead of unscoped `useState`.

---

## Medium explanation

### Convention rules

#### boolean-naming-convention

This rule requires booleans to start with appropriate prefixes. It makes them easier to read and understand.

**Configuration options:**

1. **allowedPrefixes** - default: `["is", "has", "can", "should", "will", "are", "were", "was"]`. Overrides the default allowed prefixes.
1. **checkFunctions** - default: true. Enables or disables checking of function names.
1. **checkParameters** - default: true. Enables or disables checking of parameter names.
1. **checkProperties** - default: true. Enables or disables checking of property names.
1. **checkVariables** - default: true. Enables or disables checking of variable names.

See the dedicated [boolean-naming-convention documentation](./boolean-naming-convention.md) for full details.

**Examples:**

```js
const NIMALabs = () => true;
// NIMA: Function 'NIMALabs' returns a boolean, use a prefix like isNIMALabs
```

```js
const NIMAEnterprises = true;
// NIMA: Boolean variable 'NIMAEnterprises' should use a prefix like isNIMAEnterprises
```

```js
const NIMA = {
    Labs: true,
    // NIMA: Boolean property 'Labs' should use a prefix like isLabs
    Enterprises: false,
    // NIMA: Boolean property 'Enterprises' should use a prefix like isEnterprises
};
```

```js
const iRanOutOfNames = (NIMA: boolean) => {};
// NIMA: Boolean parameter 'NIMA' should use a prefix like isNIMA
```

---

#### params-naming-convention

This rule enforces using objects as parameters to improve readability and maintainability.

**Configuration options:**

1. **allowedParameters** - default: 1. Defines how many parameters are allowed before enforcing this rule.
1. **ignore** - default: `e`. Disables this rule for specific parameter names.
1. **ignoreFunctions** - default: `reduce`. Disables this rule for specific functions.
1. **ignorePrefixes** - default: `$`. Disables this rule for parameters with certain prefixes.

See the dedicated [params-naming-convention documentation](./params-naming-convention.md) for full details.

**Examples:**

```js
const NIMALabs = (NIMA: number, Labs: number) => {};
// NIMA: Function has 2 parameter(s). Either prefix them: $NIMA, $Labs, or put all parameters in one object.
```

```js
const NIMAEnterprises = (NIMA: number, { Labs }: { Labs: number }) => {};
// NIMA: Function has 1 parameter(s). Either prefix them: $NIMA, or put all parameters in one object.
```

---

### Restriction rules

#### restrict-console-methods

This rule disallows the use of console methods.

**Configuration options:**

1. **allow** - default: `["info"]`. Array of console method names that are allowed.

See the dedicated [restrict-console-methods documentation](./restrict-console-methods.md) for full details.

**Examples:**

```js
console.log("NIMA Labs");
// NIMA: The usage of console.log is restricted.
```

```js
console.error("NIMA Enterprises");
// NIMA: The usage of console.error is restricted.
```

```js
console.warn("NIMA");
// NIMA: The usage of console.warn is restricted.
```

---

#### restrict-function-usage

This rule allows restricting the usage of functions in specific files or folders.

**Configuration options (per entry):**

1. **allowFunctions** - functions allowed in specified files or folders.
1. **disableFunctions** - functions disabled in specified files or folders.
1. **files** - target files for the configuration.
1. **folders** - target folders for the configuration.

By default, this rule does nothing. See the dedicated [restrict-function-usage documentation](./restrict-function-usage.md) for full details.

---

#### restrict-imports

This rule disallows specific imports in specified files or folders, with support for allow-lists and deny-lists.

**Configuration options (per entry):**

1. **allowImports** - imports allowed in specified files or folders.
1. **disableImports** - imports disabled in specified files or folders.
1. **files** - target files for the configuration.
1. **folders** - target folders for the configuration.
1. **from** - source modules to restrict imports from.

By default, this rule does nothing. See the dedicated [restrict-imports documentation](./restrict-imports.md) for full details.

**Examples:**

```js
// With config: disableImports: ['Route'], folders: ['**/components/**']
import { Route } from "react-router";
// NIMA: Import 'Route' is not allowed in this file.
```

---

#### no-objects-in-deps

This rule prevents placing objects in dependency arrays to avoid unpredictable side effects.

**Configuration options:** none.

See the dedicated [no-objects-in-deps documentation](./no-objects-in-deps.md) for full details.

**Example:**

```js
React.useEffect(() => {}, [{ NIMA: "Labs" }]);
// NIMA: Objects inside of dependency arrays aren't allowed. Try using JSON.stringify.
```

---

#### no-handler-suffix

This rule enforces the convention of using the `handle` prefix instead of the `handler` suffix for functions.

**Configuration options:** none.

See the dedicated [no-handler-suffix documentation](./no-handler-suffix.md) for full details.

**Example:**

```js
const clickHandler = () => {};
// NIMA: You shouldn't use the handler suffix, use the handle prefix instead (handleClick).
```

---

### Preference rules

#### prefer-arrow-functions

This rule enforces writing arrow functions and discourages declarations or expressions.

**Configuration options:**

1. **allowAsync** - default: true.
1. **allowConstructors** - default: true.
1. **allowFunctionDeclarations** - default: false.
1. **allowFunctionExpressions** - default: false.
1. **allowGenerators** - default: true.
1. **allowMethodDefinitions** - default: false.

See the dedicated [prefer-arrow-functions documentation](./prefer-arrow-functions.md) for full details.

**Examples:**

```js
function NIMALabs() {}
// NIMA: Prefer arrow functions over function declarations.
```

```js
const NIMAEnterprises = function NIMA() {};
// NIMA: Prefer arrow functions over function expressions.
```

```js
const NIMA = {
    Labs() {},
    // NIMA: Prefer arrow functions over method definitions.
};
```

---

#### prefer-void-for-optional-param

This rule enforces destructuring function parameters inside the function body instead of in the parameter list, with `| void` union type.

**Configuration options:** none.

See the dedicated [prefer-void-for-optional-param documentation](./prefer-void-for-optional-param.md) for full details.

**Examples:**

```js
const fn = ({ a, b }: { a?: number, b?: string }) => {};
// NIMA: Destructure parameters in the function body with '| void' union type

// Correct:
const fn = (props: { a?: number, b?: string } | void) => {
  const { a, b } = props ?? {};
};
```

---

#### prefer-export-under-component

This rule enforces exporting components under their declaration, disallowing inline `export`.

**Configuration options:** none.

See the dedicated [prefer-export-under-component documentation](./prefer-export-under-component.md) for full details.

**Examples:**

```js
export const NIMA = () => <></>;
// NIMA: Declare React component 'NIMA' separately from its export statement.
```

```js
export default function NIMALabs() {
    return <></>;
}
// NIMA: Declare React component 'NIMALabs' separately from its export statement.
```

---

#### prefer-react-fc

This rule enforces typing components as `React.FC` (unless using another library type).

**Configuration options:** none.

See the dedicated [prefer-react-fc documentation](./prefer-react-fc.md) for full details.

**Example:**

```js
const NIMALabs = () => <></>;
// NIMA: Component functions must use React.FC type annotation.
```

---

#### prefer-react-with-hooks

This rule enforces prefixing hooks with `React.`.

**Configuration options:** none.

See the dedicated [prefer-react-with-hooks documentation](./prefer-react-with-hooks.md) for full details.

**Example:**

```js
import { useState } from "react";
// NIMA: Use React.useState instead of importing useState directly.

const [NIMA, setNIMA] = useState();
// NIMA: Prefix useState with React.
```

---

## Full explanation

All rules have their own dedicated page with detailed configuration, usage, and recommendations.

### Rule documentation pages

- [boolean-naming-convention](./boolean-naming-convention.md)
- [no-handler-suffix](./no-handler-suffix.md)
- [no-objects-in-deps](./no-objects-in-deps.md)
- [params-naming-convention](./params-naming-convention.md)
- [prefer-arrow-functions](./prefer-arrow-functions.md)
- [prefer-void-for-optional-param](./prefer-void-for-optional-param.md)
- [prefer-export-under-component](./prefer-export-under-component.md)
- [prefer-react-fc](./prefer-react-fc.md)
- [prefer-react-with-hooks](./prefer-react-with-hooks.md)
- [restrict-console-methods](./restrict-console-methods.md)
- [restrict-function-usage](./restrict-function-usage.md)
- [restrict-imports](./restrict-imports.md)
