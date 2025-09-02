/*  Test file for prefer-react-fc rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 20
    Invalid tests: 10
    Valid tests: 10
*/

import { Messages } from "@models/prefer-react-fc.model";
import * as PreferReactFc from "@rules/prefer-react-fc";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
      tsconfigRootDir: __dirname,
    },
  },
});

ruleTester.run("prefer-react-fc", PreferReactFc.rule, {
  invalid: [
    // === ARROW FUNCTION COMPONENTS ===

    // 1. Arrow function component without React.FC
    {
      code: "const Component = () => <div></div>",
      errors: [
        {
          messageId: Messages.REQUIRE_REACT_FC,
        },
      ],
    },

    // 2. Arrow function component with return statement, missing React.FC
    {
      code: "const MyComponent = () => { return <div>Hello</div>; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // === FUNCTION DECLARATION COMPONENTS ===

    // 3. Function declaration component without React.FC
    {
      code: "function AnotherComponent() { return <p>Text</p>; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // === FUNCTION EXPRESSION COMPONENTS ===

    // 4. Function expression assigned to const, missing React.FC
    {
      code: "const MyFunc = function() { return <div />; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // === CONDITIONAL RENDERING COMPONENTS ===

    // 5. Function declaration with conditional rendering, missing React.FC
    {
      code: `
        function ConditionalComponent({ condition }) {
          if (condition) {
            return <div>True</div>;
          }
          return <p>False</p>;
        }
      `,
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // 6. Arrow function with ternary rendering, missing React.FC
    {
      code: `
        const TernaryComponent = ({ condition }) => (
          condition ? <div>True</div> : <p>False</p>
        );
      `,
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // 7. Arrow function with logical rendering, missing React.FC
    {
      code: `
        const LogicalComponent = ({ condition }) => (
          condition && <div>Render this</div>
        );
      `,
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // === EXPORTS ===

    // 8. Export default function component, missing React.FC
    {
      code: "export default function DefaultComponent() { return <div />; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // 9. Exported arrow function component, missing React.FC
    {
      code: "export const ExportedComponent = () => <div />; ",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
  ],
  valid: [
    // === VALID COMPONENTS WITH REACT.FC OR EQUIVALENT ===

    // 10. Arrow function component with React.FC
    "const Component:React.FC = () => <div></div>",

    // 11. Arrow function component with React.FunctionComponent
    "const MyComponent: React.FunctionComponent = () => <div />",

    // 12. Arrow function component with FC alias
    "const AnotherComponent: FC = () => <div />",

    // 13. Function declaration with React.FC return type
    "function FunctionalComponent(): React.FC { return <div></div>; }",

    // 14. Function declaration with FC return type
    "function MyFunc(): FC { return <div />; }",

    // 15. Custom component type annotation
    "const CustomComponent: PropsComponent = (props) => <div></div>",

    // 16. Imported custom component type
    `import { MyComponentType } from "./types";
    const MyComponent: MyComponentType = (props) => <div />;
`,

    // 17. Inline function type annotation
    "MyComponent: { (props: MyProps): JSX.Element } = () => <div />;",

    // === NON-COMPONENT FUNCTIONS (SHOULD NOT TRIGGER) ===

    // 18. Function returning string
    "function notAComponent() { return 'hello'; }",

    // 19. Arrow function returning string
    "const notAComponent = () => 'hello';",

    // 20. Arrow function returning number
    "const notAComponent = () => { return 1; };",
  ],
});
