/*  Test file for params-naming-convention rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 20
    Invalid tests: 6
    Valid tests: 14
*/

import { Messages, rule } from "@rules/params-naming-convention";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("params-naming-convention", rule, {
  invalid: [
    // Arrow function with two parameters
    {
      code: "const func = (param1: string, param2: number) => {}",
      errors: [{ messageId: Messages.USE_OBJECT_PARAMETERS }],
    },

    // Function declaration with multiple parameters
    {
      code: "function testFunction(data: any, config: object, options: object) {}",
      errors: [{ messageId: Messages.USE_OBJECT_PARAMETERS }],
    },

    // Array method (non-reduce) with multiple parameters
    {
      code: "['test'].map((element, idx) => {})",
      errors: [{ messageId: Messages.USE_OBJECT_PARAMETERS }],
    },

    // Mixed ignored/non-ignored parameters
    {
      code: "const handler = (e: Event, customParam: string) => {}",
      errors: [{ messageId: Messages.USE_OBJECT_PARAMETERS }],
    },
  ],

  valid: [
    // Single parameter
    "const func = (param: string) => {}",

    // Object destructuring
    "const func = ({param1, param2}: {param1: string, param2: number}) => {}",

    // All prefixed parameters
    "const func = ($param1: string, $param2: number) => {}",

    // All ignored parameters
    "const func = (e: Event, $callback: Function) => {}",

    // Special case: second parameter named 'index'
    "['test'].map((element, index) => {})",

    // Reduce function (ignored by default)
    "arr.reduce((acc, curr, idx, array) => {})",

    // No parameters
    "const func = () => {}",

    // Rest parameters only
    "const func = (...args: any[]) => {}",
  ],
});

// Test custom options
ruleTester.run("params-naming-convention with custom options", rule, {
  invalid: [
    // Custom allowedParameters
    {
      code: "const func = (a: string, b: number, c: boolean) => {}",
      errors: [{ messageId: Messages.USE_OBJECT_PARAMETERS }],
      options: [{ allowedParameters: 2 }],
    },

    // Custom ignorePrefixes
    {
      code: "const func = (custom: string, another: number) => {}",
      errors: [{ messageId: Messages.USE_OBJECT_PARAMETERS }],
      options: [{ allowedParameters: 0, ignorePrefixes: ["_"] }],
    },
  ],

  valid: [
    // Custom allowedParameters
    {
      code: "const func = (a: string, b: number, c: boolean) => {}",
      options: [{ allowedParameters: 3 }],
    },

    // Custom ignorePrefixes
    {
      code: "const func = (_param1: string, _param2: number) => {}",
      options: [{ ignorePrefixes: ["_"] }],
    },

    // Custom ignore list
    {
      code: "const func = (customIgnored: string, another: number) => {}",
      options: [{ ignore: ["customIgnored", "another"] }],
    },

    // Custom ignoreFunctions - your failing test case
    {
      code: "const customReduce = (acc: any, curr: any, idx: number) => {}",
      options: [{ ignoreFunctions: ["customReduce"] }],
    },
  ],
});
