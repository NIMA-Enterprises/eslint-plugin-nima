# Rule Overview

This is where the magic happens, this plugin covers a wide range of rules, there's no clear philosophy, they just fix and enforce conventions to speed up code review and make the codebase better.

Each rule will eventually have three levels of explanation:

- **Short explanation** (this page): Quick one-liner.
- **Medium explanation**: (also this page, just a little further down) A few sentences with a code example.
- **Full explanation**: It's own dedicated page with all the details.

---

## Short Explanation

### Conventions

- **boolean-naming-convention**  
  _Short:_ Enforces prefixes like `is`, `has`, `will` to boolean values

- **params-naming-convention**  
  _Short:_ Improves your function readability by enforcing objects as parameters

### Restrictions

- **restrict-console-methods**  
  _Short:_ Disallows you from using any `console` methods.

- **restrict-function-usage**  
  _Short:_ Let's you pick and choose which functions can be used in whatever file or folder you choose.

- **no-objects-in-deps**  
  _Short:_ Prevents you from putting objects in the dependency arrays.

- **no-handler-suffix**  
  _Short:_ Disallows you from giving your functions the `handler` suffix.

### Preferences

- **prefer-arrow-functions**  
  _Short:_ Enforces the usage of the arrow functions instead of any other function.

- **prefer-export-under-components**  
  _Short:_ Enforces the export of Components to happen under their declaration.

- **prefer-react-fc**  
  _Short:_ Enforces typing components as `React.FC` for consistency and props typing

- **prefer-react-with-hooks**  
  _Short:_ Enforces `React.useState` instead of unscoped `useState`

---

## Medium Explanation

### Conventions

##### # boolean-naming-convention

This rule forces all of your booleans to start with appropriate prefixes, the point is to make your booleans easily readable and make the operations with them smoother and easily understandable.

**Configuration options (5):**

- **allowedPrefixes** - default: `is`, `has`, `will`...  
   _Short_: Overrides the default allowed prefixes
- **checkFunctions** - default: true.  
   _Short_: Enables/Disables checking of function names
- **checkParameters** - default: true.  
   _Short_: Enables/Disables checking of parameter names
- **checkProperties** - default: true.  
   _Short_: Enables/Disables checking of property names
- **checkVariables** - default: true.  
   _Short_: Enables/Disables checking of variable names

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/boolean-naming-convention)

Here's how the rule works by default, with no configuration:

Functions that return booleans:

```js
const NIMALabs = () => true; // NIMA: Function 'NIMALabs' returns a boolean, use a prefix like isNIMALabs
```

Variables with a boolean type:

```js
const NIMAEnterprises = true; // NIMA: Boolean variable 'NIMAEnterprises' should use a prefix like isNIMAEnterprises
```

Properties of objects with boolean types:

```js
const NIMA = {
  Labs: true, // NIMA: Boolean property 'Labs' should use a prefix like isLabs
  Enterprises: false, // NIMA: Boolean property 'Enterprises' should use a prefix like isEnterprises
};
```

Parameters with boolean types:

```js
const iRanOutOfNames = (NIMA: boolean) => {}; // NIMA: Boolean parameter 'NIMA' should use a prefix like isNIMA
```

#### # ✅ params-naming-convention

This rule forces you to use objects as parameters in order to improve function readability and maintainability.

**Configuration options (4):**

- **allowedParameters** - default: 1  
   _Short_: Defines how many parameters are allowed before enforcing this rule
- **ignore** - default: `e`.  
   _Short_: Disables this rule for parameters defined in here
- **ignoreFunctions** - default: `reduce`.  
   _Short_: Disables this rule for functions defined in here
- **ignorePrefixes** - default: `$`.  
   _Short_: Disables this rule for parameters that start with the prefixes defined in here

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/params-naming-convention)

Here's how the rule works by default, with no configuration:

Functions with more parameters than the configuration allows (2):

```js
const NIMALabs = (NIMA: number, Labs: number) => {}; // NIMA: Function has 2 parameter(s). Either prefix them: $NIMA, $Labs, or put all parameters in one object.
```

Turning one of the parameters into an object:

```js
const NIMAEnterprises = (NIMA: number, { Labs }: { Labs: number }) => {}; // NIMA: Function has 1 parameter(s). Either prefix them: $NIMA, or put all parameters in one object.
```

### Restrictions

#### # ✅ restrict-console-methods

This rule forces you to find another way of handling errors or displaying data other than relying on `console`methods.

**Configuration options (4):**

- **allowConsoleLog** - default: false  
   _Short_: Enables/Disables the use of `console.log`
- **allowConsoleError** - default: false.  
   _Short_: Enables/Disables the use of `console.error`
- **allowConsoleWarn** - default: false.  
   _Short_: Enables/Disables the use of `console.warn`

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/restrict-console-methods)

Here's how the rule works by default, with no configuration:

Trying to use `console.log`:

```js
console.log("NIMA Labs"); // NIMA: The usage of console.log is restricted.
```

Trying to use `console.error`:

```js
console.error("NIMA Enterprises"); // NIMA: The usage of console.error is restricted.
```

Trying to use `console.warn`:

```js
console.warn("NIMA"); // NIMA: The usage of console.warn is restricted.
```

#### # restrict-function-usage

This rule allows you to restrict the usage of any function in any file or folders you chose.

**Configuration options (an array of 4 per entry):**

- **allowFunctions**  
   _Short_: The functions that are allowed only in specified files or folders
- **disableFunctions**  
   _Short_: The functions that are disabled only in specified files or folders
- **files**.  
   _Short_: The files used to configure the other 2 options
- **folders**  
   _Short_: The folders used to configure the other 2 options

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/restrict-function-usage)

By default, this rule doesn't do anything, I strongly recommend reading about this rule in depth since it's really powerful.

#### # no-objects-in-deps

This rule forces you to only use stable variables in dependencies, made to prevent unpredictable side effects that may be caused be putting objects in dependency arrays.

**Configuration options (0):**

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/no-objects-in-deps)

Here's how the rule works by default, with no configuration:

Placing an object inside the dependency array:

```js
React.useEffect(() => {}, [{ NIMA: "Labs" }]); // NIMA: Objects inside of dependency arrays aren't allowed. Try doing JSON.stringify({ NIMA: "Labs" }).
```

#### # ✅ no-handler-suffix

This rule forces you to follow common conventions of defining your handlers with the `handle` prefix, this helps improve readability and consistency.

**Configuration options (0):**

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/no-handler-suffix)

Here's how the rule works by default, with no configuration:

Placing an object inside the dependency array:

```js
const clickHandler = () => {}; // NIMA: You shouldn't use the handler suffix, use the handle prefix instead (handleClick)
```

### Preferences

#### # prefer-arrow-functions

This rule forces you to write arrow functions to make sure your code follows modern conventions, it also transforms any function declarations or expressions to arrow functions on it's own.

**Configuration options (6):**

- **allowAsync** - default: true.  
   _Short_: Enables/Disables this rule for async functions
- **allowConstructors** - default: true.  
   _Short_: Enables/Disables this rule for constructors
- **allowFunctionDeclarations** - default: false.  
   _Short_: Enables/Disables this rule for function declarations
- **allowFunctionExpressions** - default: false.  
   _Short_: Enables/Disables this rule for function expressions
- **allowGenerators**. - default: true.  
   _Short_: Enables/Disables this rule for generators
- **allowMethodDefinitions** - default: false.  
   _Short_: Enables/Disables this rule for method definitions

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/no-handler-suffix)

Here's how the rule works by default, with no configuration:

Defining a function declaration:

```js
function NIMALabs() {} // NIMA: Prefer arrow functions over function declarations.
```

Defining a function expression:

```js
const NIMAEnterprises = function NIMA() {}; // NIMA: Prefer arrow functions over function expressions.
```

Defining a method definition:

```js
const NIMA = {
  Labs() {}, // NIMA: Prefer arrow functions over method definitions.
};
```

#### # prefer-export-under-components

This rule forces you to export Components under their definition, disallows `export default`and `export const`.

**Configuration options (0):**

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/prefer-export-under-components)

Here's how the rule works by default, with no configuration:

Exporting a Component inline:

```js
export const NIMA = () => <></>; // NIMA: Declare React component 'NIMA' separately from its export statement
```

Export-defaulting a Component inline:

```js
export default function NIMALabs() {
  return <></>;
} // NIMA: Declare React component 'NIMALabs' separately from its export statement
```

#### # ✅ prefer-react-fc

This rule forces you to add a type the Component you're defining as `React.FC`, **unless the Component is typed as something else like `Node.Component` etc.**

**Configuration options (0):**

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/prefer-react-fc)

Here's how the rule works by default, with no configuration:

Defining a Component without the typing it as `React.FC`

```js
const NIMALabs = () => <></>; // NIMA: Component functions must use React.FC type annotation.
```

#### # prefer-react-with-hooks

This rule forces you to include `React.`in your hooks, so instead of writing `useState`, now you have to write `React.useState`.

**Configuration options (0):**

To read more about each option and how to use it, check out this rules dedicated [Documentation page](documentaton/rules/prefer-react-with-hooks)

Here's how the rule works by default, with no configuration:

Using a hook without the `React.` prefix:

```js
import { useState } from "react"; // NIMA: Use React.useState instead of importing useState directly.
const [NIMA, setNIMA] = useState(); // NIMA: Prefix useState with React.
```

## Full Explanation

All the rules have their own dedicated page where I go in detail on how to configure, monitor and use the rules. I also share some of my recommendations on what the configurations should look like, since they are my subjective recommendations I didn't make them default.

### Rule Documentation Pages

- [boolean-naming-convention](documentation/rules/boolean-naming-convention.md)
- [params-naming-convention](documentation/rules/params-naming-convention.md)
- [restrict-console-methods](documentation/rules/restrict-console-methods.md)
- [restrict-function-usage](documentation/rules/restrict-function-usage.md)
- [no-objects-in-deps](documentation/rules/no-objects-in-deps.md)
- [no-handler-suffix](documentation/rules/no-handler-suffix.md)
- [prefer-export-under-component](documentation/rules/prefer-export-under-component.md)
- [prefer-arrow-functions](documentation/rules/prefer-arrow-functions.md)
- [prefer-react-fc](documentation/rules/prefer-react-fc.md)
- [prefer-react-with-hooks](documentation/rules/prefer-react-with-hooks.md)
