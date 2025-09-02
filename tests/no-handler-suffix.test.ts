/*  Test file for no-handler-suffix rule
    Comments indicate the test number and purpose to help identify tests
    
    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 65
    Invalid tests: 20
    Valid tests: 45
*/

import { Messages } from "@models/no-handle-suffix.model";
import * as NoHandlerSuffix from "@rules/no-handler-suffix";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-handler-suffix", NoHandlerSuffix.rule, {
  invalid: [
    // === ARROW FUNCTION HANDLERS ===

    // 1. Arrow function with 'Handler' suffix
    {
      code: "const clickHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick = () => {}",
    },

    // 2. Arrow function named 'handler'
    {
      code: "const handler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handle" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handle = () => {}",
    },

    // === FUNCTION DECLARATIONS ===

    // 3. Function declaration with 'Handler' suffix
    {
      code: "function clickHandler() {}",
      errors: [
        {
          data: { fnWithGoodName: "handleClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "function handleClick() {}",
    },

    // 4. Function declaration with event name
    {
      code: "function submitHandler() {}",
      errors: [
        {
          data: { fnWithGoodName: "handleSubmit" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "function handleSubmit() {}",
    },

    // 5. Function declaration named 'handler'
    {
      code: "function handler() {}",
      errors: [
        {
          data: { fnWithGoodName: "handle" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "function handle() {}",
    },

    // === FUNCTION EXPRESSIONS ===

    // 6. Function expression with 'Handler' suffix
    {
      code: "const mouseOverHandler = function() {}",
      errors: [
        {
          data: { fnWithGoodName: "handleMouseOver" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleMouseOver = function() {}",
    },

    // 7. Named function expression with 'Handler' suffix
    {
      code: "const errorHandler = function errorHandler() {}",
      errors: [
        {
          data: { fnWithGoodName: "handleError" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
        {
          data: { fnWithGoodName: "handleError" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleError = function handleError() {}",
    },

    // === CASE VARIATIONS ===

    // 8. All caps handler
    {
      code: "const CLICK_HANDLER = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleCLICK_" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleCLICK_ = () => {}",
    },

    // 9. PascalCase handler
    {
      code: "const ClickHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick = () => {}",
    },

    // 10. Lowercase handler
    {
      code: "const clickhandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick = () => {}",
    },

    // === COMPLEX EVENT NAMES ===

    // 11. Handler with 'on' prefix
    {
      code: "const onButtonClickHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleOnButtonClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleOnButtonClick = () => {}",
    },

    // 12. Handler with form submit
    {
      code: "const formSubmitHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleFormSubmit" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleFormSubmit = () => {}",
    },

    // 13. Handler with window resize
    {
      code: "const windowResizeHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleWindowResize" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleWindowResize = () => {}",
    },

    // 14. Handler with key down
    {
      code: "const keyDownHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleKeyDown" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleKeyDown = () => {}",
    },

    // === EDGE CASES ===

    // 15. Handler with number in name
    {
      code: "const button1ClickHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleButton1Click" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleButton1Click = () => {}",
    },

    // 16. Handler with underscores
    {
      code: "const btn_click_handler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleBtn_click_" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleBtn_click_ = () => {}",
    },

    // 17. Single letter handler
    {
      code: "const aHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleA" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleA = () => {}",
    },

    // 18. Another single letter handler
    {
      code: "const xHandler = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleX" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleX = () => {}",
    },

    // 19. Handler with function body and usage
    {
      code: `
        const clickHandler = () => {
          console.log('clicked');
        };
        clickHandler();
      `,
      errors: [
        {
          data: { fnWithGoodName: "handleClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: `
        const handleClick = () => {
          console.log('clicked');
        };
        handleClick();
      `,
    },

    // 20. Multiple handlers in same scope
    {
      code: `
        const clickHandler = () => {};
        const submitHandler = () => {};
      `,
      errors: [
        {
          data: { fnWithGoodName: "handleClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
        {
          data: { fnWithGoodName: "handleSubmit" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: `
        const handleClick = () => {};
        const handleSubmit = () => {};
      `,
    },

    // 21. Named function expressions (variable and function name)
    {
      code: "const myHandler = function namedHandler() {}",
      errors: [
        {
          data: { fnWithGoodName: "handleMy" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
        {
          data: { fnWithGoodName: "handleNamed" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleMy = function handleNamed() {}",
    },

    // 22. Arrow function with parameter
    {
      code: "const eventHandler = (event) => { console.log(event); }",
      errors: [
        {
          data: { fnWithGoodName: "handleEvent" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleEvent = (event) => { console.log(event); }",
    },

    // 23. Function with type annotation
    {
      code: "const clickHandler: () => void = () => {}",
      errors: [
        {
          data: { fnWithGoodName: "handleClick" },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick: () => void = () => {}",
    },
  ],

  valid: [
    // === VALID HANDLER NAMES ===

    // 24. Arrow function with 'handle' prefix
    "const handleClick = () => {}", // 24.
    "const handle = () => {}", // 25.

    // 26. Function declarations with 'handle' prefix
    "function handleClick() {}", // 26.
    "function handleSubmit() {}", // 27.
    "function handle() {}", // 28.

    // 29. Function expressions with 'handle' prefix
    "const handleMouseOver = function() {}", // 29.
    "const handleError = function handleError() {}", // 30.

    // 31. Various handle prefix variations
    "const handleButtonClick = () => {}", // 31.
    "const handleFormSubmit = () => {}", // 32.
    "const handleWindowResize = () => {}", // 33.
    "const handleKeyDown = () => {}", // 34.
    "const handleA = () => {}", // 35.
    "const handleX = () => {}", // 36.

    // 37. Functions that don't end with 'handler'
    "const clickEvent = () => {}", // 37.
    "const onClick = () => {}", // 38.
    "const onSubmit = () => {}", // 39.
    "const buttonCallback = () => {}", // 40.
    "const processClick = () => {}", // 41.
    "const submitForm = () => {}", // 42.

    // 43. Functions with 'handler' in the middle (not suffix)
    "const handlerFactory = () => {}", // 43.
    "const handlerUtils = () => {}", // 44.
    "const createHandler = () => {}", // 45.

    // 46. Functions with similar but different endings
    "const clickHandling = () => {}", // 46.
    "const handlers = () => {}", // 47.
    "const handled = () => {}", // 48.

    // 49. Regular variables that aren't functions
    "const clickHandler = 'string value'", // 49.
    "const handler = 42", // 50.
    "const myHandler = null", // 51.

    // 52. Class methods (not covered by this rule)
    `class MyClass {
      clickHandler() {}
      handler = () => {}
    }`, // 52.

    // 53. Functions with complex names but proper prefix
    "const handleOnButtonClick = () => {}", // 53.
    "const handleFormSubmitSuccess = () => {}", // 54.

    // 55. Edge cases that should not trigger
    "const handlerNotAtEnd = () => {}", // 55.
    "const myClickEvent = () => {}", // 56.

    // 57. Functions that contain 'handler' but don't end with it
    "const handlerConfig = () => {}", // 57.
    "const handlerSetup = () => {}", // 58.

    // 59. Anonymous functions (not named, so rule shouldn't apply)
    "(() => {})()", // 59.
    "(function() {})()", // 60.

    // 61. Functions with case variations of handle prefix
    "const HandleClick = () => {}", // 61.
    "const HANDLE_CLICK = () => {}", // 62.
    "const handle_click = () => {}", // 63.
  ],
});

// === EDGE CASES WITH NAMING CONFLICTS ===

ruleTester.run(
  "no-handler-suffix with naming conflicts",
  NoHandlerSuffix.rule,
  {
    invalid: [
      // 64. Naming conflict: handleClick already exists
      {
        code: `
        const handleClick = 'existing variable';
        const clickHandler = () => {};
      `,
        errors: [
          {
            data: { fnWithGoodName: "handleClick2" },
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
      // 65. Properly named handlers, no conflict
      `
      const handleClick = () => {};
      const handleSubmit = () => {};
    `,
    ],
  }
);
