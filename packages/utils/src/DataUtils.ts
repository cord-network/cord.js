/* eslint-disable import/prefer-default-export */
/**
 * @packageDocumentation
 * @module DataUtils
 */

/**
 * Dummy comment needed for correct doc display, do not remove.
 */
import '@polkadot/api-augment'
import type { IPublicIdentity } from '@cord.network/types'
import { checkAddress } from '@polkadot/util-crypto'
import * as SDKErrors from './SDKErrors.js'
import { verify } from './Crypto.js'
import { checkIdentifier } from './Identifier.js'
import { ss58Format } from '@cord.network/types'
/**
 *  Validates an given address string against the External Address Format (SS58) with our Prefix of 29.
 *
 * @param address Address string to validate for correct Format.
 * @param name Contextual name of the address, e.g. "stream owner".
 * @throws [[ERROR_ADDRESS_TYPE]] when address not of type string or of invalid Format.
 *
 * @returns Boolean whether the given address string checks out against the Format.
 */
export function validateAddress(
  address: IPublicIdentity['address'],
  name: string
): boolean {
  if (typeof address !== 'string') {
    throw new SDKErrors.ERROR_ADDRESS_TYPE()
  }
  // CORD has registered ss58 prefix 29
  if (!checkAddress(address, ss58Format)[0]) {
    throw new SDKErrors.ERROR_ADDRESS_INVALID(address, name)
  }
  return true
}

/**
 *  Validates the format of the given blake2b hash via regex.
 *
 * @param hash Hash string to validate for correct Format.
 * @param name Contextual name of the address, e.g. "stream owner".
 * @throws [[ERROR_HASH_TYPE]] when hash not of type string or of invalid Format.
 *
 * @returns Boolean whether the given hash string checks out against the Format.
 */
export function validateHash(hash: string, name: string): boolean {
  if (typeof hash !== 'string') {
    throw new SDKErrors.ERROR_HASH_TYPE()
  }
  const blake2bPattern = new RegExp('(0x)[A-F0-9]{64}', 'i')
  if (!hash.match(blake2bPattern)) {
    throw new SDKErrors.ERROR_HASH_MALFORMED(hash, name)
  }
  return true
}

/**
 *  Validates the format of the given blake2b hash via regex.
 *
 * @param hash Hash string to validate for correct Format.
 * @param name Contextual name of the address, e.g. "stream owner".
 * @throws [[ERROR_HASH_TYPE]] when hash not of type string or of invalid Format.
 *
 * @returns Boolean whether the given hash string checks out against the Format.
 */
export function validateId(id: string, name: string): boolean {
  if (typeof id !== 'string') {
    throw new SDKErrors.ERROR_IDENTIFIER_TYPE()
  }
  if (!checkIdentifier(id)) {
    throw new SDKErrors.ERROR_ID_MALFORMED()
  }
  return true
}

/**
 *  Validates the signature of the given signer address against the signed data.
 *
 * @param data The signed string of data.
 * @param signature The signature of the data to be validated.
 * @param signer Address of the signer identity.
 * @throws [[ERROR_SIGNATURE_DATA_TYPE]] when parameters are of invalid type.
 * @throws [[ERROR_SIGNATURE_UNVERIFIABLE]] when the signature could not be validated against the data.
 *
 * @returns Boolean whether the signature is valid for the given data.
 */
export function validateSignature(
  data: string,
  signature: string,
  signer: IPublicIdentity['address']
): boolean {
  if (
    typeof data !== 'string' ||
    typeof signature !== 'string' ||
    typeof signer !== 'string'
  ) {
    throw new SDKErrors.ERROR_SIGNATURE_DATA_TYPE()
  }
  if (!verify(data, signature, signer)) {
    throw new SDKErrors.ERROR_SIGNATURE_UNVERIFIABLE()
  }
  return true
}
