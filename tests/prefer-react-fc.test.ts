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
    {
      code: "const Component = () => <div></div>",
      errors: [
        {
          messageId: Messages.REQUIRE_REACT_FC,
        },
      ],
    },
    {
      code: "const MyComponent = () => { return <div>Hello</div>; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
    {
      code: "function AnotherComponent() { return <p>Text</p>; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
    {
      code: "const MyFunc = function() { return <div />; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
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
    {
      code: `
        const TernaryComponent = ({ condition }) => (
          condition ? <div>True</div> : <p>False</p>
        );
      `,
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
    {
      code: `
        const LogicalComponent = ({ condition }) => (
          condition && <div>Render this</div>
        );
      `,
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
    {
      code: "export default function DefaultComponent() { return <div />; }",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
    {
      code: "export const ExportedComponent = () => <div />; ",
      errors: [{ messageId: Messages.REQUIRE_REACT_FC }],
    },
  ],
  valid: [
    "const Component:React.FC = () => <div></div>",
    "const MyComponent: React.FunctionComponent = () => <div />",
    "const AnotherComponent: FC = () => <div />",
    "function FunctionalComponent(): React.FC { return <div></div>; }",
    "function MyFunc(): FC { return <div />; }",
    "const CustomComponent: PropsComponent = (props) => <div></div>",
    {
      code: `
        import { MyComponentType } from "./types";
        const MyComponent: MyComponentType = (props) => <div />;
      `,
    },
    {
      code: `
        const MyComponent: { (props: MyProps): JSX.Element } = () => <div />;
      `,
    },
    "function notAComponent() { return 'hello'; }",
    "const notAComponent = () => 'hello';",
    "const notAComponent = () => { return 1; };",
    "const A = 10;",
  ],
});
