# require-chainid-param

Require `chainId` parameter in functions that use `simulateContract` or `readContract` from `wagmi/actions`.

## Rule Details

This rule enforces that any function using `simulateContract` or `readContract` from `wagmi/actions` must:

1. Have a `chainId` parameter with the type `(typeof wagmiConfig)["chains"][number]["id"]`
2. Pass the `chainId` to the wagmi function call
3. Import `seiMainnet` and `wagmiConfig` from `wallet-connection`

This ensures consistent chain ID handling across all wagmi contract interactions and prevents hardcoded chain IDs.

## Examples

### ❌ Incorrect

```typescript
// Missing chainId parameter
import { simulateContract } from "wagmi/actions";
import { wagmiConfig } from "wallet-connection";

const swapTokens = async ({ amountIn }: { amountIn: bigint }) => {
    await simulateContract(wagmiConfig, {
        address: "0x123",
        abi: routerAbi,
        functionName: "swap",
        chainId: 1329, // Hardcoded chainId
    });
};
```

```typescript
// Missing chainId in call options
import { readContract } from "wagmi/actions";
import { wagmiConfig, seiMainnet } from "wallet-connection";

const fetchBalance = async ({
    address,
    chainId = seiMainnet.id,
}: {
    address: string;
    chainId?: (typeof wagmiConfig)["chains"][number]["id"];
}) => {
    await readContract(wagmiConfig, {
        address,
        abi: tokenAbi,
        functionName: "balanceOf",
        // Missing chainId!
    });
};
```

### ✅ Correct

```typescript
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
        abi: routerAbi,
        functionName: "swap",
        chainId,
    });
};
```

```typescript
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
        abi: tokenAbi,
        functionName: "balanceOf",
        chainId,
    });
    return result;
};
```

## Options

This rule accepts an options object with the following properties:

```typescript
{
    // Function names to check for (default: ["simulateContract", "readContract"])
    functionNames?: string[];
    
    // The import source for wagmi actions (default: "wagmi/actions")
    importSource?: string;
    
    // The default chainId value to use (default: "seiMainnet.id")
    defaultChainId?: string;
    
    // The type for chainId parameter (default: "(typeof wagmiConfig)['chains'][number]['id']")
    chainIdType?: string;
}
```

### Example Configuration

```json
{
    "rules": {
        "nima/require-chainid-param": ["error", {
            "functionNames": ["simulateContract", "readContract", "writeContract"],
            "importSource": "wagmi/actions"
        }]
    }
}
```

## When Not To Use It

If your application only targets a single chain and you don't need the flexibility of switching chains at runtime, you may not need this rule.

## Further Reading

- [wagmi Documentation](https://wagmi.sh/)
- [Viem Chain Types](https://viem.sh/docs/chains/introduction.html)
