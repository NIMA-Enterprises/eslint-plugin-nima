<div align="center">

[![npm](https://img.shields.io/npm/v/eslint-plugin-nima?logo=npm&cacheSeconds=1800)](https://www.npmjs.com/package/eslint-plugin-nima)
[![main-suite](https://github.com/NIMA-Enterprises/eslint-plugin-nima/actions/workflows/publish.yml/badge.svg)](https://github.com/NIMA-Enterprises/eslint-plugin-nima/actions/workflows/publish.yml)

</div>

An **ESLint plugin** that enforces conventions, prevents common mistakes, and speeds up code reviews at NIMA.  
It includes opinionated rules for naming, React, parameters, and restrictions on unsafe patterns.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Recommended setup](#recommended-setup)
  - [Custom setup](#custom-setup)
- [Rules](#rules)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

First, install [ESLint](http://eslint.org):

```bash
pnpm add -D eslint
```

Then install `eslint-plugin-nima`:

```bash
pnpm add -D eslint-plugin-nima
```

> **Note**: Don’t install ESLint globally. Keep it project-local for consistent results.

---

## Usage

You can enable this plugin in two ways: using the **recommended setup** or a **custom setup**.

### Recommended setup

Add the following to your `eslint.config.js`:

```js
import pluginNIMA from "eslint-plugin-nima";

export default [
  pluginNIMA.configs["flat/recommended"],
  // Any other config...
];
```

This enables the recommended set of rules we’ve curated for most NIMA projects.

### Custom setup

If you prefer to configure rules manually, load the plugin and specify only the rules you want:

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
];
```

You can also extend the recommended config and override specific rules:

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
];
```

---

## Rules

Each rule has three levels of explanation:

- **Short**: one-liner summary (good for quick scanning).
- **Medium**: sentences with examples (on the overview page).
- **Full**: dedicated docs per rule.

Before diving deep into what each rule does, I recommend readign the [Rule Overview Page](documentation/rules/index.md) where you can read a little bit about each rule and then you can see which one you want to dig into.

The plugin currently provides these rules:

- [no-handler-suffix](documentation/rules/no-handler-suffix.md)
- [restrict-console-methods](documentation/rules/restrict-console-methods.md)
- [prefer-export-under-component](documentation/rules/prefer-export-under-component.md)
- [prefer-react-fc](documentation/rules/prefer-react-fc.md)
- [prefer-arrow-functions](documentation/rules/prefer-arrow-functions.md)
- [prefer-react-with-hooks](documentation/rules/prefer-react-with-hooks.md)
- [restrict-function-usage](documentation/rules/restrict-function-usage.md)
- [no-objects-in-deps](documentation/rules/no-objects-in-deps.md)
- [params-naming-convention](documentation/rules/params-naming-convention.md)
- [boolean-naming-convention](documentation/rules/boolean-naming-convention.md)

See the full [Rules overview](documentation/rules/index.md).

---

## Configurations

There's also pre-built configurations:

- [recommended](documentation/configs/index.md)

## License

[MIT](LICENSE)
