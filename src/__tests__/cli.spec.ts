import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../../package.json"; // eslint-disable-line
import { run } from "../cli";

jest.mock("child_process");

describe("cli", () => {
  const verifySpawnCall = (args: string[]) => {
    expect(spawn).toHaveBeenCalledWith("npm", ["exec", "jscodeshift", "--", ...args], {
      stdio: "inherit",
      shell: process.platform == "win32",
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should print aws-sdk-js-codemod version", async () => {
    jest.spyOn(process.stdout, "write");

    const mockArgs = ["--version"];
    await run(mockArgs);

    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringMatching(`aws-sdk-js-codemod: ${version}`)
    );
    verifySpawnCall(mockArgs);
  });

  it("should pass args to jscodeshift", async () => {
    const mockArgs = ["random", "args", "one", "two", "three"];
    await run(mockArgs);
    verifySpawnCall(mockArgs);
  });
});
