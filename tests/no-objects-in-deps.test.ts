/*  Test file for no-objects-in-deps rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 16
    Invalid tests: 9
    Valid tests: 7
*/

import { Messages, rule } from "@rules/no-objects-in-deps";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("no-objects-in-deps", rule, {
    invalid: [
        // Object literal in dependency array
        {
            code: "useEffect(() => {}, [{ NIMA: 'labs' }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
        },

        // New expression in dependency array
        {
            code: "useEffect(() => {}, [new Date()])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
        },

        // useCallback with object
        {
            code: "useCallback(() => {}, [{ NIMA: 'Enterprises' }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
        },

        // Multiple invalid dependencies
        {
            code: "useEffect(() => {}, [{ foo: 'bar' }, new Set()])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
        },

        // React namespace with object
        {
            code: "React.useEffect(() => {}, [{ test: true }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
        },

        // Bracket notation with object
        {
            code: "React['useCallback'](() => {}, [{ key: 'value' }])",
            errors: [
                {
                    messageId: Messages.NO_OBJECTS_IN_DEPENDENCIES,
                },
            ],
        },
    ],

    valid: [
        // Empty dependency array
        "useEffect(() => {}, [])",

        // Primitive values in dependencies
        "useEffect(() => {}, [variable, 123, true, 'string'])",

        // React namespace with variables
        "React.useEffect(() => {}, [validVar])",

        // Property access (allowed)
        "useEffect(() => {}, [object.property])",

        // Function calls (allowed)
        "useEffect(() => {}, [getObject()])",

        // Not a hook - objects allowed
        "someFunction([{ object: 'allowed' }])",

        // Hook without dependency array
        "useEffect(() => {})",

        // Arrays are allowed (they're not problematic in deps)
        "useEffect(() => {}, [[1, 2, 3]])",

        // Array variables are allowed
        "useMemo(() => {}, [['a', 'b']])",

        // Functions in deps are allowed
        "useEffect(() => {}, [() => {}])",
    ],
});
