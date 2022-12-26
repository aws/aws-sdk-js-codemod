import { JSCodeshift, TSTypeReference } from "jscodeshift";

export const getTsTypeWithInputOutput = (
  j: JSCodeshift,
  node: TSTypeReference,
  v2IoName: string
) => {
  if (v2IoName.endsWith("Input")) {
    node.typeName = j.identifier(v2IoName.replace(/Input$/, "CommandInput"));
  } else if (v2IoName.endsWith("Output")) {
    node.typeName = j.identifier(v2IoName.replace(/Output$/, "CommandOutput"));
  }
  return node;
};
