import { ClientIdentifier } from "./apis";

export type ClientMetadataRecord = Record<string, ClientMetadata>;

export interface ClientMetadata {
  clientIdentifiers: ClientIdentifier[];
  v2ClientLocalName: string;
  v3ClientName: string;
  v3ClientPackageName: string;
}
