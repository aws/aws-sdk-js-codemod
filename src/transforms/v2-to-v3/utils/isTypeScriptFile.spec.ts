import { isTypeScriptFile } from "./isTypeScriptFile";

describe(isTypeScriptFile.name, () => {
  it.each([
    [true, "foo.ts"],
    [true, "foo.tsx"],
    [false, "foo.js"],
    [false, "foo.jsx"],
  ])("should return %b for %s", (output, input) => {
    expect(isTypeScriptFile(input)).toBe(output);
  });
});
