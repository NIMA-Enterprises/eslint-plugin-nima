import { Messages } from "@models/no-handle-suffix.model";
import * as NoHandlerSuffix from "@rules/no-handler-suffix";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-handler-suffix", NoHandlerSuffix.rule, {
  invalid: [
    // Original test cases
    {
      code: "const clickHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick = () => {}",
    },
    {
      code: "const handler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handle",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handle = () => {}",
    },

    // Function declarations
    {
      code: "function clickHandler() {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "function handleClick() {}",
    },
    {
      code: "function submitHandler() {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleSubmit",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "function handleSubmit() {}",
    },
    {
      code: "function handler() {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handle",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "function handle() {}",
    },

    // Function expressions
    {
      code: "const mouseOverHandler = function() {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleMouseOver",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleMouseOver = function() {}",
    },
    {
      code: "const errorHandler = function errorHandler() {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleError",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
        {
          data: {
            fnWithGoodName: "handleError",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleError = function handleError() {}",
    },

    // Different casing variations
    {
      code: "const CLICK_HANDLER = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleCLICK_",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleCLICK_ = () => {}",
    },
    {
      code: "const ClickHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick = () => {}",
    },
    {
      code: "const clickhandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick = () => {}",
    },

    // Complex event names
    {
      code: "const onButtonClickHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleOnButtonClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleOnButtonClick = () => {}",
    },
    {
      code: "const formSubmitHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleFormSubmit",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleFormSubmit = () => {}",
    },
    {
      code: "const windowResizeHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleWindowResize",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleWindowResize = () => {}",
    },
    {
      code: "const keyDownHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleKeyDown",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleKeyDown = () => {}",
    },

    // Edge cases with numbers and special characters
    {
      code: "const button1ClickHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleButton1Click",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleButton1Click = () => {}",
    },
    {
      code: "const btn_click_handler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleBtn_click_",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleBtn_click_ = () => {}",
    },

    // Single letter base cases
    {
      code: "const aHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleA",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleA = () => {}",
    },
    {
      code: "const xHandler = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleX",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleX = () => {}",
    },

    // With function body and usage
    {
      code: `
        const clickHandler = () => {
          console.log('clicked');
        };
        clickHandler();
      `,
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
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

    // Multiple handlers in same scope
    {
      code: `
        const clickHandler = () => {};
        const submitHandler = () => {};
      `,
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
        {
          data: {
            fnWithGoodName: "handleSubmit",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: `
        const handleClick = () => {};
        const handleSubmit = () => {};
      `,
    },

    // Named function expressions (will trigger twice - variable name and function name)
    {
      code: "const myHandler = function namedHandler() {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleMy",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
        {
          data: {
            fnWithGoodName: "handleNamed",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleMy = function handleNamed() {}",
    },

    // Arrow functions with parameters
    {
      code: "const eventHandler = (event) => { console.log(event); }",
      errors: [
        {
          data: {
            fnWithGoodName: "handleEvent",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleEvent = (event) => { console.log(event); }",
    },

    // Functions with type annotations (if using TypeScript)
    {
      code: "const clickHandler: () => void = () => {}",
      errors: [
        {
          data: {
            fnWithGoodName: "handleClick",
          },
          messageId: Messages.BAD_HANDLER_NAME,
        },
      ],
      output: "const handleClick: () => void = () => {}",
    },
  ],

  valid: [
    // Original valid test cases
    "const handleClick = () => {}",
    "const handle = () => {}",

    // Function declarations with handle prefix
    "function handleClick() {}",
    "function handleSubmit() {}",
    "function handle() {}",

    // Function expressions with handle prefix
    "const handleMouseOver = function() {}",
    "const handleError = function handleError() {}",

    // Various handle prefix variations
    "const handleButtonClick = () => {}",
    "const handleFormSubmit = () => {}",
    "const handleWindowResize = () => {}",
    "const handleKeyDown = () => {}",
    "const handleA = () => {}",
    "const handleX = () => {}",

    // Functions that don't end with 'handler'
    "const clickEvent = () => {}",
    "const onClick = () => {}",
    "const onSubmit = () => {}",
    "const buttonCallback = () => {}",
    "const processClick = () => {}",
    "const submitForm = () => {}",

    // Functions with 'handler' in the middle (not suffix)
    "const handlerFactory = () => {}",
    "const handlerUtils = () => {}",
    "const createHandler = () => {}",

    // Functions with similar but different endings
    "const clickHandling = () => {}",
    "const handlers = () => {}",
    "const handled = () => {}",

    // Regular variables that aren't functions
    "const clickHandler = 'string value'",
    "const handler = 42",
    "const myHandler = null",

    // Object methods (not covered by this rule)
    `const obj = {
      clickHandler() {},
      handler: () => {}
    }`,

    // Class methods (not covered by this rule)
    `class MyClass {
      clickHandler() {}
      handler = () => {}
    }`,

    // Functions with complex names but proper prefix
    "const handleOnButtonClick = () => {}",
    "const handleFormSubmitSuccess = () => {}",
    "const handleWindowResizeThrottled = () => {}",

    // Edge cases that should not trigger
    "const notAHandler = () => {}",
    "const handlerNotAtEnd = () => {}",
    "const myClickEvent = () => {}",

    // Functions that contain 'handler' but don't end with it
    "const handlerConfig = () => {}",
    "const handlerSetup = () => {}",
    "const isHandler = () => {}",

    // Anonymous functions (not named, so rule shouldn't apply)
    "(() => {})()",
    "(function() {})()",

    // Functions with case variations of handle prefix
    "const HandleClick = () => {}", // PascalCase
    "const HANDLE_CLICK = () => {}", // CONSTANT_CASE
    "const handle_click = () => {}", // snake_case
  ],
});

// Test edge case where there might be naming conflicts
ruleTester.run(
  "no-handler-suffix with naming conflicts",
  NoHandlerSuffix.rule,
  {
    invalid: [
      {
        code: `
        const handleClick = 'existing variable';
        const clickHandler = () => {};
      `,
        errors: [
          {
            data: {
              fnWithGoodName: "handleClick2",
            },
            messageId: Messages.BAD_HANDLER_NAME,
          },
        ],
        output: `
        const handleClick = 'existing variable';
        const handleClick2 = () => {};
      `,
      },
      {
        code: `
        const handleSubmit = () => {};
        const handleSubmit2 = 'something';
        const submitHandler = () => {};
      `,
        errors: [
          {
            data: {
              fnWithGoodName: "handleSubmit3",
            },
            messageId: Messages.BAD_HANDLER_NAME,
          },
        ],
        output: `
        const handleSubmit = () => {};
        const handleSubmit2 = 'something';
        const handleSubmit3 = () => {};
      `,
      },
    ],
    valid: [
      // Should not trigger when properly named
      `
      const handleClick = () => {};
      const handleSubmit = () => {};
    `,
    ],
  }
);
