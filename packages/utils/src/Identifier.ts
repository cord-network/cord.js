import type { HexString } from '@polkadot/util/types'
import { base58Decode, base58Encode, blake2AsU8a } from '@polkadot/util-crypto'
import {
  assert,
  u8aConcat,
  u8aToU8a,
  stringToU8a,
  isU8a,
  isHex,
  u8aToHex,
} from '@polkadot/util'
import {
  IPublicIdentity,
  SCHEMA_PREFIX,
  SPACE_PREFIX,
  STREAM_PREFIX,
  SCORE_PREFIX,
} from '@cord.network/types'
import {
  ACCOUNT_IDENTIFIER_PREFIX,
  HASH_PREFIX,
  SPACE_IDENTIFIER,
  SCHEMA_IDENTIFIER,
  STREAM_IDENTIFIER,
  SCORE_IDENTIFIER,
} from '@cord.network/types'

const defaults = {
  allowedDecodedLengths: [1, 2, 4, 8, 32, 33],
  allowedEncodedLengths: [3, 4, 6, 10, 35, 36, 37, 38],
}

const IDFR_PREFIX = stringToU8a('CRDIDFR')

function pphash(key: Uint8Array): Uint8Array {
  return blake2AsU8a(u8aConcat(IDFR_PREFIX, key), 512)
}

function checkAddressChecksum(
  decoded: Uint8Array
): [boolean, number, number, number] {
  const iDfrLength = decoded[0] & 0b0100_0000 ? 2 : 1
  const iDfrDecoded =
    iDfrLength === 1
      ? decoded[0]
      : ((decoded[0] & 0b0011_1111) << 2) |
        (decoded[1] >> 6) |
        ((decoded[1] & 0b0011_1111) << 8)

  // 32/33 bytes + 2 bytes checksum + prefix
  const isContentHash = [34 + iDfrLength, 35 + iDfrLength].includes(
    decoded.length
  )
  const length = decoded.length - (isContentHash ? 2 : 1)

  // calculate the hash and do the checksum byte checks
  const hash = pphash(decoded.subarray(0, length))
  const isValid =
    (decoded[0] & 0b1000_0000) === 0 &&
    ![46, 47].includes(decoded[0]) &&
    (isContentHash
      ? decoded[decoded.length - 2] === hash[0] &&
        decoded[decoded.length - 1] === hash[1]
      : decoded[decoded.length - 1] === hash[0])

  return [isValid, length, iDfrLength, iDfrDecoded]
}

function encodeIdentifier(
  key: HexString | Uint8Array | string,
  iDPrefix: number
): string {
  assert(key, 'Invalid key string passed')

  // decode it, this means we can re-encode an identifier
  const u8a = u8aToU8a(key)

  assert(
    iDPrefix >= 0 && iDPrefix <= 16383 && ![46, 47].includes(iDPrefix),
    'Out of range IdentifierFormat specified'
  )
  assert(
    defaults.allowedDecodedLengths.includes(u8a.length),
    () =>
      `Expected a valid key to convert, with length ${defaults.allowedDecodedLengths.join(
        ', '
      )}`
  )

  const input = u8aConcat(
    iDPrefix < 64
      ? [iDPrefix]
      : [
          ((iDPrefix & 0b0000_0000_1111_1100) >> 2) | 0b0100_0000,
          (iDPrefix >> 8) | ((iDPrefix & 0b0000_0000_0000_0011) << 6),
        ],
    u8a
  )

  return base58Encode(
    u8aConcat(
      input,
      pphash(input).subarray(0, [32, 33].includes(u8a.length) ? 2 : 1)
    )
  )
}

function decodeIdentifier(
  encoded?: HexString | string | Uint8Array | null,
  ignoreChecksum?: boolean,
  iDPrefix: number = -1
): Uint8Array {
  assert(encoded, 'Invalid identifier passed')

  if (isU8a(encoded) || isHex(encoded)) {
    return u8aToU8a(encoded)
  }

  try {
    const decoded = base58Decode(encoded)

    assert(
      defaults.allowedEncodedLengths.includes(decoded.length),
      'Invalid decoded identifier length'
    )

    const [isValid, endPos, iDfrLength, iDfrDecoded] =
      checkAddressChecksum(decoded)

    assert(ignoreChecksum || isValid, 'Invalid decoded identifier checksum')
    assert(
      [-1, iDfrDecoded].includes(iDPrefix),
      () => `Expected iDPrefixnti ${iDPrefix}, received ${iDfrDecoded}`
    )

    return decoded.slice(iDfrLength, endPos)
  } catch (error) {
    throw new Error(`Decoding ${encoded}: ${(error as Error).message}`)
  }
}

function decodeIdentifierHash(encoded?: HexString | string): string {
  assert(encoded, 'Invalid empty identifier passed')
  return u8aToHex(decodeIdentifier(encoded))
}

export function getIdentifier(
  identifier: HexString | Uint8Array | string,
  iDPrefix: number,
  prefix: string
): string {
  assert(identifier, 'Invalid key string passed')
  const id = encodeIdentifier(identifier, iDPrefix)
  return `${prefix}${id}`
}

export function getIdentifierKey(
  identifier: string | null | undefined
): string {
  assert(identifier, 'Invalid key string passed')
  if (identifier.startsWith(SCHEMA_PREFIX)) {
    return identifier.split(SCHEMA_PREFIX).join('')
  } else if (identifier.startsWith(SPACE_PREFIX)) {
    return identifier.split(SPACE_PREFIX).join('')
  } else if (identifier.startsWith(STREAM_PREFIX)) {
    return identifier.split(STREAM_PREFIX).join('')
  } else if (identifier.startsWith(SCORE_PREFIX)) {
    return identifier.split(SCORE_PREFIX).join('')
  } else if (identifier.startsWith(ACCOUNT_IDENTIFIER_PREFIX)) {
    return identifier.split(ACCOUNT_IDENTIFIER_PREFIX).join('')
  } else {
    throw new Error(`Invalid Identifier ${identifier}`)
  }
}

export function getHashIdentifier(
  identifier: HexString | Uint8Array | string
): string {
  assert(identifier, 'Invalid key string passed')
  return `${HASH_PREFIX}${identifier}`
}

export function getIdentifierHash(identifier: string): string {
  const id = identifier.split(HASH_PREFIX).join('')
  return decodeIdentifierHash(id)
}

/**
 * @name checkIdentifier
 * @summary Validates an identifier.
 * @description
 * From the provided input, validate that the address is a valid input.
 */
export function checkIdentifier(
  address: HexString | string
): [boolean, string | null] {
  let decoded

  try {
    decoded = base58Decode(address)
  } catch (error) {
    return [false, (error as Error).message]
  }

  const [isValid, , , idfrDecoded] = checkAddressChecksum(decoded)

  if (
    idfrDecoded !== SPACE_IDENTIFIER ||
    idfrDecoded !== SCHEMA_IDENTIFIER ||
    idfrDecoded !== STREAM_IDENTIFIER ||
    idfrDecoded !== SCORE_IDENTIFIER
  ) {
    return [false, `Prefix mismatch, found ${idfrDecoded}`]
  } else if (!defaults.allowedEncodedLengths.includes(decoded.length)) {
    return [false, 'Invalid decoded idenfirer length']
  }

  return [isValid, isValid ? null : 'Invalid decoded identifier checksum']
}

/**
 * Creates Account Identifier from Fetches Account Address.
 *
 * @param address Account address to derive it's identifier.
 *
 * @returns The Address identifier from the Account Address.
 */
export function getAccountIdentifierFromAddress(
  address: IPublicIdentity['address']
): string {
  return address.startsWith(ACCOUNT_IDENTIFIER_PREFIX)
    ? address
    : ACCOUNT_IDENTIFIER_PREFIX + address
}

/**
 * Fetches Account Address from Identifier.
 *
 * @param address Account identifier to derive it's address from.
 * @throws When the identifier is not prefixed with the defined ACCOUNT_IDENTIFIER_PREFIX.
 * @throws [[ERROR_INVALID_ID_PREFIX]].
 *
 * @returns The Address derived from the Account Identifier.
 */
export function getAccountAddressFromIdentifier(
  address: string
): IPublicIdentity['address'] {
  return address.split(ACCOUNT_IDENTIFIER_PREFIX).join('')
}
