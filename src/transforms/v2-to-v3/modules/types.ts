import { ClientIdentifier } from "../types";

export interface ClientModulesOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
  v3ClientPackageName: string;
  clientIdentifiers: ClientIdentifier[];
  importType: ImportType;
}

export interface ImportSpecifierPattern {
  importedName: string;
  localName?: string;
}

export type ImportSpecifierDefault = string;

export type ImportSpecifierType = ImportSpecifierPattern | ImportSpecifierDefault;

export interface ModulesOptions extends ImportSpecifierPattern {
  packageName: string;
}

export enum ImportType {
  REQUIRE = "require",
  IMPORT = "import",
  IMPORT_EQUALS = "import-equals",
}
