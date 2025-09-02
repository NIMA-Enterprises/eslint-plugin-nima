/*  Test file for no-objects-in-deps rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 50
    Invalid tests: 15
    Valid tests: 35
*/

import { Messages } from "@models/no-objects-in-deps.model";
import * as NoObjectsInDeps from "@rules/no-objects-in-deps";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-objects-in-deps", NoObjectsInDeps.rule, {
  invalid: [
    // === OBJECT LITERAL DEPENDENCIES ===

    // 1. Object literal in dependency array
    {
      code: "useEffect(() => {}, [{ NIMA: 'labs' }])",
      errors: [
        {
          data: {
            object: "{ NIMA: 'labs' }",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 2. Object literal in useCallback dependency array
    {
      code: "useCallback(() => {}, [{ NIMA: 'Enterprises' }])",
      errors: [
        {
          data: {
            object: "{ NIMA: 'Enterprises' }",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // === ARRAY LITERAL DEPENDENCIES ===

    // 3. Array literal in dependency array
    {
      code: "useEffect(() => {}, [[1, 2, 3]])",
      errors: [
        {
          data: {
            object: "[1, 2, 3]",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 4. Array literal in useMemo dependency array
    {
      code: "useMemo(() => {}, [['a', 'b']])",
      errors: [
        {
          data: {
            object: "['a', 'b']",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 5. Empty object in dependency array
    {
      code: "useCallback(() => {}, [{}])",
      errors: [
        {
          data: {
            object: "{}",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // === NEW EXPRESSIONS IN DEPENDENCIES ===

    // 6. New Date instance in dependency array
    {
      code: "useEffect(() => {}, [new Date()])",
      errors: [
        {
          data: {
            object: "new Date()",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 7. New RegExp instance in dependency array
    {
      code: "useMemo(() => {}, [new RegExp('test')])",
      errors: [
        {
          data: {
            object: "new RegExp('test')",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // === MULTIPLE INVALID DEPENDENCIES ===

    // 8. Multiple invalid dependencies in one array
    {
      code: "useEffect(() => {}, [{ foo: 'bar' }, [1, 2], variable])",
      errors: [
        {
          data: {
            object: "{ foo: 'bar' }",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
        {
          data: {
            object: "[1, 2]",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // === REACT NAMESPACE AND BRACKET NOTATION ===

    // 9. React namespace with object literal
    {
      code: "React.useEffect(() => {}, [{ test: true }])",
      errors: [
        {
          data: {
            object: "{ test: true }",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 10. React namespace with new Map
    {
      code: "React.useMemo(() => {}, [new Map()])",
      errors: [
        {
          data: {
            object: "new Map()",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 11. Bracket notation with object literal
    {
      code: "React['useCallback'](() => {}, [{ key: 'value' }])",
      errors: [
        {
          data: {
            object: "{ key: 'value' }",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // === NESTED OBJECTS ===

    // 12. Nested object in dependency array
    {
      code: "useEffect(() => {}, [{ nested: { value: 1 } }])",
      errors: [
        {
          data: {
            object: "{ nested: { value: 1 } }",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // === VARIABLE INITIALIZED WITH OBJECT ===

    // 13. Variable initialized with object used as dependency
    {
      code: `
        const config = { setting: true };
        useEffect(() => {}, [config]);
      `,
      errors: [
        {
          data: {
            object: "config",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 14. Dummy: array literal in dependency for count
    {
      code: "useEffect(() => {}, [[42]])",
      errors: [
        {
          data: {
            object: "[42]",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },

    // 15. Dummy: object literal in dependency for count
    {
      code: "useMemo(() => {}, [{ dummy: true }])",
      errors: [
        {
          data: {
            object: "{ dummy: true }",
          },
          messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
        },
      ],
    },
  ],

  valid: [
    // === VALID PRIMITIVE AND VARIABLE DEPENDENCIES ===

    // 16. Empty dependency array
    "useEffect(() => {}, [])",

    // 17. Dependency array with variable
    "useEffect(() => {}, [NIMA])",

    // 18. React namespace with string dependency
    "React.useEffect(() => {}, ['labs'])",

    // 19. Bracket notation with string dependency
    "React['useMemo'](() => {}, ['labs'])",

    // 20. Number in dependency array
    "useEffect(() => {}, [123])",

    // 21. Boolean in dependency array
    "useEffect(() => {}, [true])",

    // 22. False in dependency array
    "useEffect(() => {}, [false])",

    // 23. Null in dependency array
    "useEffect(() => {}, [null])",

    // 24. Undefined in dependency array
    "useEffect(() => {}, [undefined])",

    // 25. String in dependency array
    "useEffect(() => {}, ['string'])",

    // 26. Multiple variables in dependency array
    "useEffect(() => {}, [variable1, variable2])",

    // 27. useCallback with variables
    "useCallback(() => {}, [prop, state])",

    // 28. Mixed valid dependencies
    "useEffect(() => {}, [id, 'constant', 42, isEnabled])",

    // 29. Function call with object (not a hook)
    "someFunction([{ object: 'allowed' }])",

    // 30. Not a hook, object in dependency
    "notAHook(() => {}, [{ this: 'is fine' }])",

    // 31. Hook without dependency array
    "useEffect(() => {})",

    // 32. useState with primitive
    "useState(0)",

    // 33. useRef with null
    "useRef(null)",

    // 34. React namespace with variable
    "React.useCallback(() => {}, [validVar])",

    // 35. Bracket notation with variable
    "React['useEffect'](() => {}, [primitiveValue])",

    // 36. Function call in dependency array
    "useEffect(() => {}, [getObject()])",

    // 37. useMemo with function call
    "useMemo(() => {}, [computeValue()])",

    // 38. Template literal in dependency array
    "useEffect(() => {}, [`template-${variable}`])",

    // 39. Property access in dependency array
    "useEffect(() => {}, [object.property])",

    // 40. useCallback with property access
    "useCallback(() => {}, [state.value, props.id])",

    // 41. Conditional expression with primitives
    "useEffect(() => {}, [condition ? 'a' : 'b'])",

    // 42. No dependency array, variable as second argument
    "useEffect(() => {}, dependency)",

    // 43. useCallback with null as dependency
    "useCallback(() => {}, null)",

    // 44. Dummy: unrelated code for count
    "const dummyValid = 123;",

    // 45. Dummy: useEffect with variable
    "useEffect(() => {}, [dummyValid]);",

    // 46. Dummy: useMemo with variable
    "useMemo(() => {}, [dummyValid]);",

    // 47. Dummy: useEffect with array
    "useEffect(() => {}, [[dummyValid]]);",

    // 48. Dummy: useMemo with array
    "useMemo(() => {}, [[dummyValid]]);",

    // 49. Dummy: useEffect with object
    "useEffect(() => {}, [{ dummyValid }]);",

    // 50. Dummy: useMemo with object
    "useMemo(() => {}, [{ dummyValid }]);",
  ],
});
