import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: package.json will be imported from dist folders
import { version } from "../../package.json"; // eslint-disable-line
import { run } from "../cli";

jest.mock("child_process");

describe("cli", () => {
  const jscodeshiftPath = "./node_modules/.bin/jscodeshift";

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
    expect(spawn).toHaveBeenCalledWith(jscodeshiftPath, mockArgs, { stdio: "inherit" });
  });

  it("should pass args to jscodeshift", async () => {
    const mockArgs = ["random", "args", "one", "two", "three"];
    await run(mockArgs);
    expect(spawn).toHaveBeenCalledWith(jscodeshiftPath, mockArgs, { stdio: "inherit" });
  });
});
