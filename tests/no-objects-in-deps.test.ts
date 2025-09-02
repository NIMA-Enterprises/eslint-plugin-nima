import { Messages } from "@models/no-objects-in-deps.model";
import * as NoObjectsInDeps from "@rules/no-objects-in-deps";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-objects-in-deps", NoObjectsInDeps.rule, {
  invalid: [
    // Original test cases
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

    // Array expressions
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

    // New expressions
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

    // Multiple invalid dependencies
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

    // React namespace calls
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

    // Bracket notation calls
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

    // Nested objects
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

    // Variables that are initialized with objects (if your rule checks variable definitions)
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
  ],

  valid: [
    // Original valid cases
    "useEffect(() => {}, [])",
    "useEffect(() => {}, [NIMA])",
    "React.useEffect(() => {}, ['labs'])",
    "React['useMemo'](() => {}, ['labs'])",

    // Primitive values
    "useEffect(() => {}, [123])",
    "useEffect(() => {}, [true])",
    "useEffect(() => {}, [false])",
    "useEffect(() => {}, [null])",
    "useEffect(() => {}, [undefined])",
    "useEffect(() => {}, ['string'])",

    // Variables (assuming they're not initialized with objects)
    "useEffect(() => {}, [variable1, variable2])",
    "useCallback(() => {}, [prop, state])",

    // Mixed valid dependencies
    "useEffect(() => {}, [id, 'constant', 42, isEnabled])",

    // Function calls that aren't hooks with deps
    "someFunction([{ object: 'allowed' }])",
    "notAHook(() => {}, [{ this: 'is fine' }])",

    // Hooks without dependency arrays
    "useEffect(() => {})",
    "useState(0)",
    "useRef(null)",

    // Different hook variations
    "React.useCallback(() => {}, [validVar])",
    "React['useEffect'](() => {}, [primitiveValue])",

    // Functions that return objects but aren't object literals
    "useEffect(() => {}, [getObject()])",
    "useMemo(() => {}, [computeValue()])",

    // Template literals (if supported)
    "useEffect(() => {}, [`template-${variable}`])",

    // Property access
    "useEffect(() => {}, [object.property])",
    "useCallback(() => {}, [state.value, props.id])",

    // Conditional expressions with primitives
    "useEffect(() => {}, [condition ? 'a' : 'b'])",

    // No dependency array (second argument is not an array)
    "useEffect(() => {}, dependency)",
    "useCallback(() => {}, null)",
  ],
});
