import { exec } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import {
  CLIENT_NAMES_MAP as CLIENT_NAMES_MAP_TO_PUBLISH,
  CLIENT_PACKAGE_NAMES_MAP as PACKAGE_NAMES_MAP_TO_PUBLISH,
} from "../../src/transforms/v2-to-v3/config/index.ts";

const execAsync = promisify(exec);

(async () => {
  // Create temporary directory
  const tempDirCodemod = await mkdtemp(join(tmpdir(), "codemod-"));
  await execAsync("npm install aws-sdk-js-codemod@latest", { cwd: tempDirCodemod });

  const { CLIENT_NAMES_MAP, CLIENT_PACKAGE_NAMES_MAP } = await import(
    join(tempDirCodemod, "node_modules/aws-sdk-js-codemod/dist/transforms/v2-to-v3/config")
  );

  const changedPackages = Object.entries(PACKAGE_NAMES_MAP_TO_PUBLISH).filter(
    ([key]) => PACKAGE_NAMES_MAP_TO_PUBLISH[key] !== CLIENT_PACKAGE_NAMES_MAP[key]
  );

  const changedPackageNames = Object.values(changedPackages);
  console.log(`Changed package names: [ ${changedPackageNames.join(", ")} ]`);
  for (const packageName of changedPackageNames) {
    const npmPackageName = `@aws-sdk/${packageName}`;
    await execAsync(`npm show ${npmPackageName} version`);
    console.log(`${npmPackageName} exists`);
  }

  const changedClients = Object.entries(CLIENT_NAMES_MAP_TO_PUBLISH).filter(
    ([key]) => CLIENT_NAMES_MAP_TO_PUBLISH[key] !== CLIENT_NAMES_MAP[key]
  );

  console.log(`Changed clients: [ ${changedClients.map(([, value]) => value).join(", ")} ]`);
  for (const [clientKey, clientName] of changedClients) {
    const npmPackageName = `@aws-sdk/${PACKAGE_NAMES_MAP_TO_PUBLISH[clientKey]}`;
    const tempDirClient = await mkdtemp(join(tmpdir(), "codemod-"));

    const execOptions = { cwd: tempDirClient };
    await execAsync(`npm install ${npmPackageName}`, execOptions);
    await execAsync(
      `echo 'import { ${clientName} } from "${npmPackageName}"' > index.mjs`,
      execOptions
    );
    await execAsync("node index.mjs", execOptions);
    console.log(`Client '${clientName}' exists in '${npmPackageName}'.`);
  }
})();
