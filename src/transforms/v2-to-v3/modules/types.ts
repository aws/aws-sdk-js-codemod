import { ClientIdentifier } from "../types";

export interface ClientModulesOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
  v3ClientPackageName: string;
  clientIdentifiers: ClientIdentifier[];
}

export interface ImportSpecifierOptions {
  importedName: string;
  localName?: string;
}

export interface ModulesOptions extends ImportSpecifierOptions {
  packageName: string;
}

export enum ImportType {
  REQUIRE = "require",
  IMPORT = "import",
  IMPORT_EQUALS = "import-equals",
}
