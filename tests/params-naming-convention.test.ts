import { Messages } from "@models/params-naming-convention.model";
import * as ParamsNamingConventions from "@rules/params-naming-convention";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("params-naming-convention", ParamsNamingConventions.rule, {
  invalid: [
    // Original test cases
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

    // Function declarations
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

    // Function expressions
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

    // Arrow functions with more than 2 parameters
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

    // Mixed ignored and non-ignored parameters
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

    // Array methods other than reduce
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

    // Functions with rest parameters and multiple regular parameters
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

    // Anonymous functions in callbacks
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

    // Functions with destructured second parameter but non-object first
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

    // Functions where not all parameters are ignored
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
    // Original valid cases
    "const NIMALabs = (singleParameter: number) => {}",
    "const NIMALabs = ({amar: number, murga: number}) => {}",
    "const NIMALabs = ($prefix: number, $prefix: number) => {}",
    "const NIMALabs = (e: number, $specialWord: number) => {}",
    "['NIMA'].map((e, index, array) => {})",
    "['NIMA'].forEach((e, index, array) => {})",
    "['NIMA'].reduce((acc, curr, index, array) => {})",

    // Single parameter functions
    "const single = (param: string) => {}",
    "function singleParam(data: any) {}",
    "const arrow = (x: number) => x * 2",

    // No parameters
    "const noParams = () => {}",
    "function empty() {}",
    "const emptyArrow = () => 'test'",

    // Object destructuring as single parameter
    "const destructured = ({name, age, email}: UserData) => {}",
    "function withObject({id, config}: {id: string, config: object}) {}",
    "const complex = ({user: {name, id}, options}: ComplexType) => {}",

    // All parameters prefixed with ignore prefix
    "const prefixed = ($first: string, $second: number) => {}",
    "function allPrefixed($a: any, $b: any, $c: any) {}",
    "const mixed = ($param: string, $another: number) => {}",

    // Functions with only ignored parameter names
    "const onlyIgnored = (e: Event) => {}",
    "function multipleIgnored(e: Event, e2: Event) => {}", // If 'e2' is also in ignore list

    // Array method with 'index' as second parameter (special case)
    "['NIMA'].map((element, index) => {})",
    "['NIMA'].forEach((item, index) => {})",
    "['NIMA'].filter((value, index) => {})",

    // Reduce function (ignored function)
    "const reduced = arr.reduce((acc, curr, idx, array) => {})",
    "function customReduce(acc: any, current: any, i: number) { return 'reduce'; }",

    // Mixed ignored and prefixed parameters
    "const handler = (e: Event, $callback: Function) => {}",
    "const process = (e: any, $data: object, $config: object) => {}",

    // Functions with rest parameters only
    "const restOnly = (...args: any[]) => {}",
    "function spread(...params: string[]) {}",

    // Single parameter with rest
    "const singleRest = (first: string, ...rest: any[]) => {}",

    // Default parameters (still counts as parameters)
    "const withDefaults = (param: string = 'default') => {}",

    // Type annotations and optional parameters
    "const typed = (param?: string) => {}",
    "function optional(data?: object) {}",

    // Functions inside objects/classes (method definitions)
    "const obj = { method(single: string) {} }",
    "class Test { method(param: any) {} }",

    // Async functions
    "async function asyncSingle(data: any) {}",
    "const asyncArrow = async (param: string) => {}",

    // Generator functions
    "function* generator(single: any) {}",
    "const genArrow = function* (param: string) {}",

    // Functions with complex destructuring patterns
    "const complex = ({a: {b, c}, d = 'default'}: ComplexType) => {}",
    "function arrayDestructure([first, second]: [string, number]) {}",
  ],

  // Test with custom options
});

// Additional test runs with different options
ruleTester.run(
  "params-naming-convention with custom options",
  ParamsNamingConventions.rule,
  {
    invalid: [
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
      {
        code: "const func = (a: string, b: number, c: boolean) => {}",
        options: [{ allowedParameters: 3 }],
      },
      {
        code: "const func = (_prefixed: string, _another: number) => {}",
        options: [{ ignorePrefixes: ["_"] }],
      },
      {
        code: "const func = (customIgnored: string, another: number) => {}",
        options: [{ ignore: ["customIgnored"] }],
      },
      {
        code: "const customReduce = (acc: any, curr: any, idx: number) => {}",
        options: [{ ignoreFunctions: ["customReduce"] }],
      },
    ],
  }
);
