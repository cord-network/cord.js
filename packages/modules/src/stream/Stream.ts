import type { IStream, ICredential } from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'
import * as Did from '@cord.network/did'
import * as Credential from '../credential/index.js'

/**
 *  Checks whether the input meets all the required criteria of an [[IStream]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IStream]].
 *
 */
export function verifyDataStructure(input: IStream): void {
  if (!input.identifier) {
    throw new SDKErrors.IdentifierMissingError()
  }
  DataUtils.validateId(input.identifier, 'Stream Identiifier')
  if (!input.schema) {
    throw new SDKErrors.SchemaMissingError()
  }
  DataUtils.validateId(input.schema, 'Schema Identifier')

  if (!input.streamHash) {
    throw new SDKErrors.StreamHashMissingError()
  }
  DataUtils.verifyIsHex(input.streamHash, 256)

  if (!input.issuer) {
    throw new SDKErrors.IssuerMissingError()
  }
  Did.validateUri(input.issuer, 'Did')

  if (typeof input.revoked !== 'boolean') {
    throw new SDKErrors.RevokedTypeError()
  }
}

/**
 * Builds a new instance of an [[Stream]], from a complete set of input required for an stream.
 *
 * @param content - The base request for stream.
 * @param creatorPublicIdentity - Public Identity of the issuer, used to anchor the underlying stream.
 * @returns A new [[Stream]] object.
 *
 */
export function fromCredential(content: ICredential): IStream {
  const stream = {
    identifier: content.identifier,
    streamHash: content.rootHash,
    issuer: content.content.issuer,
    schema: content.content.schemaId,
    registry: content.registry,
    revoked: false,
  }
  verifyDataStructure(stream)
  return stream
}

/**
 * Custom Type Guard to determine input being of type IStream using the StreamUtils errorCheck.
 *
 * @param input The potentially only partial IStream.
 * @returns Boolean whether input is of type IStream.
 */
export function isIStream(input: unknown): input is IStream {
  try {
    verifyDataStructure(input as IStream)
  } catch (error) {
    return false
  }
  return true
}

/**
 * Verifies whether the data of the given attestation matches the one from the corresponding credential. It is valid if:
 * * the [[Credential]] object has valid data (see [[Credential.verifyDataIntegrity]]);
 * and
 * * the hash of the [[Credential]] object, and the hash of the [[Stream]].
 *
 * @param stream - The stream to verify.
 * @param credential - The credential to verify against.
 */
export function verifyAgainstCredential(
  stream: IStream,
  credential: ICredential
): void {
  const schemaMismatch = credential.content.schemaId !== stream.schema
  const credentialMismatch = credential.rootHash !== stream.streamHash
  if (credentialMismatch || schemaMismatch) {
    throw new SDKErrors.CredentialUnverifiableError(
      `Some attributes of the stream diverge from the credential: ${[
        'schemaId',
        'streamHash',
      ]
        .filter((_, i) => [schemaMismatch, credentialMismatch][i])
        .join(', ')}`
    )
  }
  Credential.verifyDataIntegrity(credential)
}
