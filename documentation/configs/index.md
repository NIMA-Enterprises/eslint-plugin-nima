# Plugin Configurations

This document outlines the available configurations for `eslint-plugin-nima` and the rules included in each.

---

## Available Configurations

### `recommended`

The recommended configuration includes a curated set of rules that provide immediate value for most TypeScript/React projects. These rules help maintain code quality, consistency, and best practices.

#### Included Rules

| Rule                                 | Severity | Description                                                                                   |
| ------------------------------------ | -------- | --------------------------------------------------------------------------------------------- |
| `nima/no-handler-suffix`             | `error`  | Prevents using `-Handler` suffix in function names to encourage more semantic naming          |
| `nima/prefer-export-under-component` | `error`  | Enforces exporting components directly under the component definition for better organization |
| `nima/prefer-react-fc`               | `warn`   | Suggests using React.FC type annotation for functional components                             |
| `nima/restrict-console-methods`      | `error`  | Restricts console method usage to maintain clean production code                              |

#### Usage

**Flat ESLint Config (eslint.config.js)**

```js
import pluginNima from "eslint-plugin-nima";

export default [
  {
    ...pluginNima.configs["flat/recommended"],
  },
];
```

**Legacy ESLint Config (.eslintrc.json)**

```json
{
  "extends": ["plugin:nima/recommended"]
}
```

---

## Other Available Rules

The following rules are available in the plugin but not included in the recommended configuration. You can enable them individually based on your project's needs:

- `nima/boolean-naming-convention` - Enforces boolean naming with prefixes like `is`, `has`, `can`
- `nima/params-naming-convention` - Enforces parameter naming conventions
- `nima/prefer-arrow-functions` - Prefers arrow function syntax over traditional functions
- `nima/prefer-react-with-hooks` - Encourages using React hooks patterns
- `nima/restrict-function-usage` - Allows restricting specific functions in targeted files/folders

### Adding Individual Rules

To use rules not included in the recommended config:

```js
// Flat config
export default [
  {
    ...pluginNima.configs["flat/recommended"],
    rules: {
      ...pluginNima.configs["flat/recommended"].rules,
      "nima/boolean-naming-convention": "error",
      "nima/restrict-function-usage": [
        "error",
        [{ disableFunctions: ["eval"], folders: ["**/src/**"] }],
      ],
    },
  },
];
```

```json
// Legacy config
{
  "extends": ["plugin:nima/recommended"],
  "rules": {
    "nima/boolean-naming-convention": "error",
    "nima/restrict-function-usage": [
      "error",
      [{ "disableFunctions": ["eval"], "folders": ["**/src/**"] }]
    ]
  }
}
```

---

## Configuration Philosophy

The recommended configuration follows these principles:

- **Quality over Quantity**: Includes only rules that provide clear, immediate value
- **Minimal Setup**: Works out-of-the-box for most TypeScript/React projects
- **Sensible Defaults**: Uses appropriate severity levels (`error` for code issues, `warn` for suggestions)
- **Non-Breaking**: Avoids rules that might cause excessive noise in existing codebases

---

## Future Configurations

Additional configurations may be added in future versions based on community feedback and common usage patterns. Potential configurations could include:

- **`strict`** - All rules enabled with stricter settings
- **`react`** - React-specific rules only
- **`typescript`** - TypeScript-focused rules only

---
