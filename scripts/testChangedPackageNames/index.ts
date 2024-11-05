import { exec } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { CLIENT_PACKAGE_NAMES_MAP as PACKAGE_NAMES_MAP_TO_PUBLISH } from "../../src/transforms/v2-to-v3/config";

const execAsync = promisify(exec);

(async () => {
  // Create temporary directory
  const tempDir = await mkdtemp(join(tmpdir(), "testChangedPackageNames-"));
  await execAsync("npm install aws-sdk-js-codemod@latest", { cwd: tempDir });

  const { CLIENT_PACKAGE_NAMES_MAP: PACKAGE_NAMES_MAP_LATEST } = await import(
    join(tempDir, "node_modules/aws-sdk-js-codemod/dist/transforms/v2-to-v3/config")
  );

  const changedPackageNames = Object.keys(PACKAGE_NAMES_MAP_TO_PUBLISH)
    .filter((key) => PACKAGE_NAMES_MAP_TO_PUBLISH[key] !== PACKAGE_NAMES_MAP_LATEST[key])
    .map((key) => PACKAGE_NAMES_MAP_TO_PUBLISH[key]);

  console.log(`Changed package names: ${changedPackageNames.join(", ")}`);
  for (const packageName of changedPackageNames) {
    const npmPackageName = `@aws-sdk/${packageName}`;
    await execAsync(`npm show ${npmPackageName} version`);
    console.log(`${npmPackageName} exists`);
  }
})();
