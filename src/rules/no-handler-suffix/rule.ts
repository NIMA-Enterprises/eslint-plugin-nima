import { createRule } from "@utility/core";

import { config, defaultOptions, Messages, name, type Options } from "./config";
import { create } from "./create";

export { name };

export const rule = createRule<Options, Messages>({
  create,
  defaultOptions,
  meta: config,
  name,
});
