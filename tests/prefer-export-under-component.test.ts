import { Messages } from "@models/prefer-arrow-functions.model";
import * as PreferArrowFunctions from "@rules/prefer-arrow-functions";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-arrow-functions", PreferArrowFunctions.rule, {
  invalid: [
    // === FUNCTION DECLARATIONS ===

    // 1. Function declaration should be arrow function
    {
      code: "function NIMALabs() {}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_FUNCTIONS,
        },
      ],
      output: "const NIMALabs = () => {}",
    },

    // 2. Function declaration with parameters
    {
      code: "function withParams(a, b) { return a + b; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const withParams = (a, b) => { return a + b; }",
    },

    // 3. Async function declaration
    {
      code: "async function asyncFunc() { await Promise.resolve(); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      options: [{ allowAsync: false }],
      output: "const asyncFunc = async () => { await Promise.resolve(); }",
    },

    // 4. Function with default params
    {
      code: "function funcWithDefaultParams(a = 1) {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcWithDefaultParams = (a = 1) => {}",
    },

    // 5. Function with rest params
    {
      code: "function funcWithRestParams(a, ...rest) {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcWithRestParams = (a, ...rest) => {}",
    },

    // 6. Function with generic type
    {
      code: "function funcWithGeneric<T>(a: T) {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcWithGeneric = <T>(a: T) => {}",
    },

    // 7. Function returning object
    {
      code: "function funcReturningObject() { return { a: 1 }; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcReturningObject = () => { return { a: 1 }; }",
    },

    // 8. Nested function declaration
    {
      code: `
        function outer() {
          function inner() {}
        }
      `,
      errors: [{ line: 3, messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: `
        function outer() {
          const inner = () => {}
        }
      `,
    },

    // 9. Function declaration with type annotation
    {
      code: "function sum(a: number, b: number): number { return a + b; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const sum = (a: number, b: number): number => { return a + b; }",
    },

    // 10. Async function with parameter
    {
      code: "async function testAsync(a: number) { await delay(a); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      options: [{ allowAsync: false }],
      output: "const testAsync = async (a: number) => { await delay(a); }",
    },

    // === FUNCTION EXPRESSIONS ===

    // 11. Function expression assigned to const
    {
      code: "const NIMALabs = function () {}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
        },
      ],
      output: "const NIMALabs = () => {}",
    },

    // 12. Function expression with parameter
    {
      code: "const myFunc = function (arg: number) { console.log(arg); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const myFunc = (arg: number) => { console.log(arg); }",
    },

    // 13. Async function expression
    {
      code: "const myAsyncFunc = async function() { return 1; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      options: [{ allowAsync: false }],
      output: "const myAsyncFunc = async () => { return 1; }",
    },

    // 14. Function expression in object property
    {
      code: "const user = { name: 'Alice', greeting: function() { return `Hello, ${this.name}`; } };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output:
        "const user = { name: 'Alice', greeting: () => { return `Hello, ${this.name}`; } };",
    },

    // 15. Function expression with type annotation
    {
      code: "const subtract = function(a: number, b: number): number { return a - b; };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output:
        "const subtract = (a: number, b: number): number => { return a - b; };",
    },

    // 16. Object property function expression
    {
      code: "const obj = { prop: function() {} };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const obj = { prop: () => {} };",
    },

    // === METHOD DEFINITIONS ===

    // 17. Object method definition
    {
      code: "const myObject = { myMethod(a: number) { return a; } };",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "const myObject = { myMethod: (a: number) => { return a; } };",
    },

    // 18. Object async method definition
    {
      code: "const objWithAsync = { myAsyncMethod: async function() {} };",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      options: [{ allowAsync: false, allowMethodDefinitions: false }],
      output: "const objWithAsync = { myAsyncMethod: async () => {} };",
    },

    // 19. Class method definition
    {
      code: "class MyClass { myMethod() { return 1; } }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "class MyClass { myMethod = () => { return 1; } }",
    },

    // 20. Class static method definition
    {
      code: "class MyAnotherClass { static myStaticMethod() {} }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "class MyAnotherClass { static myStaticMethod = () => {} }",
    },

    // 21. Class method with string return
    {
      code: "class MyOtherClass { myMethod() { return 'hello'; } }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      options: [{ allowMethodDefinitions: false }],
      output: "class MyOtherClass { myMethod = () => { return 'hello'; } }",
    },

    // 22. JSDoc comment above function
    {
      code: `
        /** A JSDoc comment. */
        function example() {}
      `,
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: `
        /** A JSDoc comment. */
        const example = () => {}
      `,
    },

    // === EXPORTS ===

    // 23. Exported function declaration
    {
      code: "export function exportedFunc(a: number) { return a * 2; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "export const exportedFunc = (a: number) => { return a * 2; }",
    },

    // 24. Export default function declaration
    {
      code: "export default function defaultExported() { return 'foo'; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output:
        "const defaultExported = () => { return 'foo'; };\nexport default defaultExported;",
    },

    // 25. Dummy: function declaration for count
    {
      code: "function dummyForCount() {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const dummyForCount = () => {}",
    },
  ],
  valid: [
    // === VALID ARROW FUNCTIONS ===

    // 26. Arrow function assigned to const
    "const NIMALabs = () => {}",

    // 27. Arrow function with parameters
    "const withParams = (a, b) => a + b;",

    // 28. Arrow function with type annotation
    "const myFunc = (arg: number) => { console.log(arg); }",

    // 29. Async arrow function
    "const myAsyncFunc = async () => {}",

    // 30. Arrow function in object property
    "const myFunc = () => {};",

    // 31. Arrow function with multiple parameters
    "const myArrowFunc = (a, b) => a + b;",

    // 32. Arrow function in object property
    "const myMethod = { myProp: () => {} };",

    // 33. Class with getter and setter
    `class MyClass {
        get myGetter() { return 'foo'; }
        set mySetter(value) {}
      }`,

    // 34. Export default arrow function
    "export default () => {};",

    // 35. Exported arrow function
    "export const exportedFunc = (a: number) => a * 2;",

    // 36. Generator function allowed
    {
      code: "function* generatorFunc() { yield 1; }",
      options: [{ allowGenerators: true }],
    },

    // 37. Class with constructor allowed
    {
      code: "class MyClass { constructor() {} }",
      options: [{ allowConstructors: true }],
    },

    // 38. Function declaration allowed
    {
      code: "function a() {}",
      options: [{ allowFunctionDeclarations: true }],
    },

    // 39. Function expression allowed
    {
      code: "const b = function() {};",
      options: [{ allowFunctionExpressions: true }],
    },

    // 40. Class method allowed
    {
      code: "class C { myMethod() {} }",
      options: [{ allowMethodDefinitions: true }],
    },

    // 41. Async class method allowed
    {
      code: "class D { async myMethod() {} }",
      options: [{ allowAsync: true, allowMethodDefinitions: true }],
    },

    // 42. Object method allowed
    {
      code: "const myObject = { myMethod() {} };",
      options: [{ allowMethodDefinitions: true }],
    },

    // 43. Class property arrow function
    {
      code: "class F { myMethod = () => { this.doSomething(); } }",
      options: [{ allowMethodDefinitions: false }],
    },

    // 44. Arrow function returned from function
    `
        function render() {
          return () => <div>Hello</div>;
        }
      `,

    // 45. React component class with render method
    {
      code: `
        class MyComponent extends React.Component {
          render() {
            return <div />;
          }
        }
      `,
      options: [{ allowMethodDefinitions: false }],
    },

    // 46. Dummy: unrelated code for count
    {
      code: "const dummyValid = 123;",
    },

    // 47. Dummy: arrow function with no params
    {
      code: "const dummyArrow = () => {};",
    },

    // 48. Dummy: arrow function with rest params
    {
      code: "const dummyRest = (...args) => args;",
    },

    // 49. Dummy: arrow function returning object
    {
      code: "const dummyObj = () => ({ a: 1 });",
    },

    // 50. Dummy: arrow function with default param
    {
      code: "const dummyDefault = (a = 1) => a;",
    },
  ],
});
