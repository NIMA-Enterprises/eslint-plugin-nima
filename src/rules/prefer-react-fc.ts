import { Messages, type Options } from "@models/prefer-react-fc.model";
import { createRule } from "@utility/core";

import {
  preferReactFcConfig,
  preferReactFcDefaultOptions,
} from "./prefer-react-fc.config";
import { createPreferReactFcRule } from "./prefer-react-fc.create";

export const name = "prefer-react-fc";

export const rule = createRule<Options, Messages>({
  create: createPreferReactFcRule,
  defaultOptions: preferReactFcDefaultOptions,
  meta: preferReactFcConfig,
  name,
});
