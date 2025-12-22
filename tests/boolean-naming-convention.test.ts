/*  Test file for boolean-naming-convention rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 65
    Invalid tests: 20
    Valid tests: 45
*/

import { Messages, rule } from "@rules/boolean-naming-convention";
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

ruleTester.run("boolean-naming-convention", rule, {
    invalid: [
        // === VARIABLE TESTS ===

        // 1. Variable: inferred boolean, missing prefix
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

        // 2. Variable: explicit true type, missing prefix
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

        // 3. Variable: explicit false type, missing prefix
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

        // 4. Variable: let with inferred boolean, missing prefix
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

        // 5. Variable: destructured boolean, missing prefix
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

        // === FUNCTION TESTS ===

        // 6. Arrow function returns boolean, missing prefix
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

        // 7. Function expression returns boolean, missing prefix
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

        // 8. Function declaration returns boolean, missing prefix
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

        // 9. Arrow function with explicit boolean return, missing prefix
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

        // === PARAMETER TESTS ===

        // 10. Function parameter of type boolean, missing prefix
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

        // 11. Function declaration with object parameter, missing prefix
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

        // 12. Arrow function with object parameter, missing prefix
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

        // 13. Function declaration with multiple boolean parameters, missing prefix
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

        // 14. Function declaration with nested object parameter, missing prefix
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

        // === PROPERTY TESTS ===

        // 15. Object property with boolean value, missing prefix
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

        // 16. Object property with boolean function, missing prefix
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

        // 17. Object property with boolean-returning function expression, missing prefix
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

        // 18. Multiple object properties with boolean values/functions, missing prefix
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

        // 19. Nested object properties with boolean values/functions, missing prefix
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

        // 20. Variable with union type including boolean, missing prefix
        {
            code: "const value: string | boolean = true",
            errors: [
                {
                    data: {
                        name: "value",
                        suggestion: "isValue",
                    },
                    messageId: Messages.BAD_VARIABLE_BOOLEAN_PREFIX,
                },
            ],
        },
    ],

    valid: [
        // === VARIABLE TESTS (valid) ===

        // 21. Variable: valid boolean prefix
        "const isNIMA = true", // 21.
        "const isEnabled: boolean = true", // 22.
        "const hasValue = false", // 23.
        "const canSubmit: true = true", // 24.
        "const shouldRender: false = false", // 25.
        "const IS_VALID = true", // 26.
        "const Has_Data = false", // 27.
        "const { isActive }: { isActive: boolean } = obj", // 28.
        "const { hasData, canEdit }: { hasData: boolean, canEdit: boolean } = config", // 29.

        // === FUNCTION TESTS (valid) ===

        // 30. Arrow function with valid boolean prefix
        "const isNIMA = () => true", // 30.
        "function isValid(): boolean { return true; }", // 31.
        "function hasPermission(): boolean { return false; }", // 32.
        "function canEdit(): boolean { return true; }", // 33.
        "function shouldUpdate(): boolean { return false; }", // 34.
        "function willRender(): boolean { return true; }", // 35.
        "const isActive = (): boolean => true", // 36.
        "const hasData = () => false", // 37.
        "const can_edit = () => true", // 38.
        "const canProcess = (): boolean => true", // 39.

        // === PARAMETER TESTS (valid) ===

        // 40. Function parameter with valid boolean prefix
        "const isNIMA = (isNima: boolean) => {}", // 40.
        "function test(isActive: boolean, hasData: boolean) {}", // 41.
        "const fn = (isVisible: boolean) => {}", // 42.
        "function process({ isEnabled }: { isEnabled: boolean }) {}", // 43.
        "function test(isActive?: boolean) {}", // 44.

        // === PROPERTY TESTS (valid) ===

        // 45. Object property with valid boolean prefix
        "const NIMA = {\nisNima: true}", // 45.
        "const NIMA = {\nisNima: () => true}", // 46.
        `const config = {
      isActive: true,
      hasData: false,
      canEdit: () => true,
      shouldUpdate: function(): boolean { return false; }
    }`, // 47.

        // === NON-BOOLEAN/EDGE CASES (should not trigger) ===

        // 48. Non-boolean variables and functions
        "const user = 'john'", // 48.
        "const age = 25", // 49.
        "const getData = () => 'data'", // 50.
        "function getName(): string { return 'name'; }", // 51.
        "const config = { name: 'test', value: 42 }", // 52.
        "function process(name: string, age: number) {}", // 53.
        "function test(name: string, isActive: boolean, age: number) {}", // 54.
        `const config = {
      name: 'test',
      isActive: true,
      count: 42,
      hasData: false
    }`, // 55.
        "function validate() { return 'valid'; }", // 56.
        "const check = () => ({ status: 'ok' })", // 57.
        `function process({ 
      name, 
      isActive, 
      age 
    }: { 
      name: string, 
      isActive: boolean, 
      age: number 
    }) {}`, // 58.
    ],
});

// Additional test with custom options
ruleTester.run("boolean-naming-convention with custom prefixes", rule, {
    invalid: [
        // 59. Custom allowedPrefixes option
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
        // 60. Variable with allowed custom prefix
        {
            code: "const isActive = true",
            options: [{ allowedPrefixes: ["is", "has"] }],
        },
        // 61. Variable with another allowed custom prefix
        {
            code: "const hasData = true",
            options: [{ allowedPrefixes: ["is", "has"] }],
        },
    ],
});

// Test with disabled checks
ruleTester.run("boolean-naming-convention with disabled checks", rule, {
    invalid: [
        // 62. Only variables should be checked
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
        // 63. Function should not trigger when checkFunctions is false
        {
            code: "function validate(): boolean { return true; }",
            options: [{ checkFunctions: false }],
        },
        // 64. Parameter should not trigger when checkParameters is false
        {
            code: "const fn = (active: boolean) => {}",
            options: [{ checkParameters: false }],
        },
        // 65. Property should not trigger when checkProperties is false
        {
            code: "const obj = { active: true }",
            options: [{ checkProperties: false }],
        },
    ],
});
