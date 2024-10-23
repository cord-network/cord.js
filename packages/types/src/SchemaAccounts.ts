import type { DidUri } from './DidDocument.js'
import type { ISchema, SchemaDigest } from './Schema.js';

export const SCHEMA_ACCOUNTS_IDENT = 10501;

/**
 * The details of a Schema Accounts that are stored on chain.
 */
export interface ISchemaAccountsDetails {
  schema: ISchema
  digest: SchemaDigest
  creatorUri: DidUri
}
