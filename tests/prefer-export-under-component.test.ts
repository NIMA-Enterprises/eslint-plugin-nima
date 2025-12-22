/* Test file for prefer-export-under-component rule
    Comments indicate the test number and purpose to help identify tests

    Created by: Nima Labs
    Last modified: 2025-10-01

    Tests present: 11
    Invalid tests: 6
    Valid tests: 5
*/

import { Messages, rule } from "@rules/prefer-export-under-component";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: { jsx: true },
        },
    },
});

ruleTester.run("prefer-export-under-component", rule, {
    invalid: [
        {
            code: `export const MyComponent = () => {
          return <div>Hello</div>;
        };`,
            errors: [
                {
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                },
            ],
            output: `const MyComponent = () => {
          return <div>Hello</div>;
        };\n\nexport { MyComponent };`,
        },

        {
            code: `export default function MyComponent() {
          return <div>Hello</div>;
        }`,
            errors: [
                {
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                },
            ],
            output: `function MyComponent() {
          return <div>Hello</div>;
        }\n\nexport { MyComponent };`,
        },

        {
            code: `export const Button = ({ children }) => {
                return <button>{children}</button>;
              };`,
            errors: [
                {
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                },
            ],
            output: `const Button = ({ children }) => {
                return <button>{children}</button>;
              };\n\nexport { Button };`,
        },

        {
            code: `
        export const Header = () => <h1>Title</h1>;
        export const Footer = () => <footer>End</footer>;
      `,
            errors: [
                {
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                },
                {
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                },
            ],
            output: `
        const Header = () => <h1>Title</h1>;\n\nexport { Header };
        const Footer = () => <footer>End</footer>;\n\nexport { Footer };
      `,
        },

        {
            code: `
        interface Props {
          title: string;
        }
        export const Component: React.FC<Props> = ({ title }) => {
          return <h1>{title}</h1>;
        };
      `,
            errors: [
                {
                    messageId: Messages.EXPORT_BELOW_COMPONENT,
                },
            ],
            output: `
        interface Props {
          title: string;
        }
        const Component: React.FC<Props> = ({ title }) => {
          return <h1>{title}</h1>;
        };\n\nexport { Component };
      `,
        },
    ],

    valid: [
        `
      const MyComponent = () => {
        return <div>Hello</div>;
      };\n\nexport { MyComponent };
    `,

        `
      function MyComponent() {
        return <div>Hello</div>;
      }\n\nexport default MyComponent;
    `,

        `
      const Header = () => <h1>Title</h1>;
      const Footer = () => <footer>End</footer>;
      export { Header, Footer };
    `,

        `
      export const API_URL = 'https://api.example.com';
      export const utils = { helper: () => {} };
    `,

        `
      export const CONFIG = { api: 'url' };
      const MyComponent = () => <div>Component</div>;
export { MyComponent };
    `,
    ],
});
