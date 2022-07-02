import type {
  DocumentLoader,
  ExpansionMap,
  purposes,
  VerificationResult,
} from 'jsonld-signatures'
import type { JsonLdObj } from 'jsonld/jsonld-spec'
import type { IPublicKeyRecord, CordStreamSignatureProof } from '../../types.js'
import { verifyStreamSignatureProof } from '../../verificationUtils.js'
import CordAbstractSuite from './CordAbstractSuite.js'
import { CORD_STREAM_SIGNATURE_PROOF_TYPE } from '../../constants.js'

export default class CordStreamSignatureSuite extends CordAbstractSuite {
  constructor() {
    super({
      type: CORD_STREAM_SIGNATURE_PROOF_TYPE,
      verificationMethod: '<none>',
    })
  }

  public async verifyProof(options: {
    proof: JsonLdObj
    document?: JsonLdObj
    purpose?: purposes.ProofPurpose
    documentLoader?: DocumentLoader
    expansionMap?: ExpansionMap
  }): Promise<VerificationResult> {
    try {
      const { document, proof, documentLoader } = options
      if (!document || typeof document !== 'object')
        throw new TypeError('document must be a JsonLd object')
      if (!proof || typeof proof !== 'object')
        throw new TypeError('proof must be a JsonLd object')
      const compactedDoc = await this.compactDoc(document, options)
      const compactedProof = await this.compactProof<CordStreamSignatureProof>(
        proof,
        options
      )
      if (typeof compactedProof.verificationMethod === 'string') {
        const dereferenced = documentLoader
          ? await documentLoader(compactedProof.verificationMethod)
          : undefined
        if (!dereferenced?.document) {
          throw new Error(
            'verificationMethod could not be dereferenced; did you select an appropriate document loader?'
          )
        }
        compactedProof.verificationMethod =
          dereferenced.document as IPublicKeyRecord
      }
      // note that we currently don't check whether the public key in the proof is linked to the credential subject
      const { verified, errors } = verifyStreamSignatureProof(
        compactedDoc,
        compactedProof
      )
      if (errors.length > 0)
        return {
          verified,
          error: errors[0],
        }
      return { verified }
    } catch (e: any) {
      return { verified: false, error: e }
    }
  }
}
