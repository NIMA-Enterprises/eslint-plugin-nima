# `prefer-react-fc`

Enforces **React.FC type annotation** for React component functions in TypeScript.  
This ensures consistent typing, better IntelliSense support, and explicit component interface definition.

---

## Table of contents

- [`prefer-react-fc`](#prefer-react-fc)
  - [Table of contents](#table-of-contents)
  - [Rule summary](#rule-summary)
  - [What the rule checks](#what-the-rule-checks)
  - [Options (all configurations)](#options-all-configurations)
    - [Default options](#default-options)
    - [Option details](#option-details)
      - [allowArrowFunctions](#allowarrowfunctions)
      - [allowFunctionDeclarations](#allowfunctiondeclarations)
  - [Examples (by option)](#examples-by-option)
    - [Default behavior](#default-behavior)
    - [Arrow function components](#arrow-function-components)
    - [Function declaration components](#function-declaration-components)
    - [Custom component types](#custom-component-types)
    - [Complex JSX returns](#complex-jsx-returns)
    - [Non-component functions](#non-component-functions)
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

- **Goal:** Ensure all React component functions have explicit React.FC or React.FunctionComponent type annotations.
- **Benefits:** Better type safety, consistent component interfaces, improved IntelliSense, and explicit component contracts.
- **Scope:** Only applies to functions that are identified as React components (PascalCase naming + JSX returns).

---

## What the rule checks

1. **Function declarations** that are identified as React components without React.FC type annotation.
2. **Arrow function expressions** assigned to variables that are React components without React.FC type annotation.
3. **Component identification** using PascalCase naming convention and JSX return detection.
4. **JSX return analysis** including conditional expressions, logical expressions, and nested block statements.
5. **Existing type annotations** to avoid flagging components that already have React.FC or custom component types.

When a React component function lacks proper type annotation, the rule reports an error requiring React.FC type annotation.

---

## Options (all configurations)

The rule accepts a single options object. Type definition:

```ts
type Options = [
  Partial<{
    allowArrowFunctions: boolean;
    allowFunctionDeclarations: boolean;
  }>
];
```

### Default options

```json
{
  "allowArrowFunctions": true,
  "allowFunctionDeclarations": true
}
```

### Option details

#### allowArrowFunctions

- **Type:** `boolean`
- **Default:** `true`
- **Description:** When `true`, allows arrow function components to be checked by the rule. When `false`, arrow function components are ignored.
- **Note:** This controls whether arrow functions are subject to the React.FC requirement, not whether they're allowed.

#### allowFunctionDeclarations

- **Type:** `boolean`
- **Default:** `true`
- **Description:** When `true`, allows function declaration components to be checked by the rule. When `false`, function declaration components are ignored.
- **Note:** This controls whether function declarations are subject to the React.FC requirement, not whether they're allowed.

---

## Examples (by option)

### Default behavior

Incorrect:

```tsx
// Arrow function component without React.FC
const MyComponent = ({ name }) => {
  return <div>Hello {name}</div>;
};

// Function declaration without React.FC
function AnotherComponent({ title }) {
  return <h1>{title}</h1>;
}

// Component with props but no type annotation
const UserCard = (props) => {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
};
```

Correct:

```tsx
import React from "react";

// Arrow function with React.FC
const MyComponent: React.FC<{ name: string }> = ({ name }) => {
  return <div>Hello {name}</div>;
};

// Function declaration with return type annotation
function AnotherComponent({ title }: { title: string }): React.ReactElement {
  return <h1>{title}</h1>;
}

// Using FC alias
const UserCard: FC<{ name: string; email: string }> = (props) => {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p>{props.email}</p>
    </div>
  );
};
```

### Arrow function components

Incorrect:

```tsx
const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

const Modal = ({ isOpen, onClose }) =>
  isOpen ? (
    <div className="modal">
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;

const LoadingSpinner = () => {
  return <div className="spinner">Loading...</div>;
};
```

Correct:

```tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) =>
  isOpen ? (
    <div className="modal">
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;

const LoadingSpinner: React.FC = () => {
  return <div className="spinner">Loading...</div>;
};
```

### Function declaration components

Incorrect:

```tsx
function Header({ title, subtitle }) {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </header>
  );
}

function ProductList({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

Correct:

```tsx
interface HeaderProps {
  title: string;
  subtitle?: string;
}

function Header({ title, subtitle }: HeaderProps): React.ReactElement {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </header>
  );
}

interface Product {
  id: string;
  name: string;
}

function ProductList({
  products,
}: {
  products: Product[];
}): React.ReactElement {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Custom component types

Correct (not flagged):

```tsx
// Custom component type (allowed)
type CustomComponent<T = {}> = (props: T) => React.ReactElement;

const MyComponent: CustomComponent<{ name: string }> = ({ name }) => {
  return <div>Hello {name}</div>;
};

// Interface extending component behavior
interface MyComponentType {
  (props: { title: string }): React.ReactElement;
  displayName?: string;
}

const ExtendedComponent: MyComponentType = ({ title }) => {
  return <h1>{title}</h1>;
};
```

### Complex JSX returns

The rule detects JSX in various return patterns:

Incorrect:

```tsx
const ConditionalComponent = ({ condition, data }) => {
  if (condition) {
    return <div>Condition is true</div>;
  }
  return <div>Condition is false</div>;
};

const LogicalComponent = ({ show, content }) => {
  return show && <div>{content}</div>;
};

const TernaryComponent = ({ type }) => {
  return type === "success" ? (
    <div className="success">Success!</div>
  ) : (
    <div className="error">Error!</div>
  );
};
```

Correct:

```tsx
const ConditionalComponent: React.FC<{ condition: boolean; data: any }> = ({
  condition,
  data,
}) => {
  if (condition) {
    return <div>Condition is true</div>;
  }
  return <div>Condition is false</div>;
};

const LogicalComponent: React.FC<{ show: boolean; content: string }> = ({
  show,
  content,
}) => {
  return show && <div>{content}</div>;
};

const TernaryComponent: React.FC<{ type: "success" | "error" }> = ({
  type,
}) => {
  return type === "success" ? (
    <div className="success">Success!</div>
  ) : (
    <div className="error">Error!</div>
  );
};
```

### Non-component functions

Correct (not flagged):

```tsx
// Utility functions (not PascalCase, not flagged)
const formatDate = (date) => {
  return date.toLocaleDateString();
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Functions that don't return JSX (not flagged)
function ProcessData(data) {
  return data.map((item) => item.processed);
}

// Hook functions (not flagged due to naming convention)
const useCustomHook = () => {
  return { value: "hook result" };
};
```

---

## Messages

When triggered, this rule emits the following message:

- `REQUIRE_REACT_FC`  
  Message: `NIMA: Component functions must use React.FC type annotation.`

**Example reported text:**

```text
NIMA: Component functions must use React.FC type annotation.
```

---

## Implementation notes & requirements

- **TypeScript requirement:** This rule only works with TypeScript code and requires type information.
- **Component detection:** Uses `isComponentFunction()` utility to identify components by PascalCase naming.
- **JSX analysis:** Performs deep AST analysis to detect JSX returns in various patterns (conditional, logical, ternary expressions).
- **Type annotation detection:** Checks for existing React.FC, FunctionComponent, or custom component type annotations.
- **Custom component types:** Allows custom component types that end with "Component" or use qualified names.
- **Nested JSX detection:** Analyzes block statements, if statements, and complex return patterns.

---

## Limitations & edge cases

- **TypeScript only:** This rule requires TypeScript and will not work with plain JavaScript files.
- **Component detection:** Relies on PascalCase naming conventions - components not following this pattern won't be detected.
- **Complex JSX patterns:** Very complex or dynamically generated JSX patterns may not be detected correctly.
- **Generic components:** Generic React components may need careful type annotation to avoid false positives.
- **HOCs and wrapped components:** Higher-order components and complex wrapper patterns may not be detected properly.
- **Dynamic returns:** Functions with highly dynamic or computed return statements may not be analyzed correctly.
- **Import requirements:** Assumes React types are available in scope (React.FC, React.FunctionComponent, etc.).
- **Custom type detection:** May incorrectly allow or flag custom component type patterns depending on naming.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    plugins: { nima: pluginNIMA },
    rules: {
      "nima/prefer-react-fc": [
        "error",
        {
          allowArrowFunctions: true,
          allowFunctionDeclarations: true,
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
    "nima/prefer-react-fc": [
      "error",
      {
        "allowArrowFunctions": true,
        "allowFunctionDeclarations": true
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

- [React Function Components](https://react.dev/learn/your-first-component#defining-a-component)
- [TypeScript React.FC](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/)
- [TypeScript with React](https://www.typescriptlang.org/docs/handbook/react.html)
