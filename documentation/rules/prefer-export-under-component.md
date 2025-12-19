# `prefer-export-under-component`

Enforces **separate declaration and export** for React components instead of inline exports.  
This improves code readability, debugging experience, and component organization by clearly separating the component definition from its export.

---

## Table of contents

- [Rule summary](#rule-summary)
- [What the rule checks](#what-the-rule-checks)
- [Options (all configurations)](#options-all-configurations)
- [Examples (by option)](#examples-by-option)
  - [Default behavior](#default-behavior)
  - [Default exports](#default-exports)
  - [Named exports](#named-exports)
  - [Function declarations](#function-declarations)
  - [Arrow function variables](#arrow-function-variables)
  - [Function expressions](#function-expressions)
- [Messages](#messages)
- [Implementation notes & requirements](#implementation-notes--requirements)
- [Limitations & edge cases](#limitations--edge-cases)
- [Quick configuration snippets](#quick-configuration-snippets)
- [Version](#version)
- [Further Reading](#further-reading)

---

## Rule summary

- **Goal:** Separate React component declarations from their export statements for better code organization and debugging.
- **Benefits:** Improved readability, better stack traces, clearer component boundaries, and consistent export patterns.
- **Scope:** Only applies to React components (functions that return JSX and follow component naming conventions).

---

## What the rule checks

1. **Default export declarations** with inline function declarations that are React components.
2. **Named export declarations** with inline function declarations that are React components.
3. **Variable declarations** with arrow functions or function expressions that are exported and are React components.
4. **Component detection** using function naming conventions (PascalCase) and JSX return analysis.
5. **React component identification** through return statement analysis to detect JSX elements.

When a React component is exported inline, the rule reports an error and provides an automatic fix that separates the declaration from the export statement.

---

## Options (all configurations)

This rule has no configurable options.

```ts
type Options = [Partial<{}>];
```

### Default options

```json
{}
```

---

## Examples (by option)

### Default behavior

Incorrect:

```tsx
export default function MyComponent() {
  return <div>Hello World</div>;
}

export const AnotherComponent = () => {
  return <span>Another component</span>;
};

export function ThirdComponent() {
  return <p>Third component</p>;
}
```

Correct (after auto-fix):

```tsx
function MyComponent() {
  return <div>Hello World</div>;
}

export { MyComponent };

const AnotherComponent = () => {
  return <span>Another component</span>;
};

export { AnotherComponent };

function ThirdComponent() {
  return <p>Third component</p>;
}

export { ThirdComponent };
```

### Default exports

Incorrect:

```tsx
export default function UserProfile({ user }) {
  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

export default function HomePage() {
  const [data, setData] = useState(null);

  return (
    <main>
      <h1>Welcome</h1>
    </main>
  );
}
```

Correct (after auto-fix):

```tsx
function UserProfile({ user }) {
  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

export { UserProfile };

function HomePage() {
  const [data, setData] = useState(null);

  return (
    <main>
      <h1>Welcome</h1>
    </main>
  );
}

export { HomePage };
```

### Named exports

Incorrect:

```tsx
export const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

export const Modal = function ({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

Correct (after auto-fix):

```tsx
const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

export { Button };

const Modal = function ({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export { Modal };
```

### Function declarations

Incorrect:

```tsx
export function Card({ title, content }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{content}</div>
    </div>
  );
}

export function Layout({ children }) {
  return (
    <div className="layout">
      <header>My App</header>
      <main>{children}</main>
      <footer>© 2024</footer>
    </div>
  );
}
```

Correct (after auto-fix):

```tsx
function Card({ title, content }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{content}</div>
    </div>
  );
}

export { Card };

function Layout({ children }) {
  return (
    <div className="layout">
      <header>My App</header>
      <main>{children}</main>
      <footer>© 2024</footer>
    </div>
  );
}

export { Layout };
```

### Arrow function variables

Incorrect:

```tsx
export const LoadingSpinner = () => {
  return (
    <div className="spinner">
      <div className="spinner-inner"></div>
    </div>
  );
};

export const ErrorMessage = ({ error }) => (
  <div className="error">
    <h3>Something went wrong</h3>
    <p>{error.message}</p>
  </div>
);
```

Correct (after auto-fix):

```tsx
const LoadingSpinner = () => {
  return (
    <div className="spinner">
      <div className="spinner-inner"></div>
    </div>
  );
};

export { LoadingSpinner };

const ErrorMessage = ({ error }) => (
  <div className="error">
    <h3>Something went wrong</h3>
    <p>{error.message}</p>
  </div>
);

export { ErrorMessage };
```

### Function expressions

Incorrect:

```tsx
export const Header = function HeaderComponent({ title }) {
  return (
    <header>
      <h1>{title}</h1>
      <nav>Navigation</nav>
    </header>
  );
};

export const Footer = function () {
  return (
    <footer>
      <p>&copy; 2024 My Company</p>
    </footer>
  );
};
```

Correct (after auto-fix):

```tsx
const Header = function HeaderComponent({ title }) {
  return (
    <header>
      <h1>{title}</h1>
      <nav>Navigation</nav>
    </header>
  );
};

export { Header };

const Footer = function () {
  return (
    <footer>
      <p>&copy; 2024 My Company</p>
    </footer>
  );
};

export { Footer };
```

---

## Messages

When triggered, this rule emits the following message:

- `SEPARATE_COMPONENT_EXPORT`  
  Message: `NIMA: Declare React component '{{ fnName }}' separately from its export statement`

**Example reported text:**

```text
NIMA: Declare React component 'MyComponent' separately from its export statement
```

---

## Implementation notes & requirements

- **React component detection:** Uses `isComponentFunction()` utility to identify components by naming convention (PascalCase).
- **JSX return analysis:** Uses `isReactReturn()` utility to detect if a function returns JSX elements.
- **Function name resolution:** Uses `getFunctionName()` utility to extract function names from various function types.
- **Auto-fix capability:** Automatically separates declarations from exports and converts to named export syntax.
- **AST node handling:** Handles multiple export patterns including default exports, named exports, and variable declarations.
- **Text replacement:** Preserves original formatting while restructuring export patterns.

---

## Limitations & edge cases

- **Component detection:** Relies on naming conventions (PascalCase) and JSX return detection, may miss components that don't follow these patterns.
- **Complex JSX:** Very complex return statements or conditional returns may not be properly detected as React components.
- **Default exports:** Converts default exports to named exports, which changes the import syntax for consumers.
- **Non-component functions:** Functions that return JSX but aren't components (utilities, etc.) may be incorrectly flagged if they follow component naming.
- **Dynamic returns:** Components with complex conditional rendering may not be detected properly.
- **HOCs and wrapped components:** Higher-order components and wrapped functions may not be detected correctly.
- **TypeScript generics:** Generic React components may not be handled perfectly in all edge cases.

---

## Quick configuration snippets

### Flat ESLint config (eslint.config.js)

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    plugins: { nima: pluginNIMA },
    rules: {
      "nima/prefer-export-under-component": "error",
    },
  },
];
```

### Legacy .eslintrc.json

```json
{
  "plugins": ["nima"],
  "rules": {
    "nima/prefer-export-under-component": "error"
  }
}
```

---

## Version

Introduced in `eslint-plugin-nima@1.0.0`.

---

## Further Reading

- [React Component Exports](https://react.dev/learn/importing-and-exporting-components)
- [JavaScript Export Declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
