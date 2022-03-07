export type ClientMetadataMap = Record<string, ClientMetadata>;

export interface ClientMetadata {
  v3ClientName: string;
  v3ClientPackageName: string;
}
