import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { isTypeScriptFile } from "./isTypeScriptFile";

describe(isTypeScriptFile.name, () => {
  for (const [output, input] of [
    [true, "foo.ts"],
    [true, "foo.tsx"],
    [false, "foo.js"],
    [false, "foo.jsx"],
  ] as [boolean, string][]) {
    it(`should return ${output} for ${input}`, () => {
      strictEqual(isTypeScriptFile(input), output);
    });
  }
});
