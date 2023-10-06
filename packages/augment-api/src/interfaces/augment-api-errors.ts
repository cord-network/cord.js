// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/errors';

import type { ApiTypes, AugmentedError } from '@polkadot/api-base/types';

export type __AugmentedError<ApiType extends ApiTypes> = AugmentedError<ApiType>;

declare module '@polkadot/api-base/types/errors' {
  interface AugmentedErrors<ApiType extends ApiTypes> {
    authorityMembership: {
      /**
       * The authority entry already exists.
       **/
      MemberAlreadyExists: AugmentedError<ApiType>;
      /**
       * Already incoming
       **/
      MemberAlreadyIncoming: AugmentedError<ApiType>;
      /**
       * Already outgoing
       **/
      MemberAlreadyOutgoing: AugmentedError<ApiType>;
      /**
       * Member is blacklisted
       **/
      MemberBlackListed: AugmentedError<ApiType>;
      /**
       * Member not blacklisted
       **/
      MemberNotBlackListed: AugmentedError<ApiType>;
      /**
       * Not found owner key
       * There is no authority with the given ID.
       **/
      MemberNotFound: AugmentedError<ApiType>;
      /**
       * Not a network member
       **/
      NetworkMembershipNotFound: AugmentedError<ApiType>;
      /**
       * Session keys not provided
       **/
      SessionKeysNotAdded: AugmentedError<ApiType>;
    };
    babe: {
      /**
       * A given equivocation report is valid but already previously reported.
       **/
      DuplicateOffenceReport: AugmentedError<ApiType>;
      /**
       * Submitted configuration is invalid.
       **/
      InvalidConfiguration: AugmentedError<ApiType>;
      /**
       * An equivocation proof provided as part of an equivocation report is invalid.
       **/
      InvalidEquivocationProof: AugmentedError<ApiType>;
      /**
       * A key ownership proof provided as part of an equivocation report is invalid.
       **/
      InvalidKeyOwnershipProof: AugmentedError<ApiType>;
    };
    balances: {
      /**
       * Beneficiary account must pre-exist.
       **/
      DeadAccount: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit.
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * A vesting schedule already exists for this account.
       **/
      ExistingVestingSchedule: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account.
       **/
      Expendability: AugmentedError<ApiType>;
      /**
       * Balance too low to send value.
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Account liquidity restrictions prevent withdrawal.
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Number of freezes exceed `MaxFreezes`.
       **/
      TooManyFreezes: AugmentedError<ApiType>;
      /**
       * Number of holds exceed `MaxHolds`.
       **/
      TooManyHolds: AugmentedError<ApiType>;
      /**
       * Number of named reserves exceed `MaxReserves`.
       **/
      TooManyReserves: AugmentedError<ApiType>;
      /**
       * Vesting balance too high to send value.
       **/
      VestingBalance: AugmentedError<ApiType>;
    };
    council: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Prime account is not a member
       **/
      PrimeAccountNotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
    };
    councilMembership: {
      /**
       * Already a member.
       **/
      AlreadyMember: AugmentedError<ApiType>;
      /**
       * Not a member.
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Too many members.
       **/
      TooManyMembers: AugmentedError<ApiType>;
    };
    did: {
      /**
       * The DID has already been previously deleted.
       **/
      AlreadyDeleted: AugmentedError<ApiType>;
      /**
       * The DID with the given identifier is already present on chain.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * The DID call was submitted by the wrong account
       **/
      BadDidOrigin: AugmentedError<ApiType>;
      /**
       * An error that is not supposed to take place, yet it happened.
       **/
      Internal: AugmentedError<ApiType>;
      /**
       * The call had parameters that conflicted with each other
       * or were invalid.
       **/
      InvalidDidAuthorizationCall: AugmentedError<ApiType>;
      /**
       * The DID operation nonce is not equal to the current DID nonce + 1.
       **/
      InvalidNonce: AugmentedError<ApiType>;
      /**
       * One of the service endpoint details contains non-ASCII characters.
       **/
      InvalidServiceEncoding: AugmentedError<ApiType>;
      /**
       * The DID operation signature is invalid for the payload and the
       * verification key provided.
       **/
      InvalidSignature: AugmentedError<ApiType>;
      /**
       * The DID operation signature is not in the format the verification
       * key expects.
       **/
      InvalidSignatureFormat: AugmentedError<ApiType>;
      /**
       * The maximum number of key agreements has been reached for the DID
       * subject.
       **/
      MaxKeyAgreementKeysExceeded: AugmentedError<ApiType>;
      /**
       * A number of new key agreement keys greater than the maximum allowed
       * has been provided.
       **/
      MaxNewKeyAgreementKeysLimitExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of service endpoints for a DID has been exceeded.
       **/
      MaxNumberOfServicesExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of types for a service endpoint has been
       * exceeded.
       **/
      MaxNumberOfTypesPerServiceExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of URLs for a service endpoint has been exceeded.
       **/
      MaxNumberOfUrlsPerServiceExceeded: AugmentedError<ApiType>;
      /**
       * The maximum number of public keys for this DID key identifier has
       * been reached.
       **/
      MaxPublicKeysExceeded: AugmentedError<ApiType>;
      /**
       * The service endpoint ID exceeded the maximum allowed length.
       **/
      MaxServiceIdLengthExceeded: AugmentedError<ApiType>;
      /**
       * One of the service endpoint types exceeded the maximum allowed
       * length.
       **/
      MaxServiceTypeLengthExceeded: AugmentedError<ApiType>;
      /**
       * One of the service endpoint URLs exceeded the maximum allowed
       * length.
       **/
      MaxServiceUrlLengthExceeded: AugmentedError<ApiType>;
      /**
       * The number of service endpoints stored under the DID is larger than
       * the number of endpoints to delete.
       **/
      MaxStoredEndpointsCountExceeded: AugmentedError<ApiType>;
      /**
       * No DID with the given identifier is present on chain.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * A service with the provided ID is already present for the given DID.
       **/
      ServiceAlreadyExists: AugmentedError<ApiType>;
      /**
       * A service with the provided ID is not present under the given DID.
       **/
      ServiceNotFound: AugmentedError<ApiType>;
      /**
       * The block number provided in a DID-authorized operation is invalid.
       **/
      TransactionExpired: AugmentedError<ApiType>;
      /**
       * The called extrinsic does not support DID authorisation.
       **/
      UnsupportedDidAuthorizationCall: AugmentedError<ApiType>;
      /**
       * One or more verification keys referenced are not stored in the set
       * of verification keys.
       **/
      VerificationKeyNotFound: AugmentedError<ApiType>;
    };
    didName: {
      /**
       * The specified name has already been previously banned.
       **/
      AlreadyBanned: AugmentedError<ApiType>;
      /**
       * The specified name has already been previously claimed.
       **/
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * The specified name has been banned and cannot be interacted
       * with.
       **/
      Banned: AugmentedError<ApiType>;
      /**
       * The tx submitter does not have enough funds to pay for the deposit.
       **/
      InsufficientFunds: AugmentedError<ApiType>;
      /**
       * A name that contains not allowed characters is being claimed.
       **/
      InvalidFormat: AugmentedError<ApiType>;
      /**
       * A suffix that is too short is being claimed.
       **/
      InvalidSuffix: AugmentedError<ApiType>;
      /**
       * A name that is too long is being claimed.
       **/
      NameExceedsMaxLength: AugmentedError<ApiType>;
      /**
       * A prefix that is too long is being claimed.
       **/
      NamePrefixTooLong: AugmentedError<ApiType>;
      /**
       * A prefix that is too short is being claimed.
       **/
      NamePrefixTooShort: AugmentedError<ApiType>;
      /**
       * A name that is too short is being claimed.
       **/
      NameTooShort: AugmentedError<ApiType>;
      /**
       * The actor cannot performed the specified operation.
       **/
      NotAuthorized: AugmentedError<ApiType>;
      /**
       * The specified name is not currently banned.
       **/
      NotBanned: AugmentedError<ApiType>;
      /**
       * The specified name does not exist.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * The specified owner already owns a name.
       **/
      OwnerAlreadyExists: AugmentedError<ApiType>;
      /**
       * The specified owner does not own any names.
       **/
      OwnerNotFound: AugmentedError<ApiType>;
      /**
       * A suffix that is too long is being claimed.
       **/
      SuffixTooLong: AugmentedError<ApiType>;
    };
    grandpa: {
      /**
       * Attempt to signal GRANDPA change with one already pending.
       **/
      ChangePending: AugmentedError<ApiType>;
      /**
       * A given equivocation report is valid but already previously reported.
       **/
      DuplicateOffenceReport: AugmentedError<ApiType>;
      /**
       * An equivocation proof provided as part of an equivocation report is invalid.
       **/
      InvalidEquivocationProof: AugmentedError<ApiType>;
      /**
       * A key ownership proof provided as part of an equivocation report is invalid.
       **/
      InvalidKeyOwnershipProof: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA pause when the authority set isn't live
       * (either paused or already pending pause).
       **/
      PauseFailed: AugmentedError<ApiType>;
      /**
       * Attempt to signal GRANDPA resume when the authority set isn't paused
       * (either live or already pending resume).
       **/
      ResumeFailed: AugmentedError<ApiType>;
      /**
       * Cannot signal forced change so soon after last.
       **/
      TooSoon: AugmentedError<ApiType>;
    };
    identity: {
      /**
       * Account ID is already named.
       **/
      AlreadyClaimed: AugmentedError<ApiType>;
      /**
       * Empty index.
       **/
      EmptyIndex: AugmentedError<ApiType>;
      /**
       * Invalid judgement.
       **/
      InvalidJudgement: AugmentedError<ApiType>;
      /**
       * The target is invalid.
       **/
      InvalidTarget: AugmentedError<ApiType>;
      /**
       * The provided judgement was for a different identity.
       **/
      JudgementForDifferentIdentity: AugmentedError<ApiType>;
      /**
       * Judgement given.
       **/
      JudgementGiven: AugmentedError<ApiType>;
      /**
       * Error that occurs when there is an issue paying for judgement.
       **/
      JudgementPaymentFailed: AugmentedError<ApiType>;
      /**
       * No identity found.
       **/
      NoIdentity: AugmentedError<ApiType>;
      /**
       * Account isn't found.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Account isn't named.
       **/
      NotNamed: AugmentedError<ApiType>;
      /**
       * Registrar already exists.
       **/
      RegistrarAlreadyExists: AugmentedError<ApiType>;
      /**
       * Registrar not found.
       **/
      RegistrarNotFound: AugmentedError<ApiType>;
      /**
       * Sticky judgement.
       **/
      StickyJudgement: AugmentedError<ApiType>;
      /**
       * Too many additional fields.
       **/
      TooManyFields: AugmentedError<ApiType>;
      /**
       * Maximum amount of registrars reached. Cannot add any more.
       **/
      TooManyRegistrars: AugmentedError<ApiType>;
    };
    imOnline: {
      /**
       * Duplicated heartbeat.
       **/
      DuplicatedHeartbeat: AugmentedError<ApiType>;
      /**
       * Non existent public key.
       **/
      InvalidKey: AugmentedError<ApiType>;
    };
    indices: {
      /**
       * The index was not available.
       **/
      InUse: AugmentedError<ApiType>;
      /**
       * The index was not already assigned.
       **/
      NotAssigned: AugmentedError<ApiType>;
      /**
       * The index is assigned to another account.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The source and destination accounts are identical.
       **/
      NotTransfer: AugmentedError<ApiType>;
      /**
       * The index is permanent and may not be freed/changed.
       **/
      Permanent: AugmentedError<ApiType>;
    };
    multisig: {
      /**
       * Call is already approved by this signatory.
       **/
      AlreadyApproved: AugmentedError<ApiType>;
      /**
       * The data to be stored is already stored.
       **/
      AlreadyStored: AugmentedError<ApiType>;
      /**
       * The maximum weight information provided was too low.
       **/
      MaxWeightTooLow: AugmentedError<ApiType>;
      /**
       * Threshold must be 2 or greater.
       **/
      MinimumThreshold: AugmentedError<ApiType>;
      /**
       * Call doesn't need any (more) approvals.
       **/
      NoApprovalsNeeded: AugmentedError<ApiType>;
      /**
       * Multisig operation not found when attempting to cancel.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * No timepoint was given, yet the multisig operation is already underway.
       **/
      NoTimepoint: AugmentedError<ApiType>;
      /**
       * Only the account that originally created the multisig is able to cancel it.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The sender was contained in the other signatories; it shouldn't be.
       **/
      SenderInSignatories: AugmentedError<ApiType>;
      /**
       * The signatories were provided out of order; they should be ordered.
       **/
      SignatoriesOutOfOrder: AugmentedError<ApiType>;
      /**
       * There are too few signatories in the list.
       **/
      TooFewSignatories: AugmentedError<ApiType>;
      /**
       * There are too many signatories in the list.
       **/
      TooManySignatories: AugmentedError<ApiType>;
      /**
       * A timepoint was given, yet no multisig operation is underway.
       **/
      UnexpectedTimepoint: AugmentedError<ApiType>;
      /**
       * A different timepoint was given to the multisig operation that is underway.
       **/
      WrongTimepoint: AugmentedError<ApiType>;
    };
    networkMembership: {
      /**
       * Max members limit exceeded
       **/
      MaxMembersExceededForTheBlock: AugmentedError<ApiType>;
      /**
       * Membership already acquired
       **/
      MembershipAlreadyAcquired: AugmentedError<ApiType>;
      /**
       * Membership expired
       **/
      MembershipExpired: AugmentedError<ApiType>;
      /**
       * There is no member with the given ID.
       **/
      MembershipNotFound: AugmentedError<ApiType>;
      /**
       * Membership Renewal already requested
       **/
      MembershipRenewalAlreadyRequested: AugmentedError<ApiType>;
      /**
       * Rejects request if the member is added to the blacklist
       **/
      MembershipRequestRejected: AugmentedError<ApiType>;
      /**
       * Origin is not authorized
       **/
      OriginNotAuthorized: AugmentedError<ApiType>;
    };
    nodeAuthorization: {
      /**
       * The node is already claimed by a user.
       **/
      AlreadyClaimed: AugmentedError<ApiType>;
      /**
       * The node is already connected.
       **/
      AlreadyConnected: AugmentedError<ApiType>;
      /**
       * The node is already joined in the list.
       **/
      AlreadyJoined: AugmentedError<ApiType>;
      /**
       * The node identifier is not valid
       **/
      InvalidNodeIdentifier: AugmentedError<ApiType>;
      /**
       * The Utf8 string is not proper.
       **/
      InvalidUtf8: AugmentedError<ApiType>;
      /**
       * The Node identifier is too long.
       **/
      NodeIdTooLong: AugmentedError<ApiType>;
      /**
       * The node doesn't exist in the list.
       **/
      NotExist: AugmentedError<ApiType>;
      /**
       * You are not the owner of the node.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The PeerId is too long.
       **/
      PeerIdTooLong: AugmentedError<ApiType>;
      /**
       * No permisson to perform specific operation.
       **/
      PermissionDenied: AugmentedError<ApiType>;
      /**
       * Too many well known nodes.
       **/
      TooManyNodes: AugmentedError<ApiType>;
    };
    preimage: {
      /**
       * Preimage has already been noted on-chain.
       **/
      AlreadyNoted: AugmentedError<ApiType>;
      /**
       * The user is not authorized to perform this action.
       **/
      NotAuthorized: AugmentedError<ApiType>;
      /**
       * The preimage cannot be removed since it has not yet been noted.
       **/
      NotNoted: AugmentedError<ApiType>;
      /**
       * The preimage request cannot be removed since no outstanding requests exist.
       **/
      NotRequested: AugmentedError<ApiType>;
      /**
       * A preimage may not be removed when there are outstanding requests.
       **/
      Requested: AugmentedError<ApiType>;
      /**
       * Preimage is too large to store on-chain.
       **/
      TooBig: AugmentedError<ApiType>;
    };
    registry: {
      ArchivedRegistry: AugmentedError<ApiType>;
      /**
       * Authorization Id not found
       **/
      AuthorizationNotFound: AugmentedError<ApiType>;
      /**
       * Authority already added
       **/
      DelegateAlreadyAdded: AugmentedError<ApiType>;
      /**
       * Empty transaction.
       **/
      EmptyTransaction: AugmentedError<ApiType>;
      /**
       * Invalid Identifier
       **/
      InvalidIdentifier: AugmentedError<ApiType>;
      InvalidIdentifierLength: AugmentedError<ApiType>;
      InvalidIdentifierPrefix: AugmentedError<ApiType>;
      /**
       * Invalid Schema.
       **/
      InvalidSchema: AugmentedError<ApiType>;
      /**
       * Schema limit exceeds the permitted size.
       **/
      MaxEncodedRegistryLimitExceeded: AugmentedError<ApiType>;
      /**
       * Registry commit entries exceeded
       **/
      MaxRegistryCommitsExceeded: AugmentedError<ApiType>;
      /**
       * Registry identifier is not unique
       **/
      RegistryAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Registry entries exceeded for an identifier
       **/
      RegistryAuthoritiesLimitExceeded: AugmentedError<ApiType>;
      RegistryNotArchived: AugmentedError<ApiType>;
      /**
       * Registry identifier not found
       **/
      RegistryNotFound: AugmentedError<ApiType>;
      /**
       * Registry schema mismatch
       **/
      RegistrySchemaMismatch: AugmentedError<ApiType>;
      /**
       * Schema not found
       **/
      SchemaNotFound: AugmentedError<ApiType>;
      /**
       * Registry entries exceeded for an identifier
       **/
      TooManyRegistryEntries: AugmentedError<ApiType>;
      /**
       * Only when the author is not the controller or delegate.
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
    };
    remark: {
      /**
       * Attempted to call `store` outside of block execution.
       **/
      BadContext: AugmentedError<ApiType>;
      /**
       * Attempting to store empty data.
       **/
      Empty: AugmentedError<ApiType>;
    };
    scheduler: {
      /**
       * Failed to schedule a call
       **/
      FailedToSchedule: AugmentedError<ApiType>;
      /**
       * Attempt to use a non-named function on a named task.
       **/
      Named: AugmentedError<ApiType>;
      /**
       * Cannot find the scheduled call.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Reschedule failed because it does not change scheduled time.
       **/
      RescheduleNoChange: AugmentedError<ApiType>;
      /**
       * Given target block number is in the past.
       **/
      TargetBlockNumberInPast: AugmentedError<ApiType>;
    };
    schema: {
      /**
       * Creator DID information not found.
       **/
      CreatorNotFound: AugmentedError<ApiType>;
      /**
       * Empty transaction.
       **/
      EmptyTransaction: AugmentedError<ApiType>;
      InvalidIdentifierLength: AugmentedError<ApiType>;
      /**
       * Schema limit exceeds the permitted size.
       **/
      MaxEncodedSchemaLimitExceeded: AugmentedError<ApiType>;
      /**
       * Schema identifier is not unique.
       **/
      SchemaAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Schema identifier not found.
       **/
      SchemaNotFound: AugmentedError<ApiType>;
      /**
       * The paying account was unable to pay the fees for creating a schema.
       **/
      UnableToPayFees: AugmentedError<ApiType>;
    };
    score: {
      CountCannotBeZero: AugmentedError<ApiType>;
      DigestAlreadyAnchored: AugmentedError<ApiType>;
      InvalidDigest: AugmentedError<ApiType>;
      InvalidEntitySignature: AugmentedError<ApiType>;
      /**
       * Invalid Identifer Length
       **/
      InvalidIdentifierLength: AugmentedError<ApiType>;
      InvalidRatingIdentifier: AugmentedError<ApiType>;
      InvalidRatingValue: AugmentedError<ApiType>;
      InvalidSignature: AugmentedError<ApiType>;
      RatingCannotBeZero: AugmentedError<ApiType>;
      TooManyJournalEntries: AugmentedError<ApiType>;
      TransactionAlreadyRated: AugmentedError<ApiType>;
    };
    session: {
      /**
       * Registered duplicate key.
       **/
      DuplicatedKey: AugmentedError<ApiType>;
      /**
       * Invalid ownership proof.
       **/
      InvalidProof: AugmentedError<ApiType>;
      /**
       * Key setting account is not live, so it's impossible to associate keys.
       **/
      NoAccount: AugmentedError<ApiType>;
      /**
       * No associated validator ID for account.
       **/
      NoAssociatedValidatorId: AugmentedError<ApiType>;
      /**
       * No keys are associated with this account.
       **/
      NoKeys: AugmentedError<ApiType>;
    };
    stream: {
      AuthorizationDetailsNotFound: AugmentedError<ApiType>;
      DigestHashAlreadyAnchored: AugmentedError<ApiType>;
      ExpiredSignature: AugmentedError<ApiType>;
      HashAlreadyAnchored: AugmentedError<ApiType>;
      InvalidIdentifierLength: AugmentedError<ApiType>;
      InvalidSignature: AugmentedError<ApiType>;
      InvalidStreamIdentifier: AugmentedError<ApiType>;
      InvalidTransactionHash: AugmentedError<ApiType>;
      MaxStreamCommitsExceeded: AugmentedError<ApiType>;
      MetadataAlreadySet: AugmentedError<ApiType>;
      MetadataLimitExceeded: AugmentedError<ApiType>;
      MetadataNotFound: AugmentedError<ApiType>;
      /**
       * Stream idenfier marked inactive
       **/
      RevokedStream: AugmentedError<ApiType>;
      /**
       * Stream idenfier is not unique
       **/
      StreamAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Stream link does not exist
       **/
      StreamLinkNotFound: AugmentedError<ApiType>;
      /**
       * Stream Link is revoked
       **/
      StreamLinkRevoked: AugmentedError<ApiType>;
      /**
       * Stream idenfier not found
       **/
      StreamNotFound: AugmentedError<ApiType>;
      /**
       * Stream idenfier not marked inactive
       **/
      StreamNotRevoked: AugmentedError<ApiType>;
      StreamSpaceMismatch: AugmentedError<ApiType>;
      TooManyDelegates: AugmentedError<ApiType>;
      TooManyDelegatesToRemove: AugmentedError<ApiType>;
      /**
       * Only when the author is not the controller/delegate.
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
    };
    sudo: {
      /**
       * Sender must be the Sudo account
       **/
      RequireSudo: AugmentedError<ApiType>;
    };
    system: {
      /**
       * The origin filter prevent the call to be dispatched.
       **/
      CallFiltered: AugmentedError<ApiType>;
      /**
       * Failed to extract the runtime version from the new runtime.
       * 
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
    };
    technicalCommittee: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Prime account is not a member
       **/
      PrimeAccountNotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
    };
    technicalMembership: {
      /**
       * Already a member.
       **/
      AlreadyMember: AugmentedError<ApiType>;
      /**
       * Not a member.
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Too many members.
       **/
      TooManyMembers: AugmentedError<ApiType>;
    };
    unique: {
      AuthorizationDetailsNotFound: AugmentedError<ApiType>;
      DigestHashAlreadyAnchored: AugmentedError<ApiType>;
      EmptyTransaction: AugmentedError<ApiType>;
      ExpiredSignature: AugmentedError<ApiType>;
      HashAlreadyAnchored: AugmentedError<ApiType>;
      InvalidIdentifierLength: AugmentedError<ApiType>;
      InvalidSignature: AugmentedError<ApiType>;
      InvalidTransactionHash: AugmentedError<ApiType>;
      InvalidUniqueIdentifier: AugmentedError<ApiType>;
      MaxEncodedLimitExceeded: AugmentedError<ApiType>;
      MaxUniqueCommitsExceeded: AugmentedError<ApiType>;
      MetadataAlreadySet: AugmentedError<ApiType>;
      MetadataLimitExceeded: AugmentedError<ApiType>;
      MetadataNotFound: AugmentedError<ApiType>;
      RegistryIdMismatch: AugmentedError<ApiType>;
      /**
       * Unique idenfier marked inactive
       **/
      RevokedUnique: AugmentedError<ApiType>;
      TooManyDelegates: AugmentedError<ApiType>;
      TooManyDelegatesToRemove: AugmentedError<ApiType>;
      /**
       * Only when the author is not the controller/delegate.
       **/
      UnauthorizedOperation: AugmentedError<ApiType>;
      UniqueAlreadyAnchored: AugmentedError<ApiType>;
      /**
       * Unique link does not exist
       **/
      UniqueLinkNotFound: AugmentedError<ApiType>;
      /**
       * Unique Link is revoked
       **/
      UniqueLinkRevoked: AugmentedError<ApiType>;
      /**
       * Unique idenfier not found
       **/
      UniqueNotFound: AugmentedError<ApiType>;
      /**
       * Unique idenfier not marked inactive
       **/
      UniqueNotRevoked: AugmentedError<ApiType>;
      UniqueSpaceMismatch: AugmentedError<ApiType>;
    };
    utility: {
      /**
       * Too many calls batched.
       **/
      TooManyCalls: AugmentedError<ApiType>;
    };
  } // AugmentedErrors
} // declare module
