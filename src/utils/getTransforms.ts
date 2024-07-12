import { readdirSync } from "fs";
import { join } from "path";

import { AwsSdkJsCodemodTransform } from "../transforms";

export const getTransforms = () =>
  readdirSync(join(__dirname, "..", "transforms"), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .map((dirName) => {
      const { name, description, options } = require(`../transforms/${dirName}/transform`);
      return { name, description, options } as AwsSdkJsCodemodTransform;
    });
