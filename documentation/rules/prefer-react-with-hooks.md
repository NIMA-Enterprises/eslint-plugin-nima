# `prefer-react-with-hooks`

Enforces using **React.hook** syntax instead of importing hooks directly from React.  
This provides consistent namespacing, clearer hook identification, and better code organization.

---

## Table of contents

- [Rule summary](#rule-summary)
- [What the rule checks](#what-the-rule-checks)
- [Options (all configurations)](#options-all-configurations)
- [Examples (by option)](#examples-by-option)
  - [Default behaviour](#default-behaviour)
  - [Direct hook imports](#direct-hook-imports)
  - [Mixed import patterns](#mixed-import-patterns)
  - [Hook usage without imports](#hook-usage-without-imports)
  - [Complex import scenarios](#complex-import-scenarios)
- [Messages](#messages)
- [Implementation notes & requirements](#implementation-notes--requirements)
- [Limitations & edge cases](#limitations--edge-cases)
- [Configuration](#quick-configuration-snippets)
- [Version](#version)

---

## Rule summary

- **Goal:** Enforce consistent React hook usage through React.hook syntax instead of direct named imports.
- **Benefits:** Clear hook identification, consistent namespacing, reduced import clutter, and explicit React dependency.
- **Auto-fix:** Automatically removes hook imports and prefixes hook calls with `React.`, adding React import if needed.

---

## What the rule checks

1. **Hook imports** from React (useState, useEffect, etc.) in import declarations.
2. **Hook usage** without React prefix when hooks are called directly.
3. **React import presence** to determine if React needs to be imported.
4. **Import restructuring** to maintain other React imports while removing hook imports.
5. **Hook identification** using a predefined list of React hooks (REACT_HOOKS constant).

When hooks are imported directly or used without React prefix, the rule reports an error and provides automatic fixes that restructure imports and add React prefixes to hook calls.

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

### Default behaviour

#### ❌ Incorrect

```tsx
import { useState, useEffect } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <div>{count}</div>;
}
```

#### ✅ Correct (after auto-fix)

```tsx
import React from "react";

function MyComponent() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <div>{count}</div>;
}
```

### Direct hook imports

#### ❌ Incorrect

```tsx
import { useState, useCallback, useMemo } from "react";

const Calculator = () => {
  const [value, setValue] = useState(0);

  const handleIncrement = useCallback(() => {
    setValue((prev) => prev + 1);
  }, []);

  const doubledValue = useMemo(() => value * 2, [value]);

  return (
    <div>
      <p>Value: {value}</p>
      <p>Doubled: {doubledValue}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};
```

#### ✅ Correct (after auto-fix)

```tsx
import React from "react";

const Calculator = () => {
  const [value, setValue] = React.useState(0);

  const handleIncrement = React.useCallback(() => {
    setValue((prev) => prev + 1);
  }, []);

  const doubledValue = React.useMemo(() => value * 2, [value]);

  return (
    <div>
      <p>Value: {value}</p>
      <p>Doubled: {doubledValue}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};
```

### Mixed import patterns

#### ❌ Incorrect

```tsx
import React, { useState, useEffect, Component } from "react";

class OldComponent extends Component {
  render() {
    return <div>Class component</div>;
  }
}

function NewComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return <div>{data}</div>;
}
```

#### ✅ Correct (after auto-fix)

```tsx
import React, { Component } from "react";

class OldComponent extends Component {
  render() {
    return <div>Class component</div>;
  }
}

function NewComponent() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetchData().then(setData);
  }, []);

  return <div>{data}</div>;
}
```

### Hook usage without imports

#### ❌ Incorrect

```tsx
// No React import, but hooks are used
function MyComponent() {
  const [count, setCount] = useState(0); // Hook used without import

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### ✅ Correct (after auto-fix)

```tsx
import React from "react";

function MyComponent() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log("Component mounted");
  }, []);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Complex import scenarios

#### ❌ Incorrect

```tsx
// Only hook imports, no default React
import { useState, useEffect, useContext, createContext } from "react";

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");
  const contextValue = { theme, setTheme };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div>App content</div>
    </ThemeContext.Provider>
  );
}
```

#### ✅ Correct (after auto-fix)

```tsx
import React, { createContext } from "react";

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = React.useState("light");
  const contextValue = { theme, setTheme };

  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div>App content</div>
    </ThemeContext.Provider>
  );
}
```

#### Multiple hooks with existing React import

#### ❌ Incorrect

```tsx
import React, { useState, useEffect, useRef, forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (ref) {
      ref.current = inputRef.current;
    }
  }, [ref]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});
```

#### ✅ Correct (after auto-fix)

```tsx
import React, { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (ref) {
      ref.current = inputRef.current;
    }
  }, [ref]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});
```

---

## Messages

When triggered, this rule emits one of the following messages:

- `PREFER_REACT`  
  Message: `NIMA: Use React.{{hook}} instead of importing {{hook}} directly.`

- `PREFER_REACT_PREFIX`  
  Message: `NIMA: Prefix {{hook}} with React.`

**Example reported text:**

```
NIMA: Use React.useState instead of importing useState directly.
NIMA: Prefix useEffect with React.
```

---

## Implementation notes & requirements

- **Hook detection:** Uses `REACT_HOOKS` constant to identify React hooks that should be prefixed.
- **Import analysis:** Analyzes React imports to determine current import structure and what modifications are needed.
- **Smart import restructuring:** Preserves non-hook React imports while removing hook imports and adding React default import if needed.
- **Comprehensive auto-fix:** Handles various import patterns including default imports, named imports, and mixed patterns.
- **AST analysis:** Uses program-level analysis to understand the complete import structure before applying fixes.
- **Lazy analysis:** Only analyzes imports when hook usage is detected for performance optimization.

---

## Limitations & edge cases

- **Custom hooks:** Only applies to built-in React hooks defined in `REACT_HOOKS` constant; custom hooks are not affected.
- **Dynamic imports:** Does not handle dynamic imports or conditional imports of React hooks.
- **Re-exports:** May not handle complex re-export patterns or barrel exports correctly.
- **Namespace conflicts:** If `React` identifier is used for something else in the scope, fixes may cause conflicts.
- **Import order:** May change the order of imports during restructuring, which could conflict with import sorting rules.
- **Complex import patterns:** Very complex import destructuring or aliasing patterns may not be handled perfectly.
- **Multiple React imports:** If there are multiple import statements from React, the behavior may be unpredictable.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    plugins: { nima: pluginNIMA },
    rules: {
      "nima/prefer-react-with-hooks": "error",
    },
  },
];
```

### Legacy .eslintrc.json

```json
{
  "plugins": ["nima"],
  "rules": {
    "nima/prefer-react-with-hooks": "error"
  }
}
```

---

## Version

Introduced in `eslint-plugin-nima@0.0.1`.

---
