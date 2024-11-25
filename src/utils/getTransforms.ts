import { readdirSync } from "node:fs";
import { join } from "node:path";

import type { AwsSdkJsCodemodTransform } from "../transforms/index.ts";

export const getTransforms = () =>
  readdirSync(join(__dirname, "..", "transforms"), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .map((dirName) => {
      const { name, description, options } = require(`../transforms/${dirName}/transform`);
      return { name, description, options } as AwsSdkJsCodemodTransform;
    });
