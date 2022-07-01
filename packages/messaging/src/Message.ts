/**
 * CORD participants can communicate via a 1:1 messaging system.
 *
 * All messages are **encrypted** with the encryption keys of the involved identities.
 * Every time an actor sends data about an [[Identity]], they have to sign the message to prove access to the corresponding private key.
 *
 * The [[Message]] class exposes methods to construct and verify messages.
 *
 * @packageDocumentation
 * @module Messaging
 */

import { Identity } from '@cord.network/modules'
import type {
  IPublicIdentity,
  CompressedMessageBody,
  IMessage,
  ISubmitCredential,
  IEncryptedMessage,
  MessageBody,
  ISchema,
} from '@cord.network/types'
import { MessageBodyType } from '@cord.network/types'
import { Crypto, DataUtils, SDKErrors, UUID } from '@cord.network/utils'
import {
  compressMessage,
  decompressMessage,
  errorCheckMessage,
  errorCheckMessageBody,
  verifyRequiredSchemaProperties,
} from './Message.utils.js'

export class Message implements IMessage {
  /**
   * Lists all possible body types of [[Message]].
   */
  public static readonly BodyType = MessageBodyType

  /**
   * Verifies that the sender of a [[Message]] is also the owner of it, e.g the holder's and sender's public keys match.
   *
   * @param message The [[Message]] object which needs to be decrypted.
   * @param message.body The body of the [[Message]] which depends on the [[BodyType]].
   * @param message.senderAddress The sender's public SS58 address of the [[Message]].
   * @throws [[ERROR_IDENTITY_MISMATCH]] when the sender does not match the holder of the content embedded in the message, e.g. A request for credential or an credential.
   *
   */
  public static ensureOwnerIsSender({ body, senderAddress }: IMessage): void {
    switch (body.type) {
      case Message.BodyType.REQUEST_STREAM:
        {
          const requestStream = body
          if (
            requestStream.content.requestStream.content.issuer !== senderAddress
          ) {
            throw new SDKErrors.ERROR_IDENTITY_MISMATCH('Stream', 'Sender')
          }
        }
        break
      case Message.BodyType.SUBMIT_STREAM:
        {
          const submitStream = body
          //TODO - Add schema delegation checks
          if (submitStream.content.stream.issuer !== senderAddress) {
            throw new SDKErrors.ERROR_IDENTITY_MISMATCH('Stream', 'Creator')
          }
        }
        break
      case Message.BodyType.SUBMIT_CREDENTIAL:
        {
          const submitStreamsForSchema: ISubmitCredential = body
          submitStreamsForSchema.content.forEach((stream) => {
            if (stream.request.content.issuer !== senderAddress) {
              throw new SDKErrors.ERROR_IDENTITY_MISMATCH('Schema', 'Holder')
            }
          })
        }
        break
      default:
    }
  }

  /**
   * Verifies that neither the hash of [[Message]] nor the sender's signature on the hash have been tampered with.
   *
   * @param encrypted The encrypted [[Message]] object which needs to be decrypted.
   * @param senderAddress The sender's public SS58 address of the [[Message]].
   * @throws [[ERROR_NONCE_HASH_INVALID]] when either the hash or the signature could not be verified against the calculations.
   *
   */
  public static ensureHashAndSignature(
    encrypted: IEncryptedMessage,
    senderAddress: IMessage['senderAddress']
  ): void {
    if (
      Crypto.hashStr(
        encrypted.encryptedStream + encrypted.nonce + encrypted.createdAt
      ) !== encrypted.hash
    ) {
      throw new SDKErrors.ERROR_CONTENT_NONCE_MAP_MALFORMED(
        // { hash: encrypted.hash, nonce: encrypted.nonce },
        'Message'
      )
    }
    DataUtils.validateSignature(
      encrypted.hash,
      encrypted.signature,
      senderAddress
    )
  }

  /**
   * Symmetrically decrypts the result of [[Message.encrypt]].
   *
   * Uses [[Message.ensureHashAndSignature]] and [[Message.ensureOwnerIsSender]] internally.
   *
   * @param encrypted The encrypted message.
   * @param receiver The [[Identity]] of the receiver.
   * @throws [[ERROR_DECODING_MESSAGE]] when encrypted message couldn't be decrypted.
   * @throws [[ERROR_PARSING_MESSAGE]] when the decoded message could not be parsed.
   * @returns The original [[Message]].
   */
  public static decrypt(
    encrypted: IEncryptedMessage,
    receiver: Identity
  ): IMessage {
    // check validity of the message
    Message.ensureHashAndSignature(encrypted, encrypted.senderAddress)

    const ea: Crypto.EncryptedAsymmetricString = {
      box: encrypted.encryptedStream,
      nonce: encrypted.nonce,
    }
    const decoded: string | false = receiver.decryptAsymmetricAsStr(
      ea,
      encrypted.senderPublicKey
    )
    if (!decoded) {
      throw new SDKErrors.ERROR_DECODING_MESSAGE()
    }

    try {
      const messageBody: MessageBody = JSON.parse(decoded)
      const decrypted: IMessage = {
        ...encrypted,
        body: messageBody,
      }

      // checks the messasge body
      errorCheckMessageBody(messageBody)

      // checks the message structure
      errorCheckMessage(decrypted)
      // make sure the sender is the owner of the identity
      Message.ensureOwnerIsSender(decrypted)

      return decrypted
    } catch (error) {
      throw new SDKErrors.ERROR_PARSING_MESSAGE()
    }
  }

  public messageId?: string
  public receivedAt?: number
  public body: MessageBody
  public createdAt: string
  public validUntil?: number
  public receiverAddress: IMessage['receiverAddress']
  public senderAddress: IMessage['senderAddress']
  public senderPublicKey: IMessage['senderPublicKey']

  /**
   * Constructs a message which should be encrypted with [[Message.encrypt]] before sending to the receiver.
   *
   * @param body The body of the message.
   * @param sender The [[PublicIdentity]] of the sender.
   * @param receiver The [[PublicIdentity]] of the receiver.
   */
  public constructor(
    body: MessageBody | CompressedMessageBody,
    sender: Identity,
    receiver: IPublicIdentity
  ) {
    if (Array.isArray(body)) {
      this.body = decompressMessage(body)
    } else {
      this.body = body
    }
    this.messageId = UUID.generate()
    this.receiverAddress = receiver.address
    this.senderAddress = sender.address
    this.senderPublicKey = sender.getBoxPublicKey()
    this.createdAt = new Date().toString()
  }

  /**
   * Encrypts the [[Message]] symmetrically as a string. This can be reversed with [[Message.decrypt]].
   *
   * @param sender The [[Identity]] of the sender.
   * @param receiver The [[PublicIdentity]] of the receiver.
   * @returns The encrypted version of the original [[Message]], see [[IEncryptedMessage]].
   */
  public encrypt(
    sender: Identity,
    receiver: IPublicIdentity
  ): IEncryptedMessage {
    const encryptedMessage: Crypto.EncryptedAsymmetricString =
      sender.encryptAsymmetricAsStr(
        JSON.stringify(this.body),
        receiver.boxPublicKeyAsHex
      )
    const encryptedStream = encryptedMessage.box
    const { nonce } = encryptedMessage

    const hashInput: string = encryptedStream + nonce + this.createdAt
    const hash = Crypto.hashStr(hashInput)
    const signature = sender.signStr(hash)
    return {
      receivedAt: this.receivedAt,
      encryptedStream,
      nonce,
      createdAt: this.createdAt,
      hash,
      signature,
      receiverAddress: this.receiverAddress,
      senderAddress: this.senderAddress,
      senderPublicKey: this.senderPublicKey,
    }
  }

  public compress(): CompressedMessageBody {
    return compressMessage(this.body)
  }

  public static verifyRequiredSchemaProperties(
    requiredProperties: string[],
    schema: ISchema
  ): boolean {
    return verifyRequiredSchemaProperties(requiredProperties, schema)
  }
}
