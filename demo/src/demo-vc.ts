// import * as Cord from '@cord.network/api'
// import { UUID } from '@cord.network/utils'
// import * as utils from './utils'
// import * as VCUtils from 'vc-export/src'

// async function main() {
//   await Cord.init({ address: 'ws://127.0.0.1:9944' })

//   // Step 1: Setup Org Identity
//   console.log(`\n🏛  Creating Identities\n`)
//   //3x4DHc1rxVAEqKWSx1DAAA8wZxLB4VhiRbMV997niBckUwSi
//   const entityIdentity = Cord.Identity.buildFromURI('//Bob', {
//     signingKeyPairType: 'sr25519',
//   })
//   console.log(
//     `🔑 Entity Controller Address (${entityIdentity.signingKeyType}): ${entityIdentity.address}`
//   )
//   const employeeIdentity = Cord.Identity.buildFromURI('//Dave', {
//     signingKeyPairType: 'sr25519',
//   })
//   console.log(
//     `🔑 Employee Address (${employeeIdentity.signingKeyType}): ${employeeIdentity.address}`
//   )
//   const holderIdentity = Cord.Identity.buildFromURI('//Alice', {
//     signingKeyPairType: 'sr25519',
//   })
//   console.log(
//     `🔑 Holder Org Address (${holderIdentity.signingKeyType}): ${holderIdentity.address}`
//   )
//   const verifierIdentity = Cord.Identity.buildFromURI('//Charlie', {
//     signingKeyPairType: 'ed25519',
//   })
//   console.log(
//     `🔑 Verifier Org Address (${verifierIdentity.signingKeyType}): ${verifierIdentity.address}\n`
//   )
//   console.log('✅ Identities created!')

//   // Step 2: Create a new Space
//   console.log(`\n\n✉️  Creating a new Space \n`)
//   let spaceContent = {
//     title: 'Demo Space',
//     description: 'Space for demo',
//   }
//   let spaceTitle = spaceContent.title + ':' + UUID.generate()
//   spaceContent.title = spaceTitle

//   let newSpace = Cord.Space.fromSpaceProperties(spaceContent, employeeIdentity)

//   let spaceCreationExtrinsic = await newSpace.create()

//   console.log(`📧 Space Details `)
//   console.dir(newSpace, { depth: null, colors: true })
//   console.log('\n⛓  Anchoring Space to the chain...')
//   console.log(`🔑 Creator: ${employeeIdentity.address} `)
//   console.log(`🔑 Author: ${entityIdentity.address} `)
//   // console.dir(spaceCreationExtrinsic, { depth: null, colors: true })

//   try {
//     await Cord.ChainUtils.signAndSubmitTx(
//       spaceCreationExtrinsic,
//       entityIdentity,
//       {
//         resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
//         rejectOn: Cord.ChainUtils.IS_ERROR,
//       }
//     )
//     console.log('✅ Space created!')
//   } catch (e: any) {
//     console.log(e.errorCode, '-', e.message)
//   }
//   console.log('SDK', newSpace.identifier)
//   console.log(
//     'SDK',
//     Cord.Utils.Identifier.getIdentifierHash(newSpace.identifier, 'space:cord:')
//   )

//   // Step 3: Create a new Schema
//   console.log(`\n\n✉️  Adding a new Schema \n`)
//   let newSchemaContent = require('../res/schema.json')
//   let newSchemaTitle = newSchemaContent.title + ':' + UUID.generate()
//   newSchemaContent.title = newSchemaTitle

//   let newSchema = Cord.Schema.fromSchemaProperties(
//     newSchemaContent,
//     employeeIdentity
//   )

//   let schemaCreationExtrinsic = await newSchema.create()

//   console.log(`📧 Schema Details `)
//   console.dir(newSchema, { depth: null, colors: true })
//   console.log('\n⛓  Anchoring Schema to the chain...')
//   console.log(`🔑 Creator: ${employeeIdentity.address} `)
//   console.log(`🔑 Author: ${entityIdentity.address} `)
//   // console.dir(schemaCreationExtrinsic, { depth: null, colors: true })

//   try {
//     await Cord.ChainUtils.signAndSubmitTx(
//       schemaCreationExtrinsic,
//       entityIdentity,
//       {
//         resolveOn: Cord.ChainUtils.IS_IN_BLOCK,
//         rejectOn: Cord.ChainUtils.IS_ERROR,
//       }
//     )
//     console.log('✅ Schema created!')
//   } catch (e: any) {
//     console.log(e.errorCode, '-', e.message)
//   }

//   // Step 4: Create a new Stream
//   console.log(`\n✉️  Adding a new Stream`, '\n')
//   let content = {
//     name: 'Alice',
//     age: 29,
//     gender: 'Female',
//     country: 'India',
//     credit: 1000,
//   }

//   let schemaStream = Cord.Content.fromProperties(
//     newSchema,
//     content,
//     employeeIdentity.address
//   )
//   console.log(`📧 Stream Details `)
//   console.dir(schemaStream, { depth: null, colors: true })

//   let newStreamContent = Cord.ContentStream.fromContent(
//     schemaStream,
//     employeeIdentity,
//     { space: newSpace.identifier }
//   )
//   console.log(`\n📧 Hashed Stream `)
//   console.dir(newStreamContent, { depth: null, colors: true })

//   let newStream = Cord.Stream.fromContentStream(newStreamContent)

//   let streamCreationExtrinsic = await newStream.create()
//   console.log(`\n📧 Stream On-Chain Details`)
//   console.dir(newStream, { depth: null, colors: true })

//   console.log('\n⛓  Anchoring Stream to the chain...')
//   console.log(`🔑 Creator: ${employeeIdentity.address} `)
//   console.log(`🔑 Author: ${entityIdentity.address} `)

//   try {
//     await Cord.ChainUtils.signAndSubmitTx(
//       streamCreationExtrinsic,
//       entityIdentity,
//       {
//         resolveOn: Cord.ChainUtils.IS_READY,
//         rejectOn: Cord.ChainUtils.IS_ERROR,
//       }
//     )
//     console.log('✅ Stream created!')
//   } catch (e: any) {
//     console.log(e.errorCode, '-', e.message)
//   }

//   // Step 3: Create a new Credential and Link to the Stream
//   console.log(`\n\n✉️  Adding a new Credential Schema \n`)
//   let credSchema = require('../res/cred-schema.json')
//   credSchema.title = credSchema.title + ':' + UUID.generate()

//   let credSchemaStream = cord.Schema.fromSchemaProperties(
//     credSchema,
//     employeeIdentity
//   )

//   bytes = json.encode(credSchemaStream)
//   encoded_hash = await hasher.digest(bytes)
//   // const credSchemaCid = CID.create(1, 0xb220, encoded_hash)
//   let credSchemaCreationExtrinsic = await credSchemaStream.create()
//   console.log('\n⛓  Anchoring Credential Schema to the chain...')

//   try {
//     await cord.ChainUtils.signAndSubmitTx(
//       credSchemaCreationExtrinsic,
//       entityIdentity,
//       {
//         resolveOn: cord.ChainUtils.IS_READY,
//         rejectOn: cord.ChainUtils.IS_ERROR,
//       }
//     )
//     console.log('✅ Schema created!')
//   } catch (e: any) {
//     console.log(e.errorCode, '-', e.message)
//   }
//   console.log(`📧 Schema Details `)
//   console.dir(credSchemaStream, { depth: null, colors: true })

//   console.log(`\n✉️  Adding a new Credential`, '\n')
//   let markStream = {
//     name: newStreamContent.content.contents.name,
//     country: newStreamContent.content.contents.country,
//   }

//   let credStreamContent = cord.Content.fromContent(
//     credSchemaStream,
//     markStream,
//     employeeIdentity.address,
//     holderIdentity.address
//   )

//   let credContentStream = cord.MarkContent.fromContent(
//     credStreamContent,
//     employeeIdentity
//   )
//   console.log(`\n📧 Hashed Stream Details`)
//   console.dir(credContentStream, { depth: null, colors: true })

//   let credStreamTx = cord.Stream.fromMarkContentProperties(credContentStream)

//   let credStreamCreationExtrinsic = await credStreamTx.create()
//   console.log(`\n📧 Credential On-Chain Details`)
//   console.dir(credStreamTx, { depth: null, colors: true })

//   try {
//     await cord.ChainUtils.signAndSubmitTx(
//       credStreamCreationExtrinsic,
//       entityIdentity,
//       {
//         resolveOn: cord.ChainUtils.IS_READY,
//         rejectOn: cord.ChainUtils.IS_ERROR,
//       }
//     )
//     console.log('✅ Credential created!')
//   } catch (e: any) {
//     console.log(e.errorCode, '-', e.message)
//   }
//   await utils.waitForEnter('\n⏎ Press Enter to continue..')

//   //  Step 7: Credential exchange via messaging
//   console.log(`\n\n📩 Credential Exchange - Selective Disclosure (Verifier)`)
//   console.log(`🔑 Verifier Address: ${verifierIdentity.address}`)
//   const purpose = 'Account Opening Request'
//   const validUntil = Date.now() + 864000000
//   const relatedData = true

//   const { session, message: message } =
//     cord.Exchange.Request.newRequestBuilder()
//       .requestPresentation({
//         id: credSchemaStream.schemaId,
//         properties: ['name'],
//       })
//       .finalize(
//         purpose,
//         verifierIdentity,
//         holderIdentity.getPublicIdentity(),
//         validUntil,
//         relatedData
//       )

//   console.log(`\n📧 Selective Disclosure Request`)
//   console.dir(message, { depth: null, colors: true })

//   const chainStream = await cord.Stream.query(credContentStream.contentId)
//   if (chainStream) {
//     let credential: cord.Credential
//     credential = cord.Credential.fromMarkContentStream(credContentStream, chainStream)
//     const presentation = cord.Exchange.Share.createPresentation(
//       holderIdentity,
//       message,
//       verifierIdentity.getPublicIdentity(),
//       [credential],
//       {
//         showAttributes: message.body.content[0].requiredProperties,
//         signer: holderIdentity,
//         request: message.body.request,
//       }
//     )

//     const { verified } = await cord.Exchange.Verify.verifyPresentation(
//       presentation,
//       session
//     )

//     const VC = VCUtils.fromMark(credential, holderIdentity, credSchemaStream)
//     const vcPresentation = await VCUtils.presentation.makePresentation(VC, [
//       'name',
//     ])

//     console.log(`\n📧 Received Credential `)
//     console.dir(presentation, { depth: null, colors: true })
//     console.dir(VC, { depth: null, colors: true })
//     console.dir(vcPresentation, {
//       depth: null,
//       colors: true,
//     })

//     console.log(vcPresentation.verifiableCredential)

//     let result = vcPresentation.verifiableCredential.proof.forEach(function (
//       proof: any
//     ) {
//       console.log(proof)
//       if (proof.type === VCUtils.constants.CORD_ANCHORED_PROOF_TYPE)
//         VCUtils.verification.verifyAttestedProof(
//           vcPresentation.verifiableCredential,
//           proof
//         )
//     })
//     console.log(result)
//     if (result && result.verified) {
//       console.log(
//         `Name of the crook: ${vcPresentation.verifiableCredential.credentialSubject.name}`
//       ) // prints 'Billy The Kid'
//       // console.log(
//       //   `Reward: ${vcPresentation.verifiableCredential.credentialSubject.}`
//       // ) // undefined
//     }

//     console.log('🔍 All valid? ', verified)
//   } else {
//     console.log(`\n❌ Credential not found `)
//   }

//   await utils.waitForEnter('\n⏎ Press Enter to continue..')
// }
// main()
//   .then(() => console.log('\nBye! 👋 👋 👋 '))
//   .finally(cord.disconnect)

// process.on('SIGINT', async () => {
//   console.log('\nBye! 👋 👋 👋 \n')
//   cord.disconnect()
//   process.exit(0)
// })
