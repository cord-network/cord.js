import {
  isDidSignature,
  verifyDidSignature,
  resolveKey,
  signatureToJson,
  signatureFromJson,
} from '@cord.network/did'
import type {
  AccountId,
  H256,
  DidUri,
  DidResolveKey,
  Hash,
  IDocument,
  IContent,
  IDocumentPresentation,
  ISchema,
  SignCallback,
  StatementId,
  SpaceId,
  PresentationOptions,
  IDocumentUpdate,
  IUpdatedDocument,
  IStatementStatus,
  SpaceUri,
  DocumentUri,
  // IDocumentEvidence,
} from '@cord.network/types'
import { Crypto, SDKErrors, DataUtils } from '@cord.network/utils'
import {
  STATEMENT_IDENT,
  STATEMENT_PREFIX,
  HexString,
  Bytes,
  blake2AsHex,
} from '@cord.network/types'
// import type { AccountId, H256 } from '@polkadot/types/interfaces'
import * as Did from '@cord.network/did'
import { ConfigService } from '@cord.network/config'
import {
  hashToUri,
  // uriToIdentifier,
  hexToDocumentUri,
  documentUriToHex,
  identifierToUri,
} from '@cord.network/identifier'
import { fetchDocumentElementStatus } from './Document.query.js'
import { verifyContentAgainstSchema } from '../schema/Schema.js'
import { hashContents } from '../content/index.js'
import * as Content from '../content/index.js'

/**
 * Gets the hash of the document.
 *
 * @param document - The document to get the hash from.
 * @returns The hash of the credential.
 */
export function getDocumentDigest(document: IDocument): HexString {
  const documentDigest = documentUriToHex(document.uri)

  return documentDigest
}

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}

function getHashLeaves(
  contentHashes: Hash[],
  evidenceUris: IDocument[]
): Uint8Array[] {
  const result = contentHashes.map((item) => Crypto.coToUInt8(item))

  if (evidenceUris.length > 0) {
    evidenceUris.forEach((evidence) => {
      result.push(Crypto.coToUInt8(evidence.uri))
    })
  }

  return result
}

/**
 * Calculates the root hash of the document.
 *
 * @param document The document object.
 * @returns The document hash.
 */

/**
 * @param document
 */
export function calculateDocumentHash(document: Partial<IDocument>): Hash {
  const hashes = getHashLeaves(
    document.contentHashes || [],
    document.evidenceUri || []
  )

  const root = getHashRoot(hashes)
  return Crypto.u8aToHex(root)
}

/**
 * Prepares credential data for signing.
 *
 * @param input - The Statement to prepare the data for.
 * @param challenge - An optional challenge to be included in the signing process.
 * @returns The prepared signing data as Uint8Array.
 */
export function makeSigningData(
  input: IDocument,
  challenge?: string
): Uint8Array {
  const documentHash = documentUriToHex(input.uri)
  return new Uint8Array([
    ...Crypto.coToUInt8(documentHash),
    ...Crypto.coToUInt8(challenge),
  ])
}

/**
 * @param input
 */
export function verifyDocumentHash(input: IDocument): void {
  const documentHash = documentUriToHex(input.uri)

  if (documentHash !== calculateDocumentHash(input))
    throw new SDKErrors.RootHashUnverifiableError()
}

type VerifyOptions = {
  schema?: ISchema
  challenge?: string
  didResolveKey?: DidResolveKey
  selectedAttributes?: string[]
  trustedIssuerUris?: DidUri[]
}

/**
 * Verifies the data of the [[ContentStatement]] object; used to check that the data was not tampered with, by checking the data against hashes.
 *
 * @param input - The [[Statement]] for which to verify data.
 */

/**
 * @param input
 * @param root0
 * @param root0.selectedAttributes
 */
export function verifyDataIntegrity(
  input: IDocument,
  { selectedAttributes }: VerifyOptions = {}
): void {
  // check document hash
  verifyDocumentHash(input)

  // verify properties against selective disclosure proof
  if (selectedAttributes) {
    Content.verifyDisclosedAttributes(
      input.content,
      {
        nonces: input.contentNonceMap,
        hashes: input.contentHashes,
      },
      selectedAttributes
    )
  } else {
    Content.verifyDisclosedAttributes(input.content, {
      nonces: input.contentNonceMap,
      hashes: input.contentHashes,
    })
  }

  // TODO - check evidences
  // input.evidenceIds.forEach(verifyDataIntegrity)
}

/**
 *  Checks whether the input meets all the required criteria of an IDocument object.
 *  Throws on invalid input.
 *
 * @param input - A potentially only partial [[IDocument]].
 *
 */
export function verifyDataStructure(input: IDocument | IUpdatedDocument): void {
  if (!('content' in input)) {
    throw new SDKErrors.ContentMissingError()
  } else {
    Content.verifyDataStructure(input.content)
  }
  if (!input.content.holderUri) {
    throw new SDKErrors.HolderMissingError()
  }
  if (!Array.isArray(input.evidenceUri)) {
    throw new SDKErrors.EvidenceMissingError()
  }
  if (!('contentNonceMap' in input)) {
    throw new SDKErrors.ContentNonceMapMissingError()
  }
  if (typeof input.contentNonceMap !== 'object')
    throw new SDKErrors.ContentNonceMapMalformedError()
  Object.entries(input.contentNonceMap).forEach(([digest, nonce]) => {
    DataUtils.verifyIsHex(digest, 256)
    if (!digest || typeof nonce !== 'string' || !nonce)
      throw new SDKErrors.ContentNonceMapMalformedError()
  })
  if (!('contentHashes' in input)) {
    throw new SDKErrors.DataStructureError('content hashes not provided')
  }
}

/**
 * @param input
 * @param statementDetails
 * @param chainSpace
 */
export function verifyUpdateDataStructure(
  input: IDocumentUpdate,
  statementDetails: IStatementStatus
): void {
  if (statementDetails.revoked) {
    throw new SDKErrors.StatementRevokedError('Statement Revoked on chain')
  }

  if (input.content.spaceUri !== identifierToUri(statementDetails.spaceUri)) {
    throw new SDKErrors.ChainSpaceMismatchError('Chain Space Mismatch')
  }

  console.log(statementDetails.schemaUri, input.content.schemaUri)
  if (
    statementDetails.schemaUri &&
    statementDetails.schemaUri === identifierToUri(input.content.schemaUri)
  ) {
    throw new SDKErrors.SchemaMismatchError('Schema Mismatch')
  }
}

/**
 * .
 * Verifies the signature of the [[IDocumentPresentation]].
 * The signature over the presentation **must** be generated with the DID in order for the verification to be successful.
 *
 * @param input - The [[IPresentation]].
 * @param verificationOpts Additional verification options.
 * @param verificationOpts.didResolveKey - The function used to resolve the claimer's key. Defaults to [[resolveKey]].
 * @param verificationOpts.challenge - The expected value of the challenge. Verification will fail in case of a mismatch.
 */
export async function verifySignature(
  input: IDocumentPresentation,
  {
    challenge,
    didResolveKey = resolveKey,
  }: {
    challenge?: string
    didResolveKey?: DidResolveKey
  } = {}
): Promise<void> {
  // verify Holder Signature
  const { holderSignature } = input
  if (challenge && challenge !== holderSignature.challenge)
    throw new SDKErrors.SignatureUnverifiableError(
      'Challenge differs from expected'
    )

  const signingData = makeSigningData(input, holderSignature.challenge)
  await verifyDidSignature({
    ...signatureFromJson(holderSignature),
    message: signingData,
    // check if credential owner matches signer
    expectedSigner: input.content.holderUri,
    expectedVerificationMethod: 'authentication',
    didResolveKey,
  })
  // verify Issuer Signature
  const { issuerSignature } = input
  const documentHash = documentUriToHex(input.uri)
  const uint8DocumentHash = new Uint8Array([...Crypto.coToUInt8(documentHash)])
  await verifyDidSignature({
    ...signatureFromJson(issuerSignature),
    message: uint8DocumentHash,
    // check if credential issuer matches signer
    expectedSigner: input.content.issuerUri,
    expectedVerificationMethod: 'assertionMethod',
    didResolveKey,
  })
}

/**
 * Calculates the statement Id by hashing it.
 *
 * @param statement Statement for which to create the id.
 * @param statementDigest
 * @param registry
 * @param documentDigest
 * @param chainSpace
 * @param creator
 * @returns Statement id uri.
 */
export function getUriForDocument(
  documentDigest: HexString,
  chainSpace: SpaceId,
  creator: DidUri
): StatementId {
  const api = ConfigService.get('api')
  const scaleEncodedDigest = api
    .createType<H256>('H256', documentDigest)
    .toU8a()
  const scaleEncodedRegistry = api
    .createType<Bytes>('Bytes', chainSpace)
    .toU8a()
  const scaleEncodedCreator = api
    .createType<AccountId>('AccountId', Did.toChain(creator))
    .toU8a()

  const digest = blake2AsHex(
    Uint8Array.from([
      ...scaleEncodedDigest,
      ...scaleEncodedRegistry,
      ...scaleEncodedCreator,
    ])
  )
  return hashToUri(digest, STATEMENT_IDENT, STATEMENT_PREFIX)
}

/**
 * Type Guard to determine input being of type [[IDocument]].
 *
 * @param input - A potentially only partial [[IDocument]].
 *
 * @returns  Boolean whether input is of type IDocument.
 */
export function isIDocument(input: unknown): input is IDocument {
  try {
    verifyDataStructure(input as IDocument)
  } catch (error) {
    return false
  }
  return true
}

export type Options = {
  evidenceUri?: IDocument[]
  validUntil?: Date
}

/**
 * Builds a new  [[IDocument]] object, from a complete set of required parameters.
 *
 * @param content An `IContent` object to build the document for.
 * @param option Container for different options that can be passed to this method.
 * @param authorization The authrization id of the Issuer, which should be used in anchoring the document.
 * @param registry Identifier of the registry this document is linked to.
 * @param option.evidenceIds Array of [[Document]] objects the Issuer include as evidenceIds.
 * @returns A new [[IDocument]] object.
 */

/**
 * @param root0
 * @param root0.content
 * @param root0.authorization
 * @param root0.registry
 * @param root0.signCallback
 * @param root0.options
 * @param root0.chainSpace
 * @param root0.spaceUri
 * @param root0.chainSpaceUri
 * @param root0.docSignCallback
 */
export async function buildFromContentProperties({
  content,
  spaceUri,
  signCallback,
  options = {},
}: {
  content: IContent
  spaceUri: SpaceUri
  signCallback: SignCallback
  options: Options
}): Promise<IDocument> {
  const { evidenceUri = [], validUntil } = options

  const issuanceDate = new Date().toISOString()
  const expirationDate = validUntil ? validUntil.toISOString() : undefined

  console.log('before', spaceUri)

  const documentContent = {
    ...content,
    spaceUri,
    issuanceDate,
    expirationDate,
  }
  console.log(spaceUri, documentContent)
  console.log(documentContent)

  const { hashes: contentHashes, nonceMap: contentNonceMap } =
    Content.hashContents(documentContent)

  const documentHash = calculateDocumentHash({
    evidenceUri,
    contentHashes,
  })

  const docUri = hexToDocumentUri(documentHash) as DocumentUri
  const uint8Hash = new Uint8Array([...Crypto.coToUInt8(documentHash)])
  const issuerSignature = await signCallback({
    data: uint8Hash,
    did: content.issuerUri,
    keyRelationship: 'assertionMethod',
  })

  const document = {
    uri: docUri,
    content: documentContent,
    contentHashes,
    contentNonceMap,
    evidenceUri,
    issuerSignature: signatureToJson(issuerSignature),
  }
  verifyDataStructure(document)
  return document
}

/**
 * @param document
 * @param input
 */
export function prepareDocumentForUpdate(input: unknown): IDocumentUpdate {
  if (!isIDocument(input)) {
    throw new SDKErrors.DocumentContentMalformed('Document content malformed')
  }

  const document = input as IDocument

  const {
    contentHashes,
    contentNonceMap,
    issuerSignature,
    ...remainingDocumentContent
  } = document

  return remainingDocumentContent
}

/**
 * @param root0
 * @param root0.content
 * @param root0.chainSpace
 * @param root0.signCallback
 * @param root0.options
 * @param root0.identifier
 * @param root0.document
 * @param root0.schema
 * @param root0.updater
 */
export async function updateFromDocumentProperties({
  document,
  updater,
  signCallback,
  options = {},
}: {
  document: IDocumentUpdate
  updater: DidUri
  signCallback: SignCallback
  options: Options
}): Promise<IUpdatedDocument> {
  const { evidenceUri, validUntil } = options

  const statementDetails = await fetchDocumentElementStatus(
    document.uri,
    document.content.spaceUri
  )
  if (statementDetails === null) {
    throw new SDKErrors.StatementError(`No associated statement found.`)
  }
  console.log('Statement Detail', statementDetails)
  const updateDocument = { ...document }
  updateDocument.content.issuerUri = updater

  const issuanceDate = new Date().toISOString()
  const expirationDate = validUntil
    ? validUntil.toISOString()
    : document.content.expirationDate

  console.log(updateDocument)
  const documentContent = { ...updateDocument, issuanceDate, expirationDate }

  verifyUpdateDataStructure(documentContent, statementDetails)

  const { hashes: contentHashes, nonceMap: contentNonceMap } =
    Content.hashContents(documentContent.content)

  const documentHash = calculateDocumentHash({
    evidenceUri,
    contentHashes,
  })

  const docUri = hexToDocumentUri(documentHash) as DocumentUri

  const uint8Hash = new Uint8Array([...Crypto.coToUInt8(documentHash)])
  const issuerSignature = await signCallback({
    data: uint8Hash,
    did: document.content.issuerUri,
    keyRelationship: 'assertionMethod',
  })

  const updatedDocument = {
    uri: docUri,
    statementUri: statementDetails.uri,
    content: document.content,
    contentHashes,
    contentNonceMap,
    evidenceUri: evidenceUri || document.evidenceUri,
    issuerSignature: signatureToJson(issuerSignature),
  }
  verifyDataStructure(updatedDocument)
  return updatedDocument
}

/**
 * Verifies data structure & data integrity of a document object.
 * This combines all offline sanity checks that can be performed on an IDocument object.
 *
 * @param document - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema to be checked against.
 * @param options.selectedAttributes - Selective disclosure attributes.
 */
export function verifyWellFormed(
  document: IDocument,
  { schema, selectedAttributes }: VerifyOptions = {}
): void {
  verifyDataStructure(document)
  if (
    selectedAttributes &&
    (selectedAttributes.length > 0 || selectedAttributes[0] !== '*')
  ) {
    verifyDataIntegrity(document, { selectedAttributes })
  } else {
    verifyDataIntegrity(document)
  }
  if (schema) {
    verifyContentAgainstSchema(document.content.contents, schema)
  }
}

/**
 * @param document
 * @param root0
 * @param root0.schema
 * @param root0.selectedAttributes
 */

/**
 * @param document
 * @param root0
 * @param root0.schema
 * @param root0.selectedAttributes
 * @param root0.trustedIssuerUris
 */
export async function verifyPresentationDocumentStatus(
  document: IDocument,
  { trustedIssuerUris }: VerifyOptions = {}
): Promise<{ isValid: boolean; message: string }> {
  try {
    const documentDetails = await fetchDocumentElementStatus(
      document.uri,
      document.content.spaceUri
    )

    if (!documentDetails) {
      return {
        isValid: false,
        message: 'Document details could not be found on the chain.',
      }
    }

    const documentDigest = documentUriToHex(document.uri)
    const documentDetailDigest = documentUriToHex(documentDetails.uri)

    if (documentDigest !== documentDetailDigest) {
      return {
        isValid: false,
        message: 'Document digest does not match with Statement.',
      }
    }

    if (documentDetails?.revoked) {
      return {
        isValid: false,
        message: 'Document revoked status does not match.',
      }
    }

    return {
      isValid: true,
      message: 'Document is valid and matches the chain details.',
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        isValid: false,
        message: `Error verifying document: ${error.message}`,
      }
    }
    return {
      isValid: false,
      message: 'An unknown error occurred while verifying the document.',
    }
  }
}

/**
 * Verifies data structure & data integrity of a credential object.
 *
 * @param document - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema to be checked against.
 * @param options.selectedAttributes
 */
export async function verifyDocument(
  document: IDocument,
  { schema, selectedAttributes }: VerifyOptions = {}
): Promise<void> {
  verifyWellFormed(document, { schema, selectedAttributes })
}

/**
 * Verifies data structure, data integrity and the holder's signature of a document presentation.
 *
 * Upon presentation of a document, a verifier would call this function.
 *
 * @param presentation - The object to check.
 * @param options - Additional parameter for more verification steps.
 * @param options.schema - Schema which the included document should be checked against.
 * @param options.challenge -  The expected value of the challenge. Verification will fail in case of a mismatch.
 * @param options.didResolveKey - The function used to resolve the holders's key. Defaults to [[resolveKey]].
 * @param options.trustedIssuerUris
 */
export async function verifyPresentation(
  presentation: IDocumentPresentation,
  { schema, challenge, didResolveKey = resolveKey }: VerifyOptions = {}
): Promise<void> {
  const selectedAttributes = presentation.selectiveAttributes
  await verifyDocument(presentation, { schema, selectedAttributes })
  await verifySignature(presentation, {
    challenge,
    didResolveKey,
  })
}

/**
 * Type Guard to determine input being of type [[IDocumentPresentation]].
 *
 * @param input - An [[IDocument]], [[IDocumentPresentation]], or other object.
 *
 * @returns  Boolean whether input is of type IDocumentPresentation.
 */
export function isPresentation(input: unknown): input is IDocumentPresentation {
  return (
    isIDocument(input) &&
    isDidSignature((input as IDocumentPresentation).holderSignature)
  )
}

function filterNestedObject(
  obj: Record<string, any>,
  keysToKeep: string[]
): Record<string, any> {
  const result: Record<string, any> = {}

  Object.keys(obj).forEach((key) => {
    // Check if the key is in keysToKeep list.
    if (keysToKeep.includes(key)) {
      result[key] = obj[key]
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Process nested keys.
      const nestedKeys = keysToKeep
        .filter((k) => k.startsWith(`${key}.`))
        .map((k) => k.split('.').slice(1).join('.'))

      if (nestedKeys.length > 0) {
        const nestedObject = filterNestedObject(obj[key], nestedKeys)
        if (Object.keys(nestedObject).length > 0) {
          result[key] = nestedObject
        }
      }
    }
  })

  return result
}

/**
 * Creates a public presentation which can be sent to a verifier.
 * This presentation is signed.
 *
 * @param presentationOptions The additional options to use upon presentation generation.
 * @param presentationOptions.document The document to create the presentation for.
 * @param presentationOptions.signCallback The callback to sign the presentation.
 * @param presentationOptions.selectedAttributes All properties of the credential which have been requested by the verifier and therefore must be publicly presented.
 * @param presentationOptions.challenge Challenge which will be part of the presentation signature.
 * If not specified, all attributes are shown. If set to an empty array, we hide all attributes inside the claim for the presentation.
 * @returns A deep copy of the Credential with selected attributes.
 */
export async function createPresentation({
  document,
  signCallback,
  selectedAttributes,
  challenge,
}: PresentationOptions): Promise<IDocumentPresentation> {
  const presentationDocument = document

  if (selectedAttributes && selectedAttributes.length > 0) {
    // Only keep selected attributes
    presentationDocument.content.contents = filterNestedObject(
      document.content.contents,
      selectedAttributes
    )
  }
  presentationDocument.contentNonceMap = hashContents(
    presentationDocument.content,
    {
      nonces: presentationDocument.contentNonceMap,
      selectedAttributes,
    }
  ).nonceMap

  const signature = await signCallback({
    data: makeSigningData(presentationDocument, challenge),
    did: document.content.holderUri,
    keyRelationship: 'assertionMethod',
  })

  return {
    ...presentationDocument,
    selectiveAttributes: selectedAttributes || [],
    holderSignature: {
      ...signatureToJson(signature),
      ...(challenge && { challenge }),
    },
  }
}