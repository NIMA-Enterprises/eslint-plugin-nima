/* Test file for restrict-optional-call-expression rule
    Ensures optional chaining on call expressions is properly detected

    Created by: Nima Labs
    Last modified: 2026-01-12

    Tests present: 12
    Invalid tests: 6
    Valid tests: 6
*/

import { Messages, rule } from "@rules/restrict-optional-call-expression";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("restrict-optional-call-expression", rule, {
    invalid: [
        // Test 1: Basic optional call expression
        {
            code: "obj.method?.();",
            errors: [
                {
                    messageId: Messages.BAD_CALL_EXPRESSION,
                },
            ],
        },

        // Test 2: Optional call on a function variable
        {
            code: "const result = callback?.();",
            errors: [
                {
                    messageId: Messages.BAD_CALL_EXPRESSION,
                },
            ],
        },

        // Test 3: Nested optional call expression
        {
            code: "obj.nested.method?.();",
            errors: [
                {
                    messageId: Messages.BAD_CALL_EXPRESSION,
                },
            ],
        },

        // Test 4: Optional call with arguments
        {
            code: "handler?.('arg1', 'arg2');",
            errors: [
                {
                    messageId: Messages.BAD_CALL_EXPRESSION,
                },
            ],
        },

        // Test 5: Multiple optional call expressions in one statement
        {
            code: "first?.(); second?.();",
            errors: [
                {
                    messageId: Messages.BAD_CALL_EXPRESSION,
                },
                {
                    messageId: Messages.BAD_CALL_EXPRESSION,
                },
            ],
        },

        // Test 6: Optional call in arrow function return
        {
            code: "const fn = () => callback?.();",
            errors: [
                {
                    messageId: Messages.BAD_CALL_EXPRESSION,
                },
            ],
        },
    ],

    valid: [
        // Test 1: Regular function call (no optional chaining)
        {
            code: "obj.method();",
        },

        // Test 2: Optional chaining on property access (not call)
        {
            code: "const value = obj?.property;",
        },

        // Test 3: Regular callback invocation
        {
            code: "callback();",
        },

        // Test 4: Optional property access followed by regular call
        {
            code: "obj?.method();",
        },

        // Test 5: Nested property access with optional chaining but regular call
        {
            code: "obj?.nested?.method();",
        },

        // Test 6: Function call with optional chaining on arguments
        {
            code: "fn(obj?.value);",
        },
    ],
});
