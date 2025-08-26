import * as parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";

import * as NoObjectsInDeps from "../../src/rules/no-objects-in-deps";

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
          messageId: "noObjects",
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
          messageId: "noObjects",
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
