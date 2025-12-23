/* Test file for require-chainid-param rule
    This rule ensures functions using simulateContract or readContract from wagmi/actions
    have a chainId parameter and pass it to the function calls.

    Created by: Nima Labs
    Last modified: 2025-12-23

    Tests present: 11
    Invalid tests: 7
    Valid tests: 4
*/

import { Messages, rule } from "@rules/require-chainid-param";
import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("require-chainid-param", rule, {
    invalid: [
        // 1. Missing chainId parameter in function
        {
            code: `
import { simulateContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const myFunction = async ({ amountIn }: { amountIn: bigint }) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId: 1329,
    });
};
            `,
            errors: [
                {
                    messageId: Messages.MISSING_CHAINID_PARAM,
                },
            ],
            output: `
import { simulateContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const myFunction = async ({ amountIn,
    chainId = seiMainnet.id }: { amountIn: bigint;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"] }) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId: 1329,
    });
};
            `,
        },

        // 2. Missing chainId in simulateContract call
        {
            code: `
import { simulateContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const myFunction = async ({ chainId = seiMainnet.id }: { chainId?: (typeof wagmiConfig)["chains"][number]["id"] }) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: [],
        functionName: "test",
    });
};
            `,
            errors: [
                {
                    messageId: Messages.MISSING_CHAINID_IN_CALL,
                },
            ],
            output: `
import { simulateContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const myFunction = async ({ chainId = seiMainnet.id }: { chainId?: (typeof wagmiConfig)["chains"][number]["id"] }) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId
    });
};
            `,
        },

        // 3. Missing seiMainnet import (has wallet-connection import but missing seiMainnet)
        {
            code: `
import { simulateContract } from "wagmi/actions";
import { wagmiConfig } from "wallet-connection";

const myFunction = async ({ chainId }: { chainId: number }) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId,
    });
};
            `,
            errors: [
                {
                    messageId: Messages.MISSING_SEI_MAINNET_IMPORT,
                },
                {
                    messageId: Messages.MISSING_CHAINID_DEFAULT,
                },
            ],
            output: `
import { simulateContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const myFunction = async ({ chainId = seiMainnet.id }: { chainId: number }) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId,
    });
};
            `,
        },

        // 4. Missing wagmiConfig import (has wallet-connection import but missing wagmiConfig)
        {
            code: `
import { readContract } from "wagmi/actions";
import { seiMainnet } from "wallet-connection";

const myFunction = async ({ chainId }: { chainId: number }) => {
    await readContract(config, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId,
    });
};
            `,
            errors: [
                {
                    messageId: Messages.MISSING_WAGMI_CONFIG_IMPORT,
                },
                {
                    messageId: Messages.MISSING_CHAINID_DEFAULT,
                },
            ],
            output: `
import { readContract } from "wagmi/actions";
import { seiMainnet, wagmiConfig } from "wallet-connection";

const myFunction = async ({ chainId = seiMainnet.id }: { chainId: number }) => {
    await readContract(config, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId,
    });
};
            `,
        },

        // 5. Function with readContract missing both chainId param and in call
        {
            code: `
import { readContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const fetchData = async ({ address }: { address: string }) => {
    const result = await readContract(wagmiConfig, {
        address,
        abi: [],
        functionName: "balanceOf",
    });
    return result;
};
            `,
            errors: [
                {
                    messageId: Messages.MISSING_CHAINID_PARAM,
                },
                {
                    messageId: Messages.MISSING_CHAINID_IN_CALL,
                },
            ],
            output: `
import { readContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const fetchData = async ({ address,
    chainId = seiMainnet.id }: { address: string;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"] }) => {
    const result = await readContract(wagmiConfig, {
        address,
        abi: [],
        functionName: "balanceOf",
        chainId
    });
    return result;
};
            `,
        },

        // 6. No wallet-connection import at all
        {
            code: `
import { simulateContract } from "wagmi/actions";

const myFunction = async ({ data }: { data: string }) => {
    await simulateContract(config, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId: 1,
    });
};
            `,
            errors: [
                {
                    messageId: Messages.MISSING_CHAINID_PARAM,
                },
                {
                    messageId: Messages.MISSING_IMPORTS,
                },
            ],
            output: `
import { simulateContract } from "wagmi/actions";
import { seiMainnet, wagmiConfig } from "wallet-connection";

const myFunction = async ({ data,
    chainId = seiMainnet.id }: { data: string;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"] }) => {
    await simulateContract(config, {
        address: "0x123",
        abi: [],
        functionName: "test",
        chainId: 1,
    });
};
            `,
        },

        // 7. Type with explicit semicolons (like Address;) - should maintain semicolon style
        {
            code: `
import type { Address } from "viem";
import { readContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const getUnlocksCounter = async ({
    contractAddress,
}: {
    contractAddress: Address;
}) => {
    const result = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: [],
        functionName: "unlocksCounter",
    });
    return { unlocksLength: Number(result) };
};
            `,
            errors: [
                {
                    messageId: Messages.MISSING_CHAINID_PARAM,
                },
                {
                    messageId: Messages.MISSING_CHAINID_IN_CALL,
                },
            ],
            output: `
import type { Address } from "viem";
import { readContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const getUnlocksCounter = async ({
    contractAddress,
    chainId = seiMainnet.id,
}: {
    contractAddress: Address;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"];
}) => {
    const result = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: [],
        functionName: "unlocksCounter",
        chainId
    });
    return { unlocksLength: Number(result) };
};
            `,
        },
    ],

    valid: [
        // 1. Correct usage with all requirements met
        {
            code: `
import { simulateContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const swapTokens = async ({
    amountIn,
    chainId = seiMainnet.id,
}: {
    amountIn: bigint;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"];
}) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: [],
        functionName: "swap",
        chainId,
    });
};
            `,
        },

        // 2. Correct usage with readContract
        {
            code: `
import { readContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const fetchBalance = async ({
    address,
    chainId = seiMainnet.id,
}: {
    address: string;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"];
}) => {
    const result = await readContract(wagmiConfig, {
        address,
        abi: [],
        functionName: "balanceOf",
        chainId,
    });
    return result;
};
            `,
        },

        // 3. Function without wagmi imports should not trigger the rule
        {
            code: `
import { someOtherFunction } from "some-other-package";

const myFunction = async ({ data }: { data: string }) => {
    await someOtherFunction(data);
};
            `,
        },

        // 4. Multiple wagmi functions with proper chainId usage
        {
            code: `
import { simulateContract, readContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const complexOperation = async ({
    address,
    chainId = seiMainnet.id,
}: {
    address: string;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"];
}) => {
    const balance = await readContract(wagmiConfig, {
        address,
        abi: [],
        functionName: "balanceOf",
        chainId,
    });
    
    await simulateContract(wagmiConfig, {
        address,
        abi: [],
        functionName: "transfer",
        chainId,
    });
    
    return balance;
};
            `,
        },
    ],
});
