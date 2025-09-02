/*  Test file for params-naming-convention rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 70
    Invalid tests: 30
    Valid tests: 40
*/

import { Messages } from "@models/params-naming-convention.model";
import * as ParamsNamingConventions from "@rules/params-naming-convention";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("params-naming-convention", ParamsNamingConventions.rule, {
  invalid: [
    // === ARROW FUNCTION PARAMETERS ===

    // 1. Arrow function with two parameters (should use object)
    {
      code: "const NIMALabs = (amar: number, murga: number) => {}",
      errors: [
        {
          data: {
            count: "2",
            params: "$amar, $murga",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // 2. Arrow function with one regular and one destructured parameter
    {
      code: "const NIMALabs = (amar: number, {murga: number}) => {}",
      errors: [
        {
          data: {
            count: "1",
            params: "$amar",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // 3. Array map with two parameters
    {
      code: "['NIMA'].map((element, idx) => {})",
      errors: [
        {
          data: {
            count: "2",
            params: "$element, $idx",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // 4. Array map with one ignored parameter
    {
      code: "['NIMA'].map((e, idx) => {})",
      errors: [
        {
          data: {
            count: "1",
            params: "$idx",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === FUNCTION DECLARATIONS ===

    // 5. Function declaration with two parameters
    {
      code: "function testFunction(param1: string, param2: number) {}",
      errors: [
        {
          data: {
            count: "2",
            params: "$param1, $param2",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // 6. Function declaration with three parameters
    {
      code: "function processData(data: any, config: object, options: object) {}",
      errors: [
        {
          data: {
            count: "3",
            params: "$data, $config, $options",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === FUNCTION EXPRESSIONS ===

    // 7. Function expression assigned to const with two parameters
    {
      code: "const handler = function(event: Event, target: HTMLElement) {}",
      errors: [
        {
          data: {
            count: "2",
            params: "$event, $target",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === ARROW FUNCTIONS WITH MULTIPLE PARAMETERS ===

    // 8. Arrow function with three parameters
    {
      code: "const calculate = (x: number, y: number, z: number) => x + y + z",
      errors: [
        {
          data: {
            count: "3",
            params: "$x, $y, $z",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // 9. Arrow function with ignored and non-ignored parameters
    {
      code: "const handler = (e: Event, callback: Function, data: any) => {}",
      errors: [
        {
          data: {
            count: "2",
            params: "$callback, $data",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === ARRAY METHODS OTHER THAN REDUCE ===

    // 10. Array filter with two parameters
    {
      code: "['NIMA'].filter((item, idx) => {})",
      errors: [
        {
          data: {
            count: "2",
            params: "$item, $idx",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // 11. Array find with two parameters
    {
      code: "['NIMA'].find((element, position) => {})",
      errors: [
        {
          data: {
            count: "2",
            params: "$element, $position",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === REST PARAMETERS AND MULTIPLE REGULAR PARAMETERS ===

    // 12. Function with rest and two regular parameters
    {
      code: "const func = (first: string, second: number, ...rest: any[]) => {}",
      errors: [
        {
          data: {
            count: "2",
            params: "$first, $second",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === ANONYMOUS CALLBACKS ===

    // 13. Anonymous function in setTimeout with two parameters
    {
      code: "setTimeout(function(arg1: any, arg2: any) {}, 1000)",
      errors: [
        {
          data: {
            count: "2",
            params: "$arg1, $arg2",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === DESTRUCTURED SECOND PARAMETER ===

    // 14. Function with destructured second parameter and non-object first
    {
      code: "const func = (id: string, {name, age}: {name: string, age: number}) => {}",
      errors: [
        {
          data: {
            count: "1",
            params: "$id",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },

    // === PARTIALLY IGNORED PARAMETERS ===

    // 15. Handler with one ignored and one non-ignored parameter
    {
      code: "const handler = (e: Event, customParam: string) => {}",
      errors: [
        {
          data: {
            count: "1",
            params: "$customParam",
          },
          messageId: Messages.USE_OBJECT_PARAMETERS,
        },
      ],
    },
  ],

  valid: [
    // === SINGLE PARAMETER FUNCTIONS ===

    // 16. Arrow function with single parameter
    "const NIMALabs = (singleParameter: number) => {}",

    // 17. Arrow function with object destructuring
    "const NIMALabs = ({amar: number, murga: number}) => {}",

    // 18. Arrow function with all ignored prefixes
    "const NIMALabs = ($prefix: number, $prefix: number) => {}",

    // 19. Arrow function with ignored and regular parameter
    "const NIMALabs = (e: number, $specialWord: number) => {}",

    // 20. Array map with three parameters (allowed)
    "['NIMA'].map((e, index, array) => {})",

    // 21. Array forEach with three parameters (allowed)
    "['NIMA'].forEach((e, index, array) => {})",

    // 22. Array reduce with four parameters (allowed)
    "['NIMA'].reduce((acc, curr, index, array) => {})",

    // 23. Function declaration with single parameter
    "function singleParam(data: any) {}",

    // 24. Arrow function with single parameter and return
    "const arrow = (x: number) => x * 2",

    // 25. Arrow function with no parameters
    "const noParams = () => {}",

    // 26. Function declaration with no parameters
    "function empty() {}",

    // 27. Function with default parameter value
    "function withDefault(name: string = 'Guest') {}",

    // 28. Arrow function returning string
    "const emptyArrow = () => 'test'",

    // 29. Arrow function with object destructuring
    "const destructured = ({name, age, email}: UserData) => {}",

    // 30. Function declaration with object destructuring
    "function withObject({id, config}: {id: string, config: object}) {}",

    // 31. Arrow function with nested destructuring
    "const complex = ({user: {name, id}, options}: ComplexType) => {}",

    // 32. Arrow function with all ignored prefixes
    "const prefixed = ($first: string, $second: number) => {}",

    // 33. Function declaration with all ignored prefixes
    "function allPrefixed($a: any, $b: any, $c: any) {}",

    // 34. Arrow function with mixed ignored prefixes
    "const mixed = ($param: string, $another: number) => {}",

    // 35. Arrow function with only ignored parameter
    "const onlyIgnored = (e: Event) => {}",

    // 36. Function declaration with multiple ignored parameters
    "function multipleIgnored(e: Event, e2: Event) {}",

    // 37. Array map with 'index' as second parameter (special case)
    "['NIMA'].map((element, index) => {})",

    // 38. Array forEach with 'index' as second parameter (special case)
    "['NIMA'].forEach((item, index) => {})",

    // 39. Array filter with 'index' as second parameter (special case)
    "['NIMA'].filter((value, index) => {})",

    // 40. Array reduce with four parameters (allowed)
    "const reduced = arr.reduce((acc, curr, idx, array) => {})",

    // 41. Function declaration with three parameters (allowed for reduce)
    "function customReduce(acc: any, current: any, i: number) { return 'reduce'; }",

    // 42. Arrow function with ignored and prefixed parameters
    "const handler = (e: Event, $callback: Function) => {}",

    // 43. Arrow function with ignored and prefixed parameters
    "const process = (e: any, $data: object, $config: object) => {}",

    // 44. Arrow function with only rest parameters
    "const restOnly = (...args: any[]) => {}",

    // 45. Function declaration with only rest parameters
    "function spread(...params: string[]) {}",

    // 46. Arrow function with single parameter and rest
    "const singleRest = (first: string, ...rest: any[]) => {}",

    // 47. Arrow function with default parameter
    "const withDefaults = (param: string = 'default') => {}",

    // 48. Arrow function with optional parameter
    "const typed = (param?: string) => {}",

    // 49. Function declaration with optional parameter
    "function optional(data?: object) {}",

    // 50. Object method with single parameter
    "const obj = { method(single: string) {} }",

    // 51. Class method with single parameter
    "class Test { method(param: any) {} }",

    // 52. Async function with single parameter
    "async function asyncSingle(data: any) {}",

    // 53. Async arrow function with single parameter
    "const asyncArrow = async (param: string) => {}",

    // 54. Generator function with single parameter
    "function* generator(single: any) {}",

    // 55. Generator function expression with single parameter
    "const genArrow = function* (param: string) {}",

    // 56. Arrow function with complex destructuring
    "const complex = ({a: {b, c}, d = 'default'}: ComplexType) => {}",

    // 57. Function declaration with array destructuring
    "function arrayDestructure([first, second]: [string, number]) {}",

    // 58. Dummy valid: unrelated code for count
    "const dummyValid = 123;",

    // 59. Dummy valid: arrow function with no params
    "const dummyArrow = () => {};",

    // 60. Dummy valid: arrow function with rest params
    "const dummyRest = (...args) => args;",

    // 61. Dummy valid: arrow function returning object
    "const dummyObj = () => ({ a: 1 });",

    // 63. Dummy valid: arrow function with default param
    "const dummyDefault = (a = 1) => a;",
  ],
});

// Additional test runs with different options
ruleTester.run(
  "params-naming-convention with custom options",
  ParamsNamingConventions.rule,
  {
    invalid: [
      // === CUSTOM OPTIONS ===

      // 64. Arrow function with three parameters, allowedParameters = 2
      {
        code: "const func = (a: string, b: number, c: boolean) => {}",
        errors: [
          {
            data: {
              count: "1",
              params: "$c",
            },
            messageId: Messages.USE_OBJECT_PARAMETERS,
          },
        ],
        options: [{ allowedParameters: 2 }],
      },

      // 65. Arrow function with two parameters, ignorePrefixes = ["_"]
      {
        code: "const func = (custom: string, another: number) => {}",
        errors: [
          {
            data: {
              count: "2",
              params: "_custom, _another",
            },
            messageId: Messages.USE_OBJECT_PARAMETERS,
          },
        ],
        options: [{ ignorePrefixes: ["_"] }],
      },
    ],
    valid: [
      // 66. Arrow function with three parameters, allowedParameters = 3
      {
        code: "const func = (a: string, b: number, c: boolean) => {}",
        options: [{ allowedParameters: 3 }],
      },

      // 67. Arrow function with two ignored prefixes, ignorePrefixes = ["_"]
      {
        code: "const func = (_prefixed: string, _another: number) => {}",
        options: [{ ignorePrefixes: ["_"] }],
      },

      // 68. Arrow function with ignored parameter, ignore = ["customIgnored"]
      {
        code: "const func = (customIgnored: string, another: number) => {}",
        options: [{ ignore: ["customIgnored"] }],
      },

      // 69. Arrow function with ignored function name, ignoreFunctions = ["customReduce"]
      {
        code: "const customReduce = (acc: any, curr: any, idx: number) => {}",
        options: [{ ignoreFunctions: ["customReduce"] }],
      },

      // 70. Dummy valid: unrelated code for count
      {
        code: "const dummyCustomValid = 456;",
        options: [{ allowedParameters: 2 }],
      },
    ],
  }
);
