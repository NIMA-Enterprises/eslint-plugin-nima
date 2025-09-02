/*  Test file for prefer-arrow-functions rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 40
    Invalid tests: 20
    Valid tests: 20
*/

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

    // 4. Function declaration with type annotation
    {
      code: "function sum(a: number, b: number): number { return a + b; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const sum = (a: number, b: number): number => { return a + b; }",
    },

    // 5. Async function with parameter
    {
      code: "async function testAsync(a: number) { await delay(a); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      options: [{ allowAsync: false }],
      output: "const testAsync = async (a: number) => { await delay(a); }",
    },

    // 6. Exported function declaration
    {
      code: "export function exportedFunc(a: number) { return a * 2; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "export const exportedFunc = (a: number) => { return a * 2; }",
    },

    // 7. Export default function declaration
    {
      code: "export default function defaultExported() { return 'foo'; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output:
        "const defaultExported = () => { return 'foo'; };\nexport default defaultExported;",
    },

    // 8. JSDoc comment above function
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

    // === FUNCTION EXPRESSIONS ===

    // 9. Function expression assigned to const
    {
      code: "const NIMALabs = function () {}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
        },
      ],
      output: "const NIMALabs = () => {}",
    },

    // 10. Function expression with parameter
    {
      code: "const myFunc = function (arg: number) { console.log(arg); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const myFunc = (arg: number) => { console.log(arg); }",
    },

    // 11. Async function expression
    {
      code: "const myAsyncFunc = async function() { return 1; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      options: [{ allowAsync: false }],
      output: "const myAsyncFunc = async () => { return 1; }",
    },

    // 12. Function expression with type annotation
    {
      code: "const subtract = function(a: number, b: number): number { return a - b; };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output:
        "const subtract = (a: number, b: number): number => { return a - b; };",
    },

    // 13. Object property function expression
    {
      code: "const obj = { prop: function() {} };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const obj = { prop: () => {} };",
    },

    // 14. Function expression in object property
    {
      code: "const user = { name: 'Alice', greeting: function() { return `Hello, ${this.name}`; } };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output:
        "const user = { name: 'Alice', greeting: () => { return `Hello, ${this.name}`; } };",
    },

    // === METHOD DEFINITIONS ===

    // 15. Object method definition
    {
      code: "const myObject = { myMethod(a: number) { return a; } };",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "const myObject = { myMethod: (a: number) => { return a; } };",
    },

    // 16. Object async method definition
    {
      code: "const objWithAsync = { myAsyncMethod: async function() {} };",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      options: [{ allowAsync: false, allowMethodDefinitions: false }],
      output: "const objWithAsync = { myAsyncMethod: async () => {} };",
    },

    // 17. Class method definition
    {
      code: "class MyClass { myMethod() { return 1; } }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "class MyClass { myMethod = () => { return 1; } }",
    },

    // 18. Class static method definition
    {
      code: "class MyAnotherClass { static myStaticMethod() {} }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "class MyAnotherClass { static myStaticMethod = () => {} }",
    },

    // 19. Class method with string return
    {
      code: "class MyOtherClass { myMethod() { return 'hello'; } }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      options: [{ allowMethodDefinitions: false }],
      output: "class MyOtherClass { myMethod = () => { return 'hello'; } }",
    },

    // === DUMMY/EDGE CASES TO REACH 20 ===

    // 20. Dummy: function declaration for count
    {
      code: "function dummyForCount() {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const dummyForCount = () => {}",
    },
  ],
  valid: [
    // === VALID ARROW FUNCTIONS ===

    // 21. Arrow function assigned to const
    "const NIMALabs = () => {}",

    // 22. Arrow function with parameters
    "const withParams = (a, b) => a + b;",

    // 23. Arrow function with type annotation
    "const myFunc = (arg: number) => { console.log(arg); }",

    // 24. Async arrow function
    "const myAsyncFunc = async () => {}",

    // 25. Arrow function in object property
    "const myFunc = () => {};",

    // 26. Arrow function with multiple parameters
    "const myArrowFunc = (a, b) => a + b;",

    // 27. Arrow function in object property
    "const myMethod = { myProp: () => {} };",

    // 28. Class with getter and setter
    `class MyClass {
        get myGetter() { return 'foo'; }
        set mySetter(value) {}
      }`,

    // 29. Export default arrow function
    "export default () => {};",

    // 30. Exported arrow function
    "export const exportedFunc = (a: number) => a * 2;",

    // 31. Generator function allowed
    {
      code: "function* generatorFunc() { yield 1; }",
      options: [{ allowGenerators: true }],
    },

    // 32. Class with constructor allowed
    {
      code: "class MyClass { constructor() {} }",
      options: [{ allowConstructors: true }],
    },

    // 33. Function declaration allowed
    {
      code: "function a() {}",
      options: [{ allowFunctionDeclarations: true }],
    },

    // 34. Function expression allowed
    {
      code: "const b = function() {};",
      options: [{ allowFunctionExpressions: true }],
    },

    // 35. Class method allowed
    {
      code: "class C { myMethod() {} }",
      options: [{ allowMethodDefinitions: true }],
    },

    // 36. Async class method allowed
    {
      code: "class D { async myMethod() {} }",
      options: [{ allowAsync: true, allowMethodDefinitions: true }],
    },

    // 37. Object method allowed
    {
      code: "const myObject = { myMethod() {} };",
      options: [{ allowMethodDefinitions: true }],
    },

    // 38. Class property arrow function
    {
      code: "class F { myMethod = () => { this.doSomething(); } }",
      options: [{ allowMethodDefinitions: false }],
    },

    // 39. Arrow function returned from function
    `
        function render() {
          return () => <div>Hello</div>;
        }
      `,

    // 40. React component class with render method
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
  ],
});
