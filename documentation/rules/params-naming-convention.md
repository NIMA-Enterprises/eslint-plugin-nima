# `params-naming-convention`

Enforces using a **single object parameter** for functions with multiple parameters, or prefixing parameters with specific prefixes.  
This improves function readability, maintainability, and makes parameter passing more explicit.

---

## Table of contents

- [`params-naming-convention`](#params-naming-convention)
    - [Table of contents](#table-of-contents)
    - [Rule summary](#rule-summary)
    - [What the rule checks](#what-the-rule-checks)
    - [Options (all configurations)](#options-all-configurations)
        - [Default options](#default-options)
        - [Option details](#option-details)
            - [allowedParameters](#allowedparameters)
            - [ignore](#ignore)
            - [ignoreFunctions](#ignorefunctions)
            - [ignorePrefixes](#ignoreprefixes)
    - [Examples (by option)](#examples-by-option)
        - [Default behavior](#default-behavior)
        - [Custom allowed parameters](#custom-allowed-parameters)
        - [Ignoring specific parameter names](#ignoring-specific-parameter-names)
        - [Ignoring specific functions](#ignoring-specific-functions)
        - [Using ignore prefixes](#using-ignore-prefixes)
        - [Object destructuring parameters](#object-destructuring-parameters)
        - [Index parameter exception](#index-parameter-exception)
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

- **Goal:** Encourage using object parameters instead of multiple individual parameters, or use specific prefixes for parameters.
- **Benefits:** Improved readability, easier parameter passing, better maintainability, and clearer function signatures.
- **Exceptions:** Functions with object destructuring, certain ignored functions, and parameters with specific prefixes.

---

## What the rule checks

1. **Function declarations** with more than the allowed number of parameters.
2. **Function expressions** with more than the allowed number of parameters.
3. **Arrow functions** with more than the allowed number of parameters.
4. **Parameter count validation** against the configured `allowedParameters` threshold.
5. **Exception handling** for ignored parameter names, function names, and prefixed parameters.

When a function has more parameters than allowed (and doesn't match any exceptions), the rule reports an error suggesting either to use an object parameter or prefix the parameters with allowed prefixes.

---

## Options (all configurations)

The rule accepts a single options object. Type definition:

```ts
type Options = [
    Partial<{
        allowedParameters: number;
        ignore: string[];
        ignoreFunctions: string[];
        ignorePrefixes: string[];
    }>,
];
```

### Default options

```json
{
    "allowedParameters": 1,
    "ignore": ["e"],
    "ignoreFunctions": ["reduce"],
    "ignorePrefixes": ["$"]
}
```

### Option details

#### allowedParameters

- **Type:** `number`
- **Default:** `1`
- **Description:** Maximum number of parameters allowed before the rule triggers. Functions with this many parameters or fewer will not be flagged.
- **Example:** Setting to `3` allows up to 3 parameters without triggering the rule.

#### ignore

- **Type:** `string[]`
- **Default:** `["e"]`
- **Description:** Parameter names that should be ignored when counting parameters. These parameters don't count toward the limit.
- **Example:** `["event", "error", "e"]` ignores common event and error parameter names.

#### ignoreFunctions

- **Type:** `string[]`
- **Default:** `["reduce"]`
- **Description:** Function names that should be completely ignored by this rule. These functions can have any number of parameters.
- **Example:** `["map", "filter", "reduce"]` ignores common array method callbacks.

#### ignorePrefixes

- **Type:** `string[]`
- **Default:** `["$"]`
- **Description:** Parameter prefixes that make parameters exempt from the rule. Also used in the suggested fix message.
- **Example:** `["$", "_", "tmp"]` ignores parameters starting with these prefixes.

---

## Examples (by option)

### Default behavior

Incorrect:

```ts
function createUser(name, email, age, address) {
    return { name, email, age, address };
}

const calculateTotal = (price, tax, discount, shipping) => {
    return price + tax - discount + shipping;
};
```

Correct:

```ts
// Option 1: Use object parameter
function createUser({ name, email, age, address }) {
    return { name, email, age, address };
}

// Option 2: Use prefix (with default "$")
function createUser($name, $email, $age, $address) {
    return { $name, $email, $age, $address };
}

// Option 3: Single parameter (within limit)
function greet(name) {
    return `Hello, ${name}!`;
}
```

### Custom allowed parameters

Configuration:

```json
{
    "allowedParameters": 3
}
```

Incorrect:

```ts
function processData(input, options, callback, context) {
    // 4 parameters exceeds limit of 3
    return callback(input, options, context);
}
```

Correct:

```ts
function processData(input, options, callback) {
    // 3 parameters is within limit
    return callback(input, options);
}

function processData({ input, options, callback, context }) {
    // Object parameter
    return callback(input, options, context);
}
```

### Ignoring specific parameter names

Configuration:

```json
{
    "ignore": ["e", "event", "error"]
}
```

Incorrect:

```ts
function handleClick(e, data, options, callback) {
    // 'e' is ignored, but still 3 other parameters exceed limit of 1
    callback(data, options);
}
```

Correct:

```ts
function handleClick(e, { data, options, callback }) {
    // 'e' is ignored, object parameter for the rest
    callback(data, options);
}

function handleClick(e, data) {
    // 'e' is ignored, only 1 other parameter
    processData(data);
}
```

### Ignoring specific functions

Configuration:

```json
{
    "ignoreFunctions": ["reduce", "map", "addEventListener"]
}
```

Incorrect:

```ts
function processItems(items, processor, filter, sorter) {
    // Not in ignored functions list
    return items.filter(filter).map(processor).sort(sorter);
}
```

Correct:

```ts
// Ignored function - can have any number of parameters
const result = items.reduce((acc, item, index, array) => {
    return acc + item;
}, 0);

// Use object parameter for non-ignored functions
function processItems({ items, processor, filter, sorter }) {
    return items.filter(filter).map(processor).sort(sorter);
}
```

### Using ignore prefixes

Configuration:

```json
{
    "ignorePrefixes": ["$", "_", "tmp"]
}
```

Incorrect:

```ts
function calculate(value, multiplier, offset, precision) {
    // No prefixes used
    return (value * multiplier + offset).toFixed(precision);
}
```

Correct:

```ts
// Option 1: Use prefixes
function calculate($value, $multiplier, $offset, $precision) {
    return ($value * $multiplier + $offset).toFixed($precision);
}

// Option 2: Mix of prefixes and regular parameters
function calculate(value, _multiplier, tmpOffset, precision) {
    return (value * _multiplier + tmpOffset).toFixed(precision);
}

// Option 3: Object parameter
function calculate({ value, multiplier, offset, precision }) {
    return (value * multiplier + offset).toFixed(precision);
}
```

### Object destructuring parameters

Correct (automatically allowed):

```ts
// Single object parameter with destructuring - always allowed
function createUser({ name, email, age, address, preferences }) {
    return { name, email, age, address, preferences };
}

// Multiple parameters where first is object destructuring - flagged normally
function updateUser({ name, email }, userId, options) {
    // This would be flagged unless exceptions apply
}
```

### Index parameter exception

Correct (automatically allowed):

```ts
// Second parameter named 'index' is automatically allowed
items.map((item, index) => {
    return `${index}: ${item}`;
});

function processItem(data, index) {
    // 'index' as second parameter is allowed
    return { ...data, position: index };
}
```

---

## Messages

When triggered, this rule emits the following message:

- `USE_OBJECT_PARAMETERS`  
  Message: `NIMA: Function has {{count}} parameter(s). Either prefix them: {{params}}, or put all parameters in one object.`

**Example reported text:**

```text
NIMA: Function has 3 parameter(s). Either prefix them: $name, $email, $age, or put all parameters in one object.
```

---

## Implementation notes & requirements

- **Function detection:** Checks all function types including declarations, expressions, and arrow functions.
- **Parameter counting:** Only counts identifier parameters, ignoring rest parameters and other complex patterns.
- **Name resolution:** Uses `getFunctionName` utility to determine function names for the ignore list.
- **Exception precedence:** Checks exceptions in order: parameter count → ignored functions → object destructuring → index parameter → ignored names/prefixes.
- **Suggestion generation:** Automatically generates prefixed parameter suggestions using all configured prefixes.

---

## Limitations & edge cases

- **Complex parameter patterns:** Only handles simple identifier parameters; rest parameters, default parameters, and complex destructuring may not be fully supported.
- **Function name detection:** Custom function name detection may not work for all function expression patterns.
- **Nested functions:** Rule applies to all functions regardless of nesting level.
- **Method definitions:** Class methods and object methods are treated the same as regular functions.
- **Generic parameters:** TypeScript generic parameters are not considered in the parameter count.
- **Overloaded functions:** Each overload is checked independently.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
    {
        plugins: { nima: pluginNIMA },
        rules: {
            "nima/params-naming-convention": [
                "error",
                {
                    allowedParameters: 2,
                    ignore: ["e", "event", "error"],
                    ignoreFunctions: ["reduce", "map", "filter"],
                    ignorePrefixes: ["$", "_"],
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
        "nima/params-naming-convention": [
            "error",
            {
                "allowedParameters": 2,
                "ignore": ["e", "event", "error"],
                "ignoreFunctions": ["reduce", "map", "filter"],
                "ignorePrefixes": ["$", "_"]
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

- [JavaScript Function Parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#parameters)
- [Object Destructuring in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring)
- [Clean Code: Function Arguments](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
