/*  Test file for prefer-arrow-functions rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 18
    Invalid tests: 10
    Valid tests: 8
*/

import { Messages, rule } from "@rules/prefer-arrow-functions";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("prefer-arrow-functions", rule, {
  invalid: [
    // Function declaration
    {
      code: "function NIMALabs() {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const NIMALabs = () => {}",
    },

    // Function declaration with parameters and types
    {
      code: "function sum(a: number, b: number): number { return a + b; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "const sum = (a: number, b: number): number => { return a + b; }",
    },

    // Async function declaration
    {
      code: "async function asyncFunc() { await Promise.resolve(); }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      options: [{ allowAsync: false }],
      output: "const asyncFunc = async () => { await Promise.resolve(); }",
    },

    // Exported function declaration
    {
      code: "export function exportedFunc(a: number) { return a * 2; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output: "export const exportedFunc = (a: number) => { return a * 2; }",
    },

    // Export default function
    {
      code: "export default function defaultExported() { return 'foo'; }",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTIONS }],
      output:
        "const defaultExported = () => { return 'foo'; };\nexport default defaultExported",
    },

    // Function expression
    {
      code: "const myFunc = function () {}",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const myFunc = () => {}",
    },

    // Function expression with parameters
    {
      code: "const subtract = function(a: number, b: number): number { return a - b; };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output:
        "const subtract = (a: number, b: number): number => { return a - b; };",
    },

    // Object property function
    {
      code: "const obj = { prop: function() {} };",
      errors: [{ messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION }],
      output: "const obj = { prop: () => {} };",
    },

    // Object method definition
    {
      code: "const myObject = { myMethod(a: number) { return a; } };",
      errors: [{ messageId: Messages.PREFER_ARROW_METHOD }],
      output: "const myObject = { myMethod: (a: number) => { return a; } };",
    },

    // Class method definition
    {
      code: "class MyClass { myMethod() { return 1; } }",
      errors: [
        { messageId: Messages.PREFER_ARROW_METHOD },
        { messageId: Messages.PREFER_ARROW_FUNCTION_EXPRESSION },
      ],
      output: "class MyClass { myMethod = () => { return 1; } }",
    },
  ],

  valid: [
    // Arrow functions (valid)
    "const NIMALabs = () => {}",
    "const withParams = (a, b) => a + b;",
    "const myAsyncFunc = async () => {}",

    // Functions with allowFunctionDeclarations option
    {
      code: "function allowedFunc() {}",
      options: [{ allowFunctionDeclarations: true }],
    },

    // Generator functions with allowGenerators option
    {
      code: "function* generatorFunc() { yield 1; }",
      options: [{ allowGenerators: true }],
    },

    // Class methods with allowMethodDefinitions option
    {
      code: "class MyClass { myMethod() {} }",
      options: [{ allowMethodDefinitions: true }],
    },

    // Constructor with allowConstructors option
    {
      code: "class MyClass { constructor() {} }",
      options: [{ allowConstructors: true }],
    },

    // Function expression with allowFunctionExpressions option
    {
      code: "const func = function() {};",
      options: [{ allowFunctionExpressions: true }],
    },
  ],
});
