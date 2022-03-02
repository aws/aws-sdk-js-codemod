import { API, FileInfo } from "jscodeshift";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // transform `root` here

  return root.toSource();
}
