import { Messages } from "@models/prefer-arrow-functions.model";
import * as PreferArrowFunctions from "@rules/prefer-arrow-functions";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-arrow-functions", PreferArrowFunctions.rule, {
  invalid: [
    // Existing tests from the original file
    {
      code: "function NIMALabs() {}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_FUNCTIONS,
        },
      ],
      output: "const NIMALabs = () => {}",
    },
    {
      code: "const NIMALabs = function () {}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION,
        },
      ],
      output: "const NIMALabs = () => {}",
    },
    {
      code: "const NIMA = {\nNIMALabs() {}}",
      errors: [
        {
          messageId: Messages.PREFER_ARROW_METHOD,
        },
      ],
      output: "const NIMA = {\nNIMALabs: () => {}}",
    },
    // New test cases for a more comprehensive check
    {
      code: "function withParams(a, b) { return a + b; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const withParams = (a, b) => { return a + b; }",
    },
    {
      code: "async function asyncFunc() { await Promise.resolve(); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      options: [{ allowAsync: false }],
      output: "const asyncFunc = async () => { await Promise.resolve(); }",
    },
    {
      code: "const myFunc = function (arg: number) { console.log(arg); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const myFunc = (arg: number) => { console.log(arg); }",
    },
    {
      code: "const myAsyncFunc = async function() { return 1; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      options: [{ allowAsync: false }],
      output: "const myAsyncFunc = async () => { return 1; }",
    },
    {
      code: "const user = { name: 'Alice', greeting: function() { return `Hello, ${this.name}`; } };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output:
        "const user = { name: 'Alice', greeting: () => { return `Hello, ${this.name}`; } };",
    },
    {
      code: "class MyClass { myMethod() { return 1; } }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "class MyClass { myMethod = () => { return 1; } }",
    },
    {
      code: "export function exportedFunc(a: number) { return a * 2; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "export const exportedFunc = (a: number) => { return a * 2; }",
    },
    {
      code: "export default function defaultExported() { return 'foo'; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output:
        "const defaultExported = () => { return 'foo'; };\nexport default defaultExported;",
    },
    {
      code: "const obj = { prop: function() {} };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const obj = { prop: () => {} };",
    },
    // Further test cases
    {
      code: "function sum(a: number, b: number): number { return a + b; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const sum = (a: number, b: number): number => { return a + b; }",
    },
    {
      code: "async function testAsync(a: number) { await delay(a); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      options: [{ allowAsync: false }],
      output: "const testAsync = async (a: number) => { await delay(a); }",
    },
    {
      code: "const add = (a: number, b: number) => { return a + b; };",
      errors: [],
      output: "const add = (a: number, b: number) => { return a + b; };",
    },
    {
      code: "const subtract = function(a: number, b: number): number { return a - b; };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output:
        "const subtract = (a: number, b: number): number => { return a - b; };",
    },
    {
      code: "class MyAnotherClass { static myStaticMethod() {} }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "class MyAnotherClass { static myStaticMethod = () => {} }",
    },
    {
      code: "const myObject = { myMethod(a: number) { return a; } };",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "const myObject = { myMethod: (a: number) => { return a; } };",
    },
    {
      code: "const objWithAsync = { myAsyncMethod: async function() {} };",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      options: [{ allowAsync: false, allowMethodDefinitions: false }],
      output: "const objWithAsync = { myAsyncMethod: async () => {} };",
    },
    {
      code: "class MyOtherClass { myMethod() { return 'hello'; } }",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      options: [{ allowMethodDefinitions: false }],
      output: "class MyOtherClass { myMethod = () => { return 'hello'; } }",
    },
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
    {
      code: "function funcWithDefaultParams(a = 1) {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcWithDefaultParams = (a = 1) => {}",
    },
    {
      code: "function funcWithRestParams(a, ...rest) {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcWithRestParams = (a, ...rest) => {}",
    },
    {
      code: "function funcWithGeneric<T>(a: T) {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcWithGeneric = <T>(a: T) => {}",
    },
    {
      code: "function funcReturningObject() { return { a: 1 }; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const funcReturningObject = () => { return { a: 1 }; }",
    },
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
  ],
  valid: [
    "const NIMALabs = () => {}",
    "const withParams = (a, b) => a + b;",
    "const myFunc = (arg: number) => { console.log(arg); }",
    "const myAsyncFunc = async () => {}",
    {
      code: "function* generatorFunc() { yield 1; }",
      options: [{ allowGenerators: true }],
    },
    {
      code: "class MyClass { constructor() {} }",
      options: [{ allowConstructors: true }],
    },
    {
      code: "export const exportedFunc = (a: number) => a * 2;",
    },
    // Additional valid cases
    {
      code: "const myFunc = () => {};",
    },
    {
      code: "const myArrowFunc = (a, b) => a + b;",
    },
    {
      code: "const myMethod = { myProp: () => {} };",
    },
    {
      code: `class MyClass {
        get myGetter() { return 'foo'; }
        set mySetter(value) {}
      }`,
    },
    {
      code: "export default () => {};",
    },
    {
      code: "function a() {}",
      options: [{ allowFunctionDeclarations: true }],
    },
    {
      code: "const b = function() {};",
      options: [{ allowFunctionExpressions: true }],
    },
    {
      code: "class C { myMethod() {} }",
      options: [{ allowMethodDefinitions: true }],
    },
    {
      code: "class D { async myMethod() {} }",
      options: [{ allowAsync: true, allowMethodDefinitions: true }],
    },
    {
      code: "const myObject = { myMethod() {} };",
      options: [{ allowMethodDefinitions: true }],
    },
    {
      code: "class F { myMethod = () => { this.doSomething(); } }",
      options: [{ allowMethodDefinitions: false }],
    },
    {
      code: `
        function render() {
          return () => <div>Hello</div>;
        }
      `,
    },
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
