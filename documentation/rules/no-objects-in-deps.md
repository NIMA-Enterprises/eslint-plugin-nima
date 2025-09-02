# `no-objects-in-deps`

Prevents **objects**, **arrays**, and **new expressions** from being used directly in React hook dependency arrays.  
Direct object references in dependency arrays cause unnecessary re-renders because objects are compared by reference, not value.

---

## Table of contents

- [`no-objects-in-deps`](#no-objects-in-deps)
  - [Table of contents](#table-of-contents)
  - [Rule summary](#rule-summary)
  - [What the rule checks](#what-the-rule-checks)
  - [Options (all configurations)](#options-all-configurations)
    - [Default options](#default-options)
  - [Examples (by option)](#examples-by-option)
    - [Default behavior](#default-behavior)
      - [❌ Incorrect](#-incorrect)
      - [✅ Correct](#-correct)
    - [Object expressions](#object-expressions)
      - [❌ Incorrect](#-incorrect-1)
      - [✅ Correct](#-correct-1)
    - [Array expressions](#array-expressions)
      - [❌ Incorrect](#-incorrect-2)
      - [✅ Correct](#-correct-2)
    - [New expressions](#new-expressions)
      - [❌ Incorrect](#-incorrect-3)
      - [✅ Correct](#-correct-3)
    - [Variable references](#variable-references)
      - [❌ Incorrect](#-incorrect-4)
      - [✅ Correct](#-correct-4)
    - [Recommended solutions](#recommended-solutions)
  - [Messages](#messages)
  - [Implementation notes \& requirements](#implementation-notes--requirements)
  - [Limitations \& edge cases](#limitations--edge-cases)
  - [Quick configuration snippets](#quick-configuration-snippets)
    - [Flat ESLint config (eslint.config.js)](#flat-eslint-config-eslintconfigjs)
    - [Legacy .eslintrc.json](#legacy-eslintrcjson)
  - [Version](#version)

---

## Rule summary

- **Goal:** Prevent objects, arrays, and constructor calls from being used directly in React hook dependency arrays.
- **Problem:** Objects and arrays are compared by reference, causing hooks to re-run on every render even when their content hasn't changed.
- **Solution:** Use primitive values, `JSON.stringify()`, or move object creation outside the component.

---

## What the rule checks

1. **Hook dependency arrays** in React hooks that accept dependencies (useEffect, useMemo, useCallback, etc.).
2. **Object expressions** (`{}`) directly in dependency arrays.
3. **Array expressions** (`[]`) directly in dependency arrays.
4. **New expressions** (`new SomeClass()`) directly in dependency arrays.
5. **Variable references** that are initialized with object/array/new expressions.

When any of these patterns are detected in a dependency array, the rule reports an error and suggests using `JSON.stringify()` or other alternatives to ensure proper dependency comparison.

---

## Options (all configurations)

This rule has no configuration options. It applies to all React hooks that accept dependency arrays.

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
import { useEffect, useMemo } from "react";

function MyComponent({ data }) {
  useEffect(() => {
    // do something
  }, [{ key: "value" }]); // Object expression in deps

  const memoized = useMemo(() => {
    return processData(data);
  }, [["item1", "item2"]]); // Array expression in deps

  return <div>Content</div>;
}
```

#### ✅ Correct

```ts
import { useEffect, useMemo } from "react";

function MyComponent({ data }) {
  useEffect(() => {
    // do something
  }, [JSON.stringify({ key: "value" })]); // Stringified object

  const memoized = useMemo(() => {
    return processData(data);
  }, [JSON.stringify(["item1", "item2"])]); // Stringified array

  return <div>Content</div>;
}
```

### Object expressions

#### ❌ Incorrect

```ts
useEffect(() => {
  fetchData(config);
}, [{ url: "/api/data", method: "GET" }]); // Direct object

useMemo(() => {
  return calculateValue(options);
}, [{ precision: 2, round: true }]); // Direct object
```

#### ✅ Correct

```ts
// Option 1: Use JSON.stringify
useEffect(() => {
  fetchData(config);
}, [JSON.stringify({ url: "/api/data", method: "GET" })]);

// Option 2: Extract to stable reference
const config = { url: "/api/data", method: "GET" };
useEffect(() => {
  fetchData(config);
}, [config]); // Only if config is stable

// Option 3: Use individual properties
useEffect(() => {
  fetchData({ url: "/api/data", method: "GET" });
}, ["/api/data", "GET"]);
```

### Array expressions

#### ❌ Incorrect

```ts
useCallback(() => {
  return items.filter((item) => filterValues.includes(item.type));
}, [["type1", "type2", "type3"]]); // Direct array

useEffect(() => {
  processItems(selectedIds);
}, [[1, 2, 3, 4]]); // Direct array
```

#### ✅ Correct

```ts
// Option 1: Use JSON.stringify
useCallback(() => {
  return items.filter((item) => filterValues.includes(item.type));
}, [JSON.stringify(["type1", "type2", "type3"])]);

// Option 2: Extract to stable reference
const filterTypes = ["type1", "type2", "type3"];
useCallback(() => {
  return items.filter((item) => filterTypes.includes(item.type));
}, [filterTypes]); // Only if filterTypes is stable

// Option 3: Use individual values (when practical)
useEffect(() => {
  processItems([1, 2, 3, 4]);
}, [1, 2, 3, 4]);
```

### New expressions

#### ❌ Incorrect

```ts
useEffect(() => {
  const date = new Date();
  processDate(date);
}, [new Date()]); // New expression in deps

useMemo(() => {
  return new RegExp(pattern, "gi");
}, [new RegExp(pattern, "gi")]); // New expression in deps
```

#### ✅ Correct

```ts
// Option 1: Use JSON.stringify with constructor arguments
useEffect(() => {
  const date = new Date();
  processDate(date);
}, [JSON.stringify(new Date())]); // Though this specific case needs different handling

// Option 2: Use primitive values
useEffect(() => {
  const date = new Date();
  processDate(date);
}, [Date.now()]); // Use timestamp instead

// Option 3: Extract to stable reference
const regex = new RegExp(pattern, "gi");
useMemo(() => {
  return regex;
}, [regex]); // Only if regex is stable
```

### Variable references

#### ❌ Incorrect

```ts
function MyComponent() {
  const config = { api: "/data" }; // Variable with object
  const items = [1, 2, 3]; // Variable with array

  useEffect(() => {
    fetchData(config);
  }, [config]); // Variable reference flagged

  useEffect(() => {
    processItems(items);
  }, [items]); // Variable reference flagged
}
```

#### ✅ Correct

```ts
// Option 1: Move outside component (if static)
const CONFIG = { api: "/data" };
const ITEMS = [1, 2, 3];

function MyComponent() {
  useEffect(() => {
    fetchData(CONFIG);
  }, [CONFIG]); // External reference is stable

  useEffect(() => {
    processItems(ITEMS);
  }, [ITEMS]); // External reference is stable
}

// Option 2: Use JSON.stringify
function MyComponent() {
  const config = { api: "/data" };
  const items = [1, 2, 3];

  useEffect(() => {
    fetchData(config);
  }, [JSON.stringify(config)]);

  useEffect(() => {
    processItems(items);
  }, [JSON.stringify(items)]);
}
```

### Recommended solutions

Based on your use case, here are the best approaches:

1. **Static objects/arrays**: Move them outside the component
2. **Dynamic objects/arrays**: Use `JSON.stringify()` for value-based comparison
3. **Simple objects**: Extract individual properties as dependencies
4. **Constructor calls**: Use primitive values or stable references instead

---

## Messages

When triggered, this rule emits the following message:

- `NO_OBJECTS_IN_DEPENDENCIES`  
  Message: `NIMA: Objects inside of dependency arrays aren't allowed. Try doing JSON.stringify({{ object }}).`

**Example reported text:**

```
NIMA: Objects inside of dependency arrays aren't allowed. Try doing JSON.stringify({ key: 'value' }).
```

---

## Implementation notes & requirements

- **Hook detection:** The rule identifies React hooks by checking against a predefined list of hooks that accept dependency arrays (`HOOKS_WITH_DEPS`).
- **AST analysis:** Uses TypeScript ESLint AST to identify object expressions, array expressions, and new expressions.
- **Variable tracking:** Tracks variable declarations to catch variables initialized with objects/arrays that are later used in dependencies.
- **Scope analysis:** Uses ESLint's scope analysis to find variable definitions and their initialization values.
- **No auto-fix:** This rule reports issues but does not provide automatic fixes due to the context-dependent nature of the solutions.

---

## Limitations & edge cases

- **Indirect references:** The rule may not catch deeply nested variable references or complex object paths.
- **Dynamic hook names:** Only detects hooks in the predefined `HOOKS_WITH_DEPS` constant; custom hooks with similar patterns may not be detected.
- **False positives:** Variables that appear to be objects but are actually stable references may be flagged unnecessarily.
- **Computed member expressions:** Complex computed property access in dependency arrays may not be fully analyzed.
- **Third-party hooks:** Custom hooks from libraries that follow React's dependency array pattern may not be included in the detection.
- **JSON.stringify limitations**: The suggested `JSON.stringify()` solution doesn't work for objects with functions, undefined values, or circular references.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    plugins: { nima: pluginNIMA },
    rules: {
      "nima/no-objects-in-deps": "error",
    },
  },
];
```

### Legacy .eslintrc.json

```json
{
  "plugins": ["nima"],
  "rules": {
    "nima/no-objects-in-deps": "error"
  }
}
```

---

## Version

Introduced in `eslint-plugin-nima@0.0.1`.

---
