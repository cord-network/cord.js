import { Crypto, DataUtils } from '@cord.network/utils'
import type {
  ICredential,
  IContentStream,
  IIdentity,
  IPresentation,
  IPresentationSigningOptions,
} from '@cord.network/types'
import { Credential } from './Credential.js'

function ensureCredentialOwnership(
  credentials: ICredential[]
): IContentStream['content']['holder'] {
  const holders = credentials.reduce((owns, credential) => {
    owns.add(credential.request.content.holder!)
    return owns
  }, new Set<IIdentity['address']>())
  if (holders.size !== 1) {
    throw new Error(
      'all credentials in a presentation must be owned by one holder'
    )
  }
  const holder = holders.values().next().value
  DataUtils.validateAddress(holder, 'credential holder')
  return holder
}

export type SignedPresentation = Presentation &
  Pick<Required<Presentation>, 'holderSignature'>

export class Presentation implements IPresentation {
  public credentials: Credential[]
  public?: string
  public holderSignature?: string

  constructor({ credentials, holderSignature }: IPresentation) {
    ensureCredentialOwnership(credentials)
    this.credentials = credentials.map((i) => new Credential(i))
    this.holderSignature = holderSignature
  }

  public static fromPresentations(
    presentations: IPresentation[],
    signingOpts?: IPresentationSigningOptions
  ): Presentation {
    const credentials = ([] as ICredential[]).concat(
      ...presentations.map((i) => i.credentials)
    )
    const presentation = new Presentation({
      credentials,
    })
    if (!signingOpts) return presentation
    presentation.sign(signingOpts)
    return presentation
  }

  public static fromCredentials(
    credentials: ICredential[],
    options?: IPresentationSigningOptions
  ): Presentation {
    const presentation = new Presentation({ credentials })
    if (options) {
      presentation.sign(options)
    }
    return presentation
  }

  public sign({ signer }: IPresentationSigningOptions): SignedPresentation {
    delete this.holderSignature
    const signature = signer.sign(Crypto.coToUInt8(JSON.stringify(this)))
    this.holderSignature = Crypto.u8aToHex(signature)
    return this as SignedPresentation
  }

  public isSigned(): this is SignedPresentation {
    return !!this.holderSignature
  }

  public verifySignature(): boolean {
    if (!this.isSigned()) return false
    const claimsOwner = ensureCredentialOwnership(this.credentials)
    const { holderSignature, ...document } = this
    return Crypto.verify(
      JSON.stringify(document),
      holderSignature,
      claimsOwner!
    )
  }

  public verifyData(): boolean {
    if (this.isSigned() && !this.verifySignature()) return false
    return this.credentials.every((cred) => cred.verifyData())
  }

  public async verify(): Promise<boolean> {
    if (this.isSigned() && !this.verifySignature()) return false
    const results = await Promise.all(
      this.credentials.map((cred) => cred.verify())
    )
    return results.every((r) => !!r)
  }
}
