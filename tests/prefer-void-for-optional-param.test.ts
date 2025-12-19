import { Messages } from "@models/prefer-void-for-optional-param.model";
import { name, rule } from "@rules/prefer-void-for-optional-param";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  invalid: [
    {
      code: `
        const fn = ({ a, b }: { a?: number; b?: string }) => {
          console.log(a, b);
        };
      `,
      errors: [{ messageId: Messages.ADD_VOID_UNION }],
      output: `
        const fn = (props: { a?: number; b?: string } | void) => {

  const { a, b } = props ?? {};
  console.log(a, b);
        };
      `,
    },
    {
      code: `
        const fn = ({ a, b }: { a?: number; b?: string } | void) => {
          console.log(a, b);
        };
      `,
      errors: [{ messageId: Messages.PREFER_VOID_FOR_OPTIONAL_PARAM }],
      output: `
        const fn = (props: { a?: number; b?: string } | void) => {

  const { a, b } = props ?? {};
  console.log(a, b);
        };
      `,
    },
    {
      code: `
        function fn({ a, b, c }: { a?: number; b?: string; c?: boolean } | void) {
          return a;
        }
      `,
      errors: [{ messageId: Messages.PREFER_VOID_FOR_OPTIONAL_PARAM }],
      output: `
        function fn(props: { a?: number; b?: string; c?: boolean } | void) {

  const { a, b, c } = props ?? {};
  return a;
        }
      `,
    },
    {
      code: `
        const fn = ({ a, b }: { a?: number; b?: string }) => a + (b?.length ?? 0);
      `,
      errors: [{ messageId: Messages.ADD_VOID_UNION }],
      output: `
        const fn = (props: { a?: number; b?: string } | void) => {
  const { a, b } = props ?? {};
  return a + (b?.length ?? 0);
};
      `,
    },
    {
      code: `
        export const truncateSeiAddress = ({
          address,
          numOfChars = 4,
        }: {
          address?: string;
          numOfChars?: number;
        }) => {
          return address?.slice(0, numOfChars);
        };
      `,
      errors: [{ messageId: Messages.ADD_VOID_UNION }],
      output: `
        export const truncateSeiAddress = (props: {
          address?: string;
          numOfChars?: number;
        } | void) => {

  const { address, numOfChars = 4 } = props ?? {};
  return address?.slice(0, numOfChars);
        };
      `,
    },
    {
      code: `
        const transformData = (
          { tokenAddress }: { tokenAddress?: Address } | undefined = {},
        ) => {
          return data.filter(item => item.address === tokenAddress);
        };
      `,
      errors: [{ messageId: Messages.PREFER_VOID_FOR_OPTIONAL_PARAM }],
      output: `
        const transformData = (
          props: { tokenAddress?: Address } | undefined | void = {},
        ) => {

  const { tokenAddress } = props ?? {};
  return data.filter(item => item.address === tokenAddress);
        };
      `,
    },
    {
      code: `
        const transformData = (
          data,
          { tokenAddress }: { tokenAddress?: Address } | undefined = {},
        ) => {
          return data.filter(item => item.address === tokenAddress);
        };
      `,
      errors: [{ messageId: Messages.PREFER_VOID_FOR_OPTIONAL_PARAM }],
      output: `
        const transformData = (
          data,
          props: { tokenAddress?: Address } | undefined | void = {},
        ) => {

  const { tokenAddress } = props ?? {};
  return data.filter(item => item.address === tokenAddress);
        };
      `,
    },
    {
      code: `
        class MyClass {
          method({ a }: { a?: number }) {
            return a;
          }
        }
      `,
      errors: [{ messageId: Messages.ADD_VOID_UNION }],
      output: `
        class MyClass {
          method(props: { a?: number } | void) {

  const { a } = props ?? {};
  return a;
          }
        }
      `,
    },
    {
      code: `
        const obj = {
          method({ a }: { a?: number }) {
            return a;
          }
        };
      `,
      errors: [{ messageId: Messages.ADD_VOID_UNION }],
      output: `
        const obj = {
          method(props: { a?: number } | void) {

  const { a } = props ?? {};
  return a;
          }
        };
      `,
    },
    {
      code: `
        const handleData = ({ id, value }: { id?: string; value?: number } = {}) => {
          console.log(id, value);
        };
      `,
      errors: [{ messageId: Messages.ADD_VOID_UNION }],
      output: `
        const handleData = (props: { id?: string; value?: number } | void = {}) => {

  const { id, value } = props ?? {};
  console.log(id, value);
        };
      `,
    },
    {
      code: `
        const getAxiosRequestConfig = ({ type }: { type?: string } = {}) => ({
          url: 'https://api.example.com/transactions',
          params: { type },
        });
      `,
      errors: [{ messageId: Messages.ADD_VOID_UNION }],
      output: `
        const getAxiosRequestConfig = (props: { type?: string } | void) => {
  const { type } = props ?? {};
  return {
          url: 'https://api.example.com/transactions',
          params: { type },
        };
};
      `,
    },
  ],
  valid: [
    {
      code: `
        const fn = (props: { a?: number; b?: string } | void) => {
          const { a, b } = props ?? {};
        };
      `,
    },
    {
      code: `
        function fn(props: { a?: number; b?: string } | void) {
          const { a, b } = props ?? {};
        }
      `,
    },
    {
      code: `
        const fn = (a: number, b: string) => {
          return a + b;
        };
      `,
    },
    {
      code: `
        const fn = (a: number) => {
          return a * 2;
        };
      `,
    },
    {
      code: `
        const fn = () => {
          return 42;
        };
      `,
    },
    {
      code: `
        const signUserWalletAndTwitter = async ({
          userAddress,
          signerAddress,
        }: {
          userAddress: Address;
          signerAddress: Address;
        }) => {
          return userAddress + signerAddress;
        };
      `,
    },
    {
      code: `
        const processData = ({ id, name }: { id: number; name: string }) => {
          return { id, name };
        };
      `,
    },
    {
      code: `
        const multicall = async ({
          contractAddress,
          callData,
          value,
        }: {
          contractAddress: Address;
          callData: Hex[];
          value?: bigint;
        }) => {
          return { contractAddress, callData, value };
        };
      `,
    },
    {
      code: `
        const mixedProps = ({ required, optional }: { required: string; optional?: number }) => {
          return required;
        };
      `,
    },
    {
      code: `
        class MyClass {
          method(props: { a?: number } | void) {
            const { a } = props ?? {};
            return a;
          }
        }
      `,
    },
    {
      code: `
        const obj = {
          method(props: { a?: number } | void) {
            const { a } = props ?? {};
            return a;
          }
        };
      `,
    },
  ],
});
