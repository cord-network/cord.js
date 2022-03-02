/**
 * @packageDocumentation
 * @module ProductUtils
 */

import type { IProduct, CompressedProduct } from '@cord.network/types'
import { DataUtils, SDKErrors } from '@cord.network/utils'

/**
 *  Checks whether the input meets all the required criteria of an [[IProduct]] object.
 *  Throws on invalid input.
 *
 * @param input The potentially only partial [[IProduct]].
 *
 */
export function errorCheck(input: IProduct): void {
  if (!input.id) {
    throw SDKErrors.ERROR_MARK_ID_NOT_PROVIDED()
  } else DataUtils.validateHash(input.id, 'Product ID')

  if (!input.hash) {
    throw SDKErrors.ERROR_MARK_HASH_NOT_PROVIDED()
  } else DataUtils.validateHash(input.hash, 'Product hash')

  if (!input.schema) {
    throw SDKErrors.ERROR_MARK_SCHEMA_ID_NOT_PROVIDED()
  } else DataUtils.validateHash(input.schema, 'Schema link')

  //TODO: Fix this
  // if (!input.link) {
  //   throw SDKErrors.ERROR_MARK_JOURNAL_ID_NOT_PROVIDED()
  // } else DataUtils.validateHash(input.link, 'Mark link')

  if (!input.creator) {
    throw SDKErrors.ERROR_MARK_CREATOR_NOT_PROVIDED()
  } else DataUtils.validateAddress(input.creator, 'Product controller')

  if (typeof input.status !== 'boolean') {
    throw SDKErrors.ERROR_MARK_REVOCATION_BIT_MISSING()
  }
}

/**
 *  Compresses an [[Mark]] object into an array for storage and/or messaging.
 *
 * @param stream An [[Mark]] object that will be sorted and stripped for messaging or storage.
 *
 * @returns An ordered array of an [[Mark]].
 */

export function compress(stream: IProduct): CompressedProduct {
  errorCheck(stream)
  return [
    stream.id,
    stream.hash,
    stream.cid,
    stream.store_id,
    stream.schema,
    stream.price,
    stream.rating,
    stream.quantity,
    stream.link,
    stream.creator,
    stream.status,
  ]
}

/**
 *  Decompresses an [[Mark]] from storage and/or message into an object.
 *
 * @param stream A compressed [[Mark]] array that is decompressed back into an object.
 * @throws [[ERROR_DECOMPRESSION_ARRAY]] when the stream is not an array or its length is not equal to 5.
 *
 * @returns An object that has the same properties as an [[Mark]].
 */

export function decompress(stream: CompressedProduct): IProduct {
  if (!Array.isArray(stream) || stream.length !== 11) {
    throw SDKErrors.ERROR_DECOMPRESSION_ARRAY('Mark')
  }
  return {
    id: stream[0],
    hash: stream[1],
    cid: stream[2],
    store_id: stream[3],
    schema: stream[4],
    price: stream[5],
    rating: stream[6],
    quantity: stream[7],
    link: stream[8],
    creator: stream[9],
    status: stream[10],
  }
}

export function getIdWithPrefix(hash: string): string {
  return `cord:stream:${hash}`
}

export function getIdentifier(identifier: string): string {
  return identifier.split('cord:stream:').join('')
}

/**
 * Convert from hex to string
 * @param hex Hex string with prefix `0x`
 * @returns With string back
 */
export function hexToString(hex: string): string {
  return Buffer.from(hex.substring(2), 'hex').toString()
}
