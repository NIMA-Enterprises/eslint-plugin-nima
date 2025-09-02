import { Messages } from "@models/restrict-console-methods.model";
import * as RestrictConsoleMethods from "@rules/restrict-console-methods";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("restrict-console-methods", RestrictConsoleMethods.rule, {
  invalid: [
    // === BASIC CONSOLE METHOD TESTS ===

    // 1. Basic console.error with default options (all restricted)
    {
      code: "console.error('oops')",
      errors: [
        {
          data: {
            console: "error",
          },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 2. Basic console.log with default options (all restricted)
    {
      code: "console.log('hello')",
      errors: [
        {
          data: { console: "log" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 3. Basic console.warn with default options (all restricted)
    {
      code: "console.warn('warning')",
      errors: [
        {
          data: { console: "warn" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // === MULTIPLE CONSOLE CALLS TESTS ===

    // 4. Multiple console calls in same statement
    {
      code: "console.log('foo'); console.error('bar');",
      errors: [
        { data: { console: "log" }, messageId: Messages.NO_CONSOLE },
        { data: { console: "error" }, messageId: Messages.NO_CONSOLE },
      ],
    },

    // 5. Mixed console calls with conditional statement
    {
      code: "console.log('first'); if (condition) console.error('conditional');",
      errors: [
        { data: { console: "log" }, messageId: Messages.NO_CONSOLE },
        { data: { console: "error" }, messageId: Messages.NO_CONSOLE },
      ],
    },

    // === ALLOW ARRAY OPTION TESTS ===

    // 6. console.warn when only log is allowed
    {
      code: "console.warn('uh oh')",
      errors: [
        {
          data: { console: "warn" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
      options: [{ allow: ["log"] }],
    },

    // 7. console.error when only warn is allowed
    {
      code: "console.error('uh oh')",
      errors: [
        {
          data: { console: "error" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
      options: [{ allow: ["warn"] }],
    },

    // 8. Partial allow list - some methods allowed, others restricted
    {
      code: "console.error('error'); console.warn('warn');",
      errors: [{ data: { console: "error" }, messageId: Messages.NO_CONSOLE }],
      options: [{ allow: ["warn"] }],
    },

    // === FUNCTION CONTEXT TESTS ===

    // 9. Console call inside nested function
    {
      code: `function myFunction() {
        if (true) {
          console.log('inside a function');
        }
      }`,
      errors: [
        {
          data: { console: "log" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 10. Console call in arrow function
    {
      code: "const fn = () => console.log('arrow function')",
      errors: [
        {
          data: { console: "log" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // === ADDITIONAL CONSOLE METHODS TESTS ===

    // 11. console.trace method
    {
      code: "console.trace('stack trace')",
      errors: [
        {
          data: { console: "trace" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 12. console.assert method
    {
      code: "console.assert(false, 'assertion failed')",
      errors: [
        {
          data: { console: "assert" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 13. console.clear method
    {
      code: "console.clear()",
      errors: [
        {
          data: { console: "clear" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 14. console.count method
    {
      code: "console.count('counter')",
      errors: [
        {
          data: { console: "count" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 15. console.group method
    {
      code: "console.group('group name')",
      errors: [
        {
          data: { console: "group" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 16. console.groupEnd method
    {
      code: "console.groupEnd()",
      errors: [
        {
          data: { console: "groupEnd" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 17. console.time method
    {
      code: "console.time('timer')",
      errors: [
        {
          data: { console: "time" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // 18. console.timeEnd method
    {
      code: "console.timeEnd('timer')",
      errors: [
        {
          data: { console: "timeEnd" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },

    // === COMPLEX ARGUMENT TESTS ===

    // 19. Console method with complex arguments
    {
      code: "console.log(obj.prop, arr[0], func())",
      errors: [
        {
          data: { console: "log" },
          messageId: Messages.NO_CONSOLE,
        },
      ],
    },
  ],

  valid: [
    // === NON-CONSOLE OBJECT TESTS ===

    // 20. Method call on different object with same method name
    "myObject.log('not a console log')",

    // 21. Nested object with console property
    "const obj = { console: { log: () => {} } }; obj.console.log('valid');",

    // 22. Custom console-like object
    "const myConsole = { log: () => {} }; myConsole.log('valid');",

    // 23. Property access on different object
    "obj.console.log('not the global console')",

    // 24. Method call with this binding
    "this.console.error('method call on different object')",

    // === VARIABLE NAMED CONSOLE TESTS ===

    // 25. Local variable named console
    "const console = { log: () => {} }; console.log('local variable');",

    // 26. Function parameter named console
    "function test(console) { console.log('parameter'); }",

    // === NON-RESTRICTED CONSOLE METHODS TESTS ===

    // 27. Console method not in CONSOLES constant
    "console.doc(123)",

    // 28. console.info (assuming not restricted)
    "console.info('info')",

    // 29. console.debug (assuming not restricted)
    "console.debug('debug')",

    // 30. console.table (assuming not restricted)
    "console.table(data)",

    // 31. console.dir (assuming not restricted)
    "console.dir(object)",

    // 32. console.dirxml (assuming not restricted)
    "console.dirxml(element)",

    // === SINGLE ALLOWED METHOD TESTS ===

    // 33. console.log allowed via options
    {
      code: "console.log('This is allowed')",
      options: [{ allow: ["log"] }],
    },

    // 34. console.warn allowed via options
    {
      code: "console.warn('This warning is allowed')",
      options: [{ allow: ["warn"] }],
    },

    // 34. console.error allowed via options
    {
      code: "console.error('This error is allowed')",
      options: [{ allow: ["error"] }],
    },

    // 35. console.clear allowed via options
    {
      code: "console.clear()",
      options: [{ allow: ["clear"] }],
    },

    // === MULTIPLE ALLOWED METHODS TESTS ===

    // 36. Multiple console methods all allowed
    {
      code: `
        console.log('log');
        console.warn('warn');
        console.error('error');
      `,
      options: [{ allow: ["log", "warn", "error"] }],
    },

    // 37. Specific subset of methods allowed
    {
      code: "console.log('allowed'); console.warn('also allowed');",
      options: [{ allow: ["log", "warn"] }],
    },

    // 38. All common console methods allowed
    {
      code: `
        console.log('log');
        console.error('error');
        console.warn('warn');
        console.trace('trace');
        console.assert(true);
        console.clear();
        console.count('test');
        console.group('group');
        console.groupEnd();
        console.time('timer');
        console.timeEnd('timer');
      `,
      options: [
        {
          allow: [
            "log",
            "error",
            "warn",
            "trace",
            "assert",
            "clear",
            "count",
            "group",
            "groupEnd",
            "time",
            "timeEnd",
          ],
        },
      ],
    },

    // === COMPUTED PROPERTY ACCESS TESTS ===

    // 39. Computed property access (not handled by this rule)
    "console['log']('computed access')",

    // 40. Dynamic method access
    "const method = 'log'; console[method]('dynamic');",

    // === NON-METHOD-CALL CONSOLE USAGE TESTS ===

    // 41. Console object reference
    "const ref = console",

    // 42. Console constructor access
    "console.constructor",

    // === STRING AND COMMENT TESTS ===

    // 43. Console method in string literal
    "const str = 'console.log'",

    // 44. Method chaining not involving console
    "obj.method().log('chained call')",

    // === EMPTY ALLOW ARRAY TESTS ===

    // 45. Non-console method with empty allow array
    {
      code: "nonConsole.log('not console')",
      options: [{ allow: [] }],
    },
  ],
});
