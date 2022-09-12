import type { RemoteDocument, Url } from 'jsonld/jsonld-spec'
import * as vcjs from '@digitalbazaar/vc'
import { validationContexts } from './context/index.js'

export async function documentLoader(url: Url): Promise<RemoteDocument> {
  const context = validationContexts[url]
  if (context)
    return { contextUrl: undefined, documentUrl: url, document: context }
  return vcjs.defaultDocumentLoader(url)
}
