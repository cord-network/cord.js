/**
 * @packageDocumentation
 * @module VerificationUtils
 */

// import { u8aConcat, hexToU8a, u8aToHex } from '@polkadot/util'
import { signatureVerify, blake2AsHex } from '@polkadot/util-crypto'
import jsonld from 'jsonld'
import { Stream, TypeSchema, DidUtils } from '@cord.network/modules'
import { Crypto, JsonSchema } from '@cord.network/utils'
import {
  CORD_SELF_SIGNED_PROOF_TYPE,
  CORD_ANCHORED_PROOF_TYPE,
  CORD_CREDENTIAL_DIGEST_PROOF_TYPE,
  KeyTypesMap,
} from './constants.js'
import type {
  VerifiableCredential,
  SelfSignedProof,
  CordStreamProof,
  CredentialDigestProof,
} from './types.js'
import { Hash } from '@cord.network/types'
import { fromCredentialIRI } from './exportToVerifiableCredential.js'
import { HexString } from '@polkadot/util/types.js'

export interface VerificationResult {
  verified: boolean
  errors: Error[]
}

export enum StreamStatus {
  valid = 'valid',
  invalid = 'invalid',
  revoked = 'revoked',
  unknown = 'unknown',
}

export interface StreamVerificationResult extends VerificationResult {
  status: StreamStatus
}

const CREDENTIAL_MALFORMED_ERROR = (reason: string): Error =>
  new Error(`Credential malformed: ${reason}`)

const PROOF_MALFORMED_ERROR = (reason: string): Error =>
  new Error(`Proof malformed: ${reason}`)

/**
 * Verifies a self signed proof (holder signature) against a CORD Verifiable Credential.
 * This entails computing the root hash from the hashes contained in the `protected` section of the credentialSubject.
 * The resulting hash is then verified against the signature and public key contained in the proof (the latter
 * could be a DID URI in the future). It is also expected to by identical to the credential id.
 *
 * @param credential Verifiable Credential to verify proof against.
 * @param proof CORD self signed proof object.
 * @returns Object indicating whether proof could be verified.
 */
export function verifySelfSignedProof(
  credential: VerifiableCredential,
  proof: SelfSignedProof
): VerificationResult {
  const result: VerificationResult = { verified: true, errors: [] }
  try {
    // check proof
    const type = proof['@type'] || proof.type
    if (type !== CORD_SELF_SIGNED_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (!proof.signature) throw PROOF_MALFORMED_ERROR('signature missing')
    const { verificationMethod } = proof
    if (
      !(
        typeof verificationMethod === 'object' &&
        verificationMethod.publicKeyHex
      )
    ) {
      throw PROOF_MALFORMED_ERROR(
        'proof must contain public key; resolve did key references beforehand'
      )
    }
    const keyType = verificationMethod.type || verificationMethod['@type']
    if (!Object.values(KeyTypesMap).includes(keyType))
      throw PROOF_MALFORMED_ERROR(
        `signature type unknown; expected one of ${JSON.stringify(
          Object.values(KeyTypesMap)
        )}, got "${verificationMethod.type}"`
      )
    const signerPubKey = verificationMethod.publicKeyHex

    const rootHash = fromCredentialIRI(credential.credentialHash)
    // validate signature over root hash
    // signatureVerify can handle all required signature types out of the box
    const verification = signatureVerify(
      rootHash,
      proof.signature,
      signerPubKey
    )
    if (
      !(verification.isValid && KeyTypesMap[verification.crypto] === keyType)
    ) {
      throw new Error('signature could not be verified')
    }
    return result
  } catch (e) {
    result.verified = false
    result.errors = [e as Error]
    return result
  }
}

/**
 * Verifies a CORD credential proof by querying data from the CORD blockchain.
 * This includes querying the CORD blockchain with the credential id, which returns an credential record if attested.
 * This record is then compared against issuer address and delegation id (the latter of which is taken directly from the credential).
 *
 * @param credential Verifiable Credential to verify proof against.
 * @param proof CORD self signed proof object.
 * @returns Object indicating whether proof could be verified.
 */
export async function verifyStreamProof(
  credential: VerifiableCredential,
  proof: CordStreamProof
): Promise<StreamVerificationResult> {
  let status: StreamStatus = StreamStatus.unknown
  try {
    // check proof
    const type = proof['@type'] || proof.type
    if (type !== CORD_ANCHORED_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    const { issuerAddress, holderAddress } = proof
    if (typeof issuerAddress !== 'string' || !issuerAddress)
      throw PROOF_MALFORMED_ERROR('issuer address not understood')
    if (
      issuerAddress !==
      DidUtils.getAccountAddressFromIdentifier(credential.issuer)
    )
      throw PROOF_MALFORMED_ERROR('credential issuer address is not matching')

    if (holderAddress) {
      if (typeof holderAddress !== 'string')
        throw PROOF_MALFORMED_ERROR('holder address not understood')
      if (credential.credentialSubject['@id'] !== holderAddress)
        throw PROOF_MALFORMED_ERROR('credential holder address is not matching')
    }

    if (typeof credential.id !== 'string' || !credential.id)
      throw CREDENTIAL_MALFORMED_ERROR(
        'stream id (=stream hash) missing / invalid'
      )
    const streamId = fromCredentialIRI(credential.id)

    // query on-chain data by credential id (= stream root hash)
    const onChain = await Stream.query(streamId)
    // if not found, credential has not been attested, proof is invalid
    if (!onChain) {
      status = StreamStatus.invalid
      throw new Error(`credential for credential with id ${streamId} not found`)
    }
    // if issuer data on proof does not correspond to data on chain, proof is incorrect
    if (onChain.issuer !== issuerAddress) {
      status = StreamStatus.invalid
      throw new Error(
        `proof not matching on-chain data: proof ${{
          issuer: issuerAddress,
        }}`
      )
    }
    // if holder data on proof does not correspond to data on chain, proof is incorrect
    if (holderAddress) {
      if (typeof holderAddress !== 'string')
        throw PROOF_MALFORMED_ERROR('holder address not understood')
      if (onChain.holder !== holderAddress)
        throw new Error(
          `proof not matching on-chain data: proof ${{
            holder: holderAddress,
          }}`
        )
    }

    // if rootHash on credential does not correspond to data on chain, proof is incorrect
    if (onChain.streamHash !== credential.credentialHash)
      throw new Error(
        `credential hash is not matching on-chain data: proof ${{
          hash: credential.credentialHash,
        }}`
      )

    // if proof data is valid but credential is flagged as revoked, credential is no longer valid
    if (onChain.revoked) {
      status = StreamStatus.revoked
      throw new Error('credential revoked')
    }
  } catch (e) {
    return {
      verified: false,
      errors: [e as Error],
      status,
    }
  }
  return { verified: true, errors: [], status: StreamStatus.valid }
}

/**
 * Verifies a proof that reveals the content of selected properties to a verifier. This enables selective disclosure.
 * Values and nonces contained within this proof will be hashed, the result of which is expected to equal hashes on the credential.
 *
 * @param credential Verifiable Credential to verify proof against.
 * @param proof CORD self signed proof object.
 * @param options Allows passing custom hasher.
 * @param options.hasher A custom hasher. Defaults to hex(blake2-256('nonce'+'value')).
 * @returns Object indicating whether proof could be verified.
 */
export async function verifyCredentialDigestProof(
  credential: VerifiableCredential,
  proof: CredentialDigestProof,
  options: { hasher?: Crypto.Hasher } = {}
): Promise<VerificationResult> {
  const {
    hasher = (value, nonce?) => blake2AsHex((nonce || '') + value, 256),
  } = options
  const result: VerificationResult = { verified: true, errors: [] }
  try {
    // check proof
    const type = proof['@type'] || proof.type
    if (type !== CORD_CREDENTIAL_DIGEST_PROOF_TYPE)
      throw new Error('Proof type mismatch')
    if (typeof proof.nonces !== 'object') {
      throw PROOF_MALFORMED_ERROR('proof must contain object "nonces"')
    }
    if (typeof credential.credentialSubject !== 'object')
      throw CREDENTIAL_MALFORMED_ERROR('credential subject missing')
    const rootHash = verifyRootHash(credential, proof)
    // throw if root hash does not match expected (=id)
    const expectedRootHash = credential.credentialHash
    if (expectedRootHash !== rootHash)
      throw new Error('computed root hash does not match expected')

    // 2: check individual properties against stream hashes in proof
    // expand credentialSubject keys by compacting with empty context credential to produce statements
    const flattened = await jsonld.compact(credential.credentialSubject, {})
    const statements = Object.entries(flattened).map(([key, value]) =>
      JSON.stringify({ [key]: value })
    )
    const expectedUnsalted = Object.keys(proof.nonces)

    return statements.reduce<VerificationResult>(
      (r, stmt) => {
        const unsalted = hasher(stmt)
        if (!expectedUnsalted.includes(unsalted))
          return {
            verified: false,
            errors: [
              ...r.errors,
              PROOF_MALFORMED_ERROR(
                `Proof contains no digest for statement ${stmt}`
              ),
            ],
          }
        const nonce = proof.nonces[unsalted]
        if (!proof.contentHashes.includes(hasher(unsalted, nonce)))
          return {
            verified: false,
            errors: [
              ...r.errors,
              new Error(
                `Proof for statement ${stmt} not valid against streamHashes`
              ),
            ],
          }
        return r
      },
      { verified: true, errors: [] }
    )
  } catch (e) {
    result.verified = false
    result.errors = [e as Error]
    return result
  }
}

export function validateSchema(
  credential: VerifiableCredential
): VerificationResult {
  const { schema } = credential.credentialSchema || {}
  // if present, perform schema validation
  if (schema) {
    // there's no rule against additional properties, so we can just validate the ones that are there

    const validator = new JsonSchema.Validator(schema)
    validator.addSchema(TypeSchema.SchemaModel)
    const result = validator.validate(credential.credentialSubject)
    return {
      verified: result.valid,
      errors: result.errors?.map((e) => new Error(e.error)) || [],
    }
  }
  return { verified: false, errors: [] }
}

function verifyRootHash(
  input: VerifiableCredential,
  proof: CredentialDigestProof
): Hash {
  const issuanceDateHash = Crypto.hashObjectAsHexStr(input.issuanceDate)
  const expirationDateHash = Crypto.hashObjectAsHexStr(input.expirationDate)
  return calculateRootHash(input, proof, issuanceDateHash, expirationDateHash)
}

function calculateRootHash(
  credential: Partial<VerifiableCredential>,
  proof: CredentialDigestProof,
  issuanceDate: HexString,
  expirationDate: HexString
): Hash {
  const hashes: Uint8Array[] = getHashLeaves(
    proof.contentHashes || [],
    credential.legitimationIds || [],
    issuanceDate,
    expirationDate
  )
  const root: Uint8Array = getHashRoot(hashes)
  return Crypto.u8aToHex(root)
}

function getHashLeaves(
  contentHashes: string[],
  legitimations: string[],
  issueDate: HexString,
  expiryDate: HexString
): Uint8Array[] {
  const result: Uint8Array[] = []
  contentHashes.forEach((item) => {
    result.push(Crypto.coToUInt8(item))
  })
  if (legitimations) {
    legitimations.forEach((legitimation) => {
      result.push(Crypto.coToUInt8(legitimation))
    })
  }
  result.push(Crypto.coToUInt8(issueDate))
  result.push(Crypto.coToUInt8(expiryDate))
  return result
}

function getHashRoot(leaves: Uint8Array[]): Uint8Array {
  const result = Crypto.u8aConcat(...leaves)
  return Crypto.hash(result)
}
