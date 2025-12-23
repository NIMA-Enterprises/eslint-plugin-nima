import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const name = "require-chainid-param";

export const enum Messages {
    MISSING_CHAINID_DEFAULT = "MISSING_CHAINID_DEFAULT",
    MISSING_CHAINID_IN_CALL = "MISSING_CHAINID_IN_CALL",
    MISSING_CHAINID_PARAM = "MISSING_CHAINID_PARAM",
    MISSING_IMPORTS = "MISSING_IMPORTS",
    MISSING_SEI_MAINNET_IMPORT = "MISSING_SEI_MAINNET_IMPORT",
    MISSING_WAGMI_CONFIG_IMPORT = "MISSING_WAGMI_CONFIG_IMPORT",
}

export type Options = [
    Partial<{
        chainIdType: string;
        defaultChainId: string;
        functionNames: string[];
        importSource: string;
    }>,
];

type ExtendedPluginProperties = {
    recommended: boolean;
};

export const config: {
    docs: ExtendedPluginProperties &
        RuleModule<Messages, Options>["meta"]["docs"];
} & Omit<RuleModule<Messages, Options>["meta"], "defaultOptions"> = {
    docs: {
        description:
            "Require chainId parameter in functions that use simulateContract or readContract from wagmi/actions.",
        recommended: true,
        url: "https://github.com/NIMA-Enterprises/eslint-plugin-nima/blob/main/documentation/rules/require-chainid-param.md",
    },
    fixable: "code",
    messages: {
        [Messages.MISSING_CHAINID_DEFAULT]:
            "NIMA: chainId parameter should have a default value of seiMainnet.id.",
        [Messages.MISSING_CHAINID_IN_CALL]:
            "NIMA: {{ functionName }} call should include chainId in its options.",
        [Messages.MISSING_CHAINID_PARAM]:
            "NIMA: Function using {{ functionName }} should have a chainId parameter with type `(typeof wagmiConfig)['chains'][number]['id']`.",
        [Messages.MISSING_IMPORTS]:
            "NIMA: Missing required imports (seiMainnet, wagmiConfig) from 'wallet-connection'.",
        [Messages.MISSING_SEI_MAINNET_IMPORT]:
            "NIMA: Add 'seiMainnet' to the existing 'wallet-connection' import.",
        [Messages.MISSING_WAGMI_CONFIG_IMPORT]:
            "NIMA: Add 'wagmiConfig' to the existing 'wallet-connection' import.",
    },
    schema: [
        {
            additionalProperties: false,
            description: "Configuration for require-chainid-param rule",
            properties: {
                chainIdType: {
                    description:
                        "The type for chainId parameter (default: (typeof wagmiConfig)['chains'][number]['id'])",
                    type: "string",
                },
                defaultChainId: {
                    description:
                        "The default chainId value to use (default: seiMainnet.id)",
                    type: "string",
                },
                functionNames: {
                    description:
                        "Function names to check for (default: simulateContract, readContract)",
                    items: {
                        type: "string",
                    },
                    type: "array",
                },
                importSource: {
                    description:
                        "The import source for wagmi actions (default: wagmi/actions)",
                    type: "string",
                },
            },
            type: "object",
        },
    ],
    type: "suggestion",
};

export const defaultOptions: Options = [
    {
        chainIdType: '(typeof wagmiConfig)["chains"][number]["id"]',
        defaultChainId: "seiMainnet.id",
        functionNames: ["simulateContract", "readContract"],
        importSource: "wagmi/actions",
    },
];
