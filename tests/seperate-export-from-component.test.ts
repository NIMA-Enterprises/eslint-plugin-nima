import { Messages } from "@models/prefer-export-under-component";
import * as PreferNamedExport from "@rules/prefer-export-under-component";
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

ruleTester.run("prefer-export-under-component", PreferNamedExport.rule, {
  invalid: [
    {
      code: "export const NIMALabs = () => <div></div>",
      errors: [
        {
          messageId: Messages.SEPARATE_COMPONENT_EXPORT,
        },
      ],
      output: "const NIMALabs = () => <div></div>\n\nexport { NIMALabs };",
    },
    {
      code: "export const NIMALabs = function() { return <div></div> }",
      errors: [
        {
          messageId: Messages.SEPARATE_COMPONENT_EXPORT,
        },
      ],
      output:
        "const NIMALabs = function() { return <div></div> }\n\nexport { NIMALabs };",
    },
    {
      code: "export function NIMALabs() { return <div></div> }",
      errors: [
        {
          messageId: Messages.SEPARATE_COMPONENT_EXPORT,
        },
      ],
      output:
        "function NIMALabs() { return <div></div> }\n\nexport { NIMALabs };",
    },
    {
      code: "export default function NIMALabs() { return <div></div> }",
      errors: [
        {
          messageId: Messages.SEPARATE_COMPONENT_EXPORT,
        },
      ],
      output:
        "function NIMALabs() { return <div></div> }\n\nexport { NIMALabs };",
    },
  ],
  valid: ["const NIMALabs = () => <div></div>;\n\nexport { NIMALabs }"],
});
