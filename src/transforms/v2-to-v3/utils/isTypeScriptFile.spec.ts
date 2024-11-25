import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { isTypeScriptFile } from "./isTypeScriptFile/index.ts";

describe(isTypeScriptFile.name, () => {
  for (const [output, input] of [
    [true, "foo.ts"],
    [true, "foo.tsx"],
    [false, "foo.js"],
    [false, "foo.jsx"],
  ] as const) {
    it(`should return ${output} for ${input}`, () => {
      strictEqual(isTypeScriptFile(input), output);
    });
  }
});
