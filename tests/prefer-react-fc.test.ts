/*  Test file for prefer-react-fc rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 12
    Invalid tests: 6
    Valid tests: 6
*/

import { Messages, rule } from "@rules/prefer-react-fc";
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

ruleTester.run("prefer-react-fc", rule, {
  invalid: [
    // Arrow function component without React.FC
    {
      code: "const Component = () => <div></div>",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // Function declaration component without React.FC
    {
      code: "function MyComponent() { return <div>Hello</div>; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // Function expression component without React.FC
    {
      code: "const MyFunc = function() { return <div />; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // Conditional rendering component without React.FC
    {
      code: `
        const ConditionalComponent = ({ condition }) => (
          condition ? <div>True</div> : <p>False</p>
        );
      `,
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // Export default component without React.FC
    {
      code: "export default function DefaultComponent() { return <div />; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },

    // Exported arrow component without React.FC
    {
      code: "export const ExportedComponent = () => <div />;",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
  ],

  valid: [
    // Arrow function component with React.FC
    "const Component: React.FC = () => <div></div>",

    // Arrow function component with React.FunctionComponent
    "const MyComponent: React.FunctionComponent = () => <div />",

    // Arrow function component with FC alias
    "const AnotherComponent: FC = () => <div />",

    // Custom component type annotation
    "const CustomComponent: PropsComponent = (props) => <div></div>",

    // Function returning non-JSX (should not trigger)
    "function notAComponent() { return 'hello'; }",

    // Arrow function returning non-JSX (should not trigger)
    "const notAComponent = () => 42;",
  ],
});
