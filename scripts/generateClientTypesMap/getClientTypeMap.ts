import { readFile } from "fs/promises";
import jscodeshift from "jscodeshift";
import { join } from "path";

export const getClientTypeMap = async (clientName: string): Promise<Record<string, string>> => {
  const clientTypesMap = {};

  const typesPath = join("node_modules", "aws-sdk", "clients", `${clientName.toLowerCase()}.d.ts`);
  const relativeTypesPath = join(__dirname, "..", "..", typesPath);

  const typesCode = await readFile(relativeTypesPath, "utf8");

  const j = jscodeshift.withParser("ts");
  const source = j(typesCode);

  source.find(j.TSModuleDeclaration, { id: { name: clientName } }).forEach((moduleDeclaration) => {
    const tsTypes = j(moduleDeclaration).find(j.TSTypeAliasDeclaration).nodes();

    tsTypes
      .filter((tsType) => tsType.typeAnnotation.type === "TSStringKeyword")
      .forEach((tsType) => {
        clientTypesMap[tsType.id.name] = "string";
      });

    tsTypes
      .filter((tsType) => tsType.typeAnnotation.type === "TSUnionType")
      .forEach((tsType) => {
        const name = tsType.id.name;
        if (name.endsWith("Blob")) {
          clientTypesMap[name] = "Uint8Array";
        } else if (name !== "apiVersion") {
          clientTypesMap[name] = "string";
        }
      });

    tsTypes
      .filter((tsType) => tsType.typeAnnotation.type === "TSNumberKeyword")
      .forEach((tsType) => {
        clientTypesMap[tsType.id.name] = "number";
      });

    tsTypes.forEach((tsType) => {
      const name = tsType.id.name;
      if (name !== "apiVersion" && !clientTypesMap[name]) {
        clientTypesMap[name] = "";
      }
    });
  });

  return Object.entries(clientTypesMap)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
};
