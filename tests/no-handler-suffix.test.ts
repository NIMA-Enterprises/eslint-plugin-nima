/*  Test file for no-handler-suffix rule
    Comments indicate the test number and purpose to help identify tests
    
    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 16
    Invalid tests: 8
    Valid tests: 8
*/

import { Messages, rule } from "@rules/no-handler-suffix";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-handler-suffix", rule, {
    invalid: [
        // Arrow function with 'Handler' suffix
        {
            code: "const clickHandler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleClick = () => {}",
        },

        // Function declaration with 'Handler' suffix
        {
            code: "function submitHandler() {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "function handleSubmit() {}",
        },

        // Function expression with 'Handler' suffix
        {
            code: "const errorHandler = function() {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleError = function() {}",
        },

        // Generic 'handler' name
        {
            code: "const handler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handle = () => {}",
        },

        // Case variations
        {
            code: "const ClickHandler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleClick = () => {}",
        },

        // Complex event name
        {
            code: "const formSubmitHandler = () => {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleFormSubmit = () => {}",
        },

        // Named function expression (both names)
        {
            code: "const myHandler = function namedHandler() {}",
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: "const handleMy = function handleNamed() {}",
        },

        // Multiple handlers
        {
            code: `
        const clickHandler = () => {};
        const submitHandler = () => {};
      `,
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: `
        const handleClick = () => {};
        const handleSubmit = () => {};
      `,
        },
    ],

    valid: [
        // Valid 'handle' prefix
        "const handleClick = () => {}",
        "function handleSubmit() {}",
        "const handleError = function() {}",

        // Functions not ending with 'handler'
        "const onClick = () => {}",
        "const submitForm = () => {}",
        "const processClick = () => {}",

        // 'handler' not as suffix
        "const handlerFactory = () => {}",
        "const createHandlerCookie = () => {}",

        // Non-function variables
        "const clickHandler = 'string value'",
    ],
});

// Test naming conflicts
ruleTester.run("no-handler-suffix with naming conflicts", rule, {
    invalid: [
        {
            code: `
        const handleClick = 'existing variable';
        const clickHandler = () => {};
      `,
            errors: [
                {
                    messageId: Messages.BAD_HANDLER_NAME,
                },
            ],
            output: `
        const handleClick = 'existing variable';
        const handleClick2 = () => {};
      `,
        },
    ],

    valid: [
        `
      const handleClick = () => {};
      const handleSubmit = () => {};
    `,
    ],
});
