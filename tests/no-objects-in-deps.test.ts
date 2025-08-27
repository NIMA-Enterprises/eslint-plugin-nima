import { Messages } from "@models/no-objects-in-deps.model";
import * as NoObjectsInDeps from "@rules/no-objects-in-deps";
import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
});

ruleTester.run("no-objects-in-deps", NoObjectsInDeps.rule, {
  invalid: [
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
  ],

  valid: [
    "useEffect(() => {}, [])",
    "useEffect(() => {}, [NIMA])",
    "React.useEffect(() => {}, ['labs'])",
    "React['useMemo'](() => {}, ['labs'])",
  ],
});
