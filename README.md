# <div align="center">An ESLint Plugin For NIMA</div>

<div align="center">

[![npm](https://img.shields.io/npm/v/eslint-plugin-nima?logo=npm&cacheSeconds=1800)](https://www.npmjs.com/package/eslint-plugin-nima)
[![main-suite](https://github.com/NIMA-Enterprises/eslint-plugin-nima/actions/workflows/publish.yml/badge.svg)](https://github.com/NIMA-Enterprises/eslint-plugin-nima/actions/workflows/publish.yml)

</div>

## Installation

First, install [ESLint](http://eslint.org):

```bash
pnpm add -D eslint
```

After that's done, install `eslint-plugin-nima`:

```bash
pnpm add -D eslint-plugin-nima
```

**Note:** For simplicity purposes, please don't install eslint globally.

## Recommended Setup

To enable all the _recommended_ rules for this plugin, add the following configuration to your `eslint.config.js`:

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  pluginNIMA.configs["flat/recommended"],
  // Any other config...
];
```

## Custom setup

If you want to manually pick and choose rules, you can load the plugin and configure only the rules you want to use:

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    plugins: {
      nima: pluginNIMA,
    },
    rules: {
      "nima/restrict-console-methods": "error",
    },
  },
  // Any other config...
];
```

You can also use the recommended configuration and override any rule of your choice:

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  {
    ...pluginNIMA.configs["flat/recommended"],
    rules: {
      ...pluginNIMA.configs["flat/recommended"].rules,
      "nima/restrict-console-methods": "off",
    },
  },
  // Any other config...
];
```

This effectively enables all the rules from the recommended configuration and overrides restrict-console-methods by disabling it.

## Rules

You can read more about each rule in the [Rules overview](documentation/index.md) page.

✅ _- Rules included in the recommended configuration._

- ✅ [no-handler-suffix](documentation/rules/no-handler-suffix.md)
- ✅ [restrict-console-methods](documentation/rules/restrict-console-methods.md)
- ✅ [prefer-export-under-component](documentation/rules/prefer-export-under-component.md)
- ✅ [prefer-react-fc](documentation/rules/prefer-react-fc.md)
- [prefer-arrow-functions](documentation/rules/prefer-arrow-functions.md)
- [prefer-react-with-hooks](documentation/rules/prefer-react-with-hooks.md)
- [restrict-function-usage](documentation/rules/restrict-function-usage.md)
- [no-objects-in-deps](documentation/rules/no-objects-in-deps.md)
- [params-naming-convention](documentation/rules/params-naming-convention.md)
- [boolean-naming-convention](documentation/rules/boolean-naming-convention.md)
