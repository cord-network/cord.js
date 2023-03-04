import type { Option } from '@polkadot/types'
// import type { Enum, Option, U8aFixed, Vec } from '@polkadot/types'
// import type { Codec } from '@polkadot/types/types'
import type { AccountId32, Hash } from '@polkadot/types/interfaces'
import type {
  RawDidLinkedInfo,
  PalletDidDidDetailsDidPublicKeyDetails,
  PalletDidDidDetails,
  PalletDidServiceEndpointsDidEndpoint,
} from '@cord.network/augment-api'
import type {
  DidDocument,
  DidEncryptionKey,
  DidKey,
  DidServiceEndpoint,
  DidUri,
  DidVerificationKey,
  // CordAddress,
  UriFragment,
} from '@cord.network/types'

// import { encodeAddress } from '@polkadot/keyring'
// import { ethereumEncode } from '@polkadot/util-crypto'
import { BN, u8aToString } from '@polkadot/util'
import { Crypto, ss58Format } from '@cord.network/utils'

// import { SubstrateAddress } from './DidLinks/AccountLinks.chain.js'
import { getFullDidUri } from './Did.utils.js'

function fromChain(encoded: AccountId32): DidUri {
  return getFullDidUri(Crypto.encodeAddress(encoded, ss58Format))
}

type RpcDocument = Pick<
  DidDocument,
  'authentication' | 'assertionMethod' | 'capabilityDelegation' | 'keyAgreement'
> & {
  lastTxCounter: BN
}

function didPublicKeyDetailsFromChain(
  keyId: Hash,
  keyDetails: PalletDidDidDetailsDidPublicKeyDetails
): DidKey {
  const key = keyDetails.key.isPublicEncryptionKey
    ? keyDetails.key.asPublicEncryptionKey
    : keyDetails.key.asPublicVerificationKey
  return {
    id: `#${keyId.toHex()}`,
    type: key.type.toLowerCase() as DidKey['type'],
    publicKey: key.value.toU8a(),
  }
}

function resourceIdToChain(id: UriFragment): string {
  return id.replace(/^#/, '')
}

function documentFromChain(encoded: PalletDidDidDetails): RpcDocument {
  const {
    publicKeys,
    authenticationKey,
    assertionKey,
    delegationKey,
    keyAgreementKeys,
    lastTxCounter,
  } = encoded

  const keys: Record<string, DidKey> = [...publicKeys.entries()]
    .map(([keyId, keyDetails]) =>
      didPublicKeyDetailsFromChain(keyId, keyDetails)
    )
    .reduce((res, key) => {
      res[resourceIdToChain(key.id)] = key
      return res
    }, {})

  const authentication = keys[authenticationKey.toHex()] as DidVerificationKey

  const didRecord: RpcDocument = {
    authentication: [authentication],
    lastTxCounter: lastTxCounter.toBn(),
  }

  if (assertionKey.isSome) {
    const key = keys[assertionKey.unwrap().toHex()] as DidVerificationKey
    didRecord.assertionMethod = [key]
  }
  if (delegationKey.isSome) {
    const key = keys[delegationKey.unwrap().toHex()] as DidVerificationKey
    didRecord.capabilityDelegation = [key]
  }

  const keyAgreementKeyIds = [...keyAgreementKeys.values()].map((keyId) =>
    keyId.toHex()
  )
  if (keyAgreementKeyIds.length > 0) {
    didRecord.keyAgreement = keyAgreementKeyIds.map(
      (id) => keys[id] as DidEncryptionKey
    )
  }

  return didRecord
}

function serviceFromChain(
  encoded: PalletDidServiceEndpointsDidEndpoint
): DidServiceEndpoint {
  const { id, serviceTypes, urls } = encoded
  return {
    id: `#${u8aToString(id)}`,
    type: serviceTypes.map(u8aToString),
    serviceEndpoint: urls.map(u8aToString),
  }
}

function servicesFromChain(
  encoded: PalletDidServiceEndpointsDidEndpoint[]
): DidServiceEndpoint[] {
  return encoded.map((encodedValue) => serviceFromChain(encodedValue))
}

/**
 * Web3Name is the type of nickname for a DID.
 */
export type Web3Name = string

export interface DidInfo {
  document: DidDocument
  web3Name?: Web3Name
}

/**
 * Decodes accounts, DID, and web3name linked to the provided account.
 *
 * @param encoded The data returned by `api.call.did.queryByAccount()`, `api.call.did.query()`, and `api.call.did.queryByWeb3Name()`.

 * @returns The accounts, DID, and web3name.
 */
export function linkedInfoFromChain(
  encoded: Option<RawDidLinkedInfo>
): DidInfo {
  const { identifier, w3n, serviceEndpoints, details } = encoded.unwrap()
  console.log(identifier, w3n, serviceEndpoints, details)
  const didRec = documentFromChain(details)
  const did: DidDocument = {
    uri: fromChain(identifier),
    authentication: didRec.authentication,
    assertionMethod: didRec.assertionMethod,
    capabilityDelegation: didRec.capabilityDelegation,
    keyAgreement: didRec.keyAgreement,
  }

  const service = servicesFromChain(serviceEndpoints)
  if (service.length > 0) {
    did.service = service
  }

  const web3Name = w3n.isNone ? undefined : w3n.unwrap().toHuman()

  return {
    document: did,
    web3Name,
  }
}
