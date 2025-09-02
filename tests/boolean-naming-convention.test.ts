import { Messages } from "@models/boolean-naming-convention.model";
import * as BooleanNamingConventions from "@rules/boolean-naming-convention";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
      tsconfigRootDir: __dirname,
    },
  },
});

ruleTester.run("boolean-naming-convention", BooleanNamingConventions.rule, {
  invalid: [
    // Original test cases
    {
      code: "const NIMA = () => true",
      errors: [
        {
          data: {
            name: "NIMA",
            suggestion: "isNIMA",
          },
          messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
        },
      ],
    },
    {
      code: "const NIMA = true",
      errors: [
        {
          data: {
            name: "NIMA",
            suggestion: "isNIMA",
          },
          messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
        },
      ],
    },
    {
      code: "const NIMA = (nima: boolean) => {}",
      errors: [
        {
          data: {
            name: "nima",
            suggestion: "isNima",
          },
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
        },
      ],
    },
    {
      code: "const NIMA = {\nnima: true}",
      errors: [
        {
          data: {
            name: "nima",
            suggestion: "isNima",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
      ],
    },
    {
      code: "const NIMA = {\nnima: () => true}",
      errors: [
        {
          data: {
            name: "nima",
            suggestion: "isNima",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
      ],
    },

    // Function declarations
    {
      code: "function checkUser(): boolean { return true; }",
      errors: [
        {
          data: {
            name: "checkUser",
            suggestion: "isCheckUser",
          },
          messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
        },
      ],
    },

    // Arrow functions with explicit return types
    {
      code: "const validate = (): boolean => true",
      errors: [
        {
          data: {
            name: "validate",
            suggestion: "isValidate",
          },
          messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
        },
      ],
    },

    // TypeScript boolean literals
    {
      code: "const flag: true = true",
      errors: [
        {
          data: {
            name: "flag",
            suggestion: "isFlag",
          },
          messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
        },
      ],
    },
    {
      code: "const status: false = false",
      errors: [
        {
          data: {
            name: "status",
            suggestion: "isStatus",
          },
          messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
        },
      ],
    },

    // Object destructuring with boolean types
    {
      code: "const { active }: { active: boolean } = obj",
      errors: [
        {
          data: {
            name: "active",
            suggestion: "isActive",
          },
          messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
        },
      ],
    },

    // Function parameters with object destructuring
    {
      code: "function test({ enabled }: { enabled: boolean }) {}",
      errors: [
        {
          data: {
            name: "enabled",
            suggestion: "isEnabled",
          },
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
        },
      ],
    },

    // Arrow function parameters with object destructuring
    {
      code: "const fn = ({ visible }: { visible: boolean }) => {}",
      errors: [
        {
          data: {
            name: "visible",
            suggestion: "isVisible",
          },
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
        },
      ],
    },

    // Multiple boolean parameters
    {
      code: "function test(active: boolean, enabled: boolean) {}",
      errors: [
        {
          data: {
            name: "active",
            suggestion: "isActive",
          },
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
        },
        {
          data: {
            name: "enabled",
            suggestion: "isEnabled",
          },
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
        },
      ],
    },

    // Object properties with boolean functions
    {
      code: "const obj = { validate: function(): boolean { return true; } }",
      errors: [
        {
          data: {
            name: "validate",
            suggestion: "isValidate",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
      ],
    },

    // Object with multiple boolean properties
    {
      code: `const config = {
        active: true,
        enabled: false,
        visible: () => true
      }`,
      errors: [
        {
          data: {
            name: "active",
            suggestion: "isActive",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
        {
          data: {
            name: "enabled",
            suggestion: "isEnabled",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
        {
          data: {
            name: "visible",
            suggestion: "isVisible",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
      ],
    },

    // Complex object destructuring in parameters
    {
      code: `function process({ 
        settings: { active, visible } 
      }: { 
        settings: { active: boolean, visible: boolean } 
      }) {}`,
      errors: [
        {
          data: {
            name: "active",
            suggestion: "isActive",
          },
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
        },
        {
          data: {
            name: "visible",
            suggestion: "isVisible",
          },
          messageId: Messages.BAD_PARAMETER_BOOLEAN_PREFIX,
        },
      ],
    },

    // Function expressions assigned to variables
    {
      code: "const validate = function(): boolean { return true; }",
      errors: [
        {
          data: {
            name: "validate",
            suggestion: "isValidate",
          },
          messageId: Messages.BAD_FUNCTION_BOOLEAN_PREFIX,
        },
      ],
    },

    // Boolean variables with inferred types
    {
      code: "let active = false",
      errors: [
        {
          data: {
            name: "active",
            suggestion: "isActive",
          },
          messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
        },
      ],
    },

    // Nested object properties
    {
      code: `const config = {
        ui: {
          visible: true,
          enabled: () => false
        }
      }`,
      errors: [
        {
          data: {
            name: "visible",
            suggestion: "isVisible",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
        {
          data: {
            name: "enabled",
            suggestion: "isEnabled",
          },
          messageId: Messages.BAD_PROPERTY_BOOLEAN_PREFIX,
        },
      ],
    },
  ],

  valid: [
    // Original valid test cases
    "const isNIMA = () => true",
    "const isNIMA = true",
    "const isNIMA = (isNima: boolean) => {}",
    "const NIMA = {\nisNima: true}",
    "const NIMA = {\nisNima: () => true}",

    // Valid function declarations with proper prefixes
    "function isValid(): boolean { return true; }",
    "function hasPermission(): boolean { return false; }",
    "function canEdit(): boolean { return true; }",
    "function shouldUpdate(): boolean { return false; }",
    "function willRender(): boolean { return true; }",

    // Valid arrow functions
    "const isActive = (): boolean => true",
    "const hasData = () => false",
    "const canProcess = (): boolean => true",

    // Valid variables
    "const isEnabled: boolean = true",
    "const hasValue = false",
    "const canSubmit: true = true",
    "const shouldRender: false = false",

    // Valid object properties
    `const config = {
      isActive: true,
      hasData: false,
      canEdit: () => true,
      shouldUpdate: function(): boolean { return false; }
    }`,

    // Valid parameters
    "function test(isActive: boolean, hasData: boolean) {}",
    "const fn = (isVisible: boolean) => {}",
    "function process({ isEnabled }: { isEnabled: boolean }) {}",

    // Valid object destructuring
    "const { isActive }: { isActive: boolean } = obj",
    "const { hasData, canEdit }: { hasData: boolean, canEdit: boolean } = config",

    // Non-boolean cases (should not trigger)
    "const user = 'john'",
    "const age = 25",
    "const getData = () => 'data'",
    "function getName(): string { return 'name'; }",
    "const config = { name: 'test', value: 42 }",
    "function process(name: string, age: number) {}",

    // Mixed types (only boolean should trigger)
    "function test(name: string, isActive: boolean, age: number) {}",
    `const config = {
      name: 'test',
      isActive: true,
      count: 42,
      hasData: false
    }`,

    // Edge cases with existing valid prefixes
    "const IS_VALID = true", // uppercase with valid prefix
    "const Has_Data = false", // mixed case with valid prefix
    "const can_edit = () => true", // snake_case with valid prefix

    // Functions that don't return boolean (should not trigger)
    "function validate() { return 'valid'; }",
    "const check = () => ({ status: 'ok' })",

    // Optional boolean parameters (valid)
    "function test(isActive?: boolean) {}",

    // Union types including boolean (edge case)
    "const value: string | boolean = true", // This might be tricky for the rule

    // Complex destructuring with mixed types
    `function process({ 
      name, 
      isActive, 
      age 
    }: { 
      name: string, 
      isActive: boolean, 
      age: number 
    }) {}`,
  ],
});

// Additional test with custom options
ruleTester.run(
  "boolean-naming-convention with custom prefixes",
  BooleanNamingConventions.rule,
  {
    invalid: [
      {
        code: "const active = true",
        errors: [
          {
            data: {
              name: "active",
              suggestion: "isActive",
            },
            messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
          },
        ],
        options: [{ allowedPrefixes: ["is", "has"] }],
      },
    ],
    valid: [
      {
        code: "const isActive = true",
        options: [{ allowedPrefixes: ["is", "has"] }],
      },
      {
        code: "const hasData = true",
        options: [{ allowedPrefixes: ["is", "has"] }],
      },
    ],
  }
);

// Test with disabled checks
ruleTester.run(
  "boolean-naming-convention with disabled checks",
  BooleanNamingConventions.rule,
  {
    invalid: [
      // Only variables should be checked
      {
        code: "const active = true",
        errors: [
          {
            data: {
              name: "active",
              suggestion: "isActive",
            },
            messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
          },
        ],
        options: [
          {
            checkFunctions: false,
            checkParameters: false,
            checkProperties: false,
            checkVariables: true,
          },
        ],
      },
    ],
    valid: [
      // These should not trigger errors when their respective checks are disabled
      {
        code: "function validate(): boolean { return true; }",
        options: [{ checkFunctions: false }],
      },
      {
        code: "const fn = (active: boolean) => {}",
        options: [{ checkParameters: false }],
      },
      {
        code: "const obj = { active: true }",
        options: [{ checkProperties: false }],
      },
    ],
  }
);
