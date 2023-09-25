// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/types/registry';

import type { CordAuthorityMembershipCall, CordAuthorityMembershipError, CordAuthorityMembershipEvent, CordRuntimeEntitiesValidatorFullIdentification, CordRuntimeMaxNewKeyAgreementKeys, CordRuntimeOriginCaller, CordRuntimeRuntime, CordRuntimeSessionKeys, FinalityGrandpaEquivocationPrecommit, FinalityGrandpaEquivocationPrevote, FinalityGrandpaPrecommit, FinalityGrandpaPrevote, FrameSupportDispatchDispatchClass, FrameSupportDispatchDispatchInfo, FrameSupportDispatchPays, FrameSupportDispatchPerDispatchClassU32, FrameSupportDispatchPerDispatchClassWeight, FrameSupportDispatchPerDispatchClassWeightsPerClass, FrameSupportDispatchRawOrigin, FrameSupportPreimagesBounded, FrameSupportTokensMiscBalanceStatus, FrameSystemAccountInfo, FrameSystemCall, FrameSystemError, FrameSystemEvent, FrameSystemEventRecord, FrameSystemExtensionsCheckNonce, FrameSystemLastRuntimeUpgradeInfo, FrameSystemLimitsBlockLength, FrameSystemLimitsBlockWeights, FrameSystemLimitsWeightsPerClass, FrameSystemPhase, NetworkMembershipMemberData, PalletBabeCall, PalletBabeError, PalletBalancesAccountData, PalletBalancesBalanceLock, PalletBalancesCall, PalletBalancesError, PalletBalancesEvent, PalletBalancesIdAmount, PalletBalancesReasons, PalletBalancesReserveData, PalletCollectiveCall, PalletCollectiveError, PalletCollectiveEvent, PalletCollectiveRawOrigin, PalletCollectiveVotes, PalletDidCall, PalletDidDidDetails, PalletDidDidDetailsDidAuthorizedCallOperation, PalletDidDidDetailsDidCreationDetails, PalletDidDidDetailsDidEncryptionKey, PalletDidDidDetailsDidPublicKey, PalletDidDidDetailsDidPublicKeyDetails, PalletDidDidDetailsDidSignature, PalletDidDidDetailsDidVerificationKey, PalletDidError, PalletDidEvent, PalletDidNamesCall, PalletDidNamesDidNameDidNameOwnership, PalletDidNamesError, PalletDidNamesEvent, PalletDidOriginDidRawOrigin, PalletDidServiceEndpointsDidEndpoint, PalletGrandpaCall, PalletGrandpaError, PalletGrandpaEvent, PalletGrandpaStoredPendingChange, PalletGrandpaStoredState, PalletIdentityCall, PalletIdentityError, PalletIdentityEvent, PalletIdentityIdentityInfo, PalletIdentityJudgement, PalletIdentityRegistration, PalletImOnlineBoundedOpaqueNetworkState, PalletImOnlineCall, PalletImOnlineError, PalletImOnlineEvent, PalletImOnlineHeartbeat, PalletImOnlineSr25519AppSr25519Public, PalletImOnlineSr25519AppSr25519Signature, PalletIndicesCall, PalletIndicesError, PalletIndicesEvent, PalletMembershipCall, PalletMembershipError, PalletMembershipEvent, PalletMultisigCall, PalletMultisigError, PalletMultisigEvent, PalletMultisigMultisig, PalletMultisigTimepoint, PalletNetworkMembershipCall, PalletNetworkMembershipCheckNetworkMembership, PalletNetworkMembershipError, PalletNetworkMembershipEvent, PalletOffencesEvent, PalletPreimageCall, PalletPreimageError, PalletPreimageEvent, PalletPreimageRequestStatus, PalletRegistryCall, PalletRegistryError, PalletRegistryEvent, PalletRegistryPermissions, PalletRegistryRegistryAuthorization, PalletRegistryRegistryCommit, PalletRegistryRegistryCommitActionOf, PalletRegistryRegistryEntry, PalletRemarkCall, PalletRemarkError, PalletRemarkEvent, PalletRuntimeUpgradeCall, PalletSchedulerCall, PalletSchedulerError, PalletSchedulerEvent, PalletSchedulerScheduled, PalletSchemaCall, PalletSchemaError, PalletSchemaEvent, PalletSchemaSchemaEntry, PalletSessionCall, PalletSessionError, PalletSessionEvent, PalletStreamCall, PalletStreamError, PalletStreamEvent, PalletStreamStreamCommit, PalletStreamStreamCommitActionOf, PalletStreamStreamEntry, PalletStreamTimepoint, PalletSudoCall, PalletSudoError, PalletSudoEvent, PalletTimestampCall, PalletUniqueCall, PalletUniqueError, PalletUniqueEvent, PalletUniqueTimepoint, PalletUniqueUniqueCommit, PalletUniqueUniqueCommitActionOf, PalletUniqueUniqueEntry, PalletUtilityCall, PalletUtilityError, PalletUtilityEvent, SpArithmeticArithmeticError, SpAuthorityDiscoveryAppPublic, SpConsensusBabeAllowedSlots, SpConsensusBabeAppPublic, SpConsensusBabeBabeEpochConfiguration, SpConsensusBabeDigestsNextConfigDescriptor, SpConsensusBabeDigestsPreDigest, SpConsensusBabeDigestsPrimaryPreDigest, SpConsensusBabeDigestsSecondaryPlainPreDigest, SpConsensusBabeDigestsSecondaryVRFPreDigest, SpConsensusGrandpaAppPublic, SpConsensusGrandpaAppSignature, SpConsensusGrandpaEquivocation, SpConsensusGrandpaEquivocationProof, SpConsensusSlotsEquivocationProof, SpCoreCryptoKeyTypeId, SpCoreEcdsaPublic, SpCoreEcdsaSignature, SpCoreEd25519Public, SpCoreEd25519Signature, SpCoreOffchainOpaqueNetworkState, SpCoreSr25519Public, SpCoreSr25519Signature, SpCoreSr25519VrfVrfSignature, SpRuntimeDigest, SpRuntimeDigestDigestItem, SpRuntimeDispatchError, SpRuntimeHeader, SpRuntimeModuleError, SpRuntimeMultiSignature, SpRuntimeTokenError, SpRuntimeTransactionalError, SpSessionMembershipProof, SpStakingOffenceOffenceDetails, SpVersionRuntimeVersion, SpWeightsRuntimeDbWeight, SpWeightsWeightV2Weight } from '@polkadot/types/lookup';

declare module '@polkadot/types/types/registry' {
  interface InterfaceTypes {
    CordAuthorityMembershipCall: CordAuthorityMembershipCall;
    CordAuthorityMembershipError: CordAuthorityMembershipError;
    CordAuthorityMembershipEvent: CordAuthorityMembershipEvent;
    CordRuntimeEntitiesValidatorFullIdentification: CordRuntimeEntitiesValidatorFullIdentification;
    CordRuntimeMaxNewKeyAgreementKeys: CordRuntimeMaxNewKeyAgreementKeys;
    CordRuntimeOriginCaller: CordRuntimeOriginCaller;
    CordRuntimeRuntime: CordRuntimeRuntime;
    CordRuntimeSessionKeys: CordRuntimeSessionKeys;
    FinalityGrandpaEquivocationPrecommit: FinalityGrandpaEquivocationPrecommit;
    FinalityGrandpaEquivocationPrevote: FinalityGrandpaEquivocationPrevote;
    FinalityGrandpaPrecommit: FinalityGrandpaPrecommit;
    FinalityGrandpaPrevote: FinalityGrandpaPrevote;
    FrameSupportDispatchDispatchClass: FrameSupportDispatchDispatchClass;
    FrameSupportDispatchDispatchInfo: FrameSupportDispatchDispatchInfo;
    FrameSupportDispatchPays: FrameSupportDispatchPays;
    FrameSupportDispatchPerDispatchClassU32: FrameSupportDispatchPerDispatchClassU32;
    FrameSupportDispatchPerDispatchClassWeight: FrameSupportDispatchPerDispatchClassWeight;
    FrameSupportDispatchPerDispatchClassWeightsPerClass: FrameSupportDispatchPerDispatchClassWeightsPerClass;
    FrameSupportDispatchRawOrigin: FrameSupportDispatchRawOrigin;
    FrameSupportPreimagesBounded: FrameSupportPreimagesBounded;
    FrameSupportTokensMiscBalanceStatus: FrameSupportTokensMiscBalanceStatus;
    FrameSystemAccountInfo: FrameSystemAccountInfo;
    FrameSystemCall: FrameSystemCall;
    FrameSystemError: FrameSystemError;
    FrameSystemEvent: FrameSystemEvent;
    FrameSystemEventRecord: FrameSystemEventRecord;
    FrameSystemExtensionsCheckNonce: FrameSystemExtensionsCheckNonce;
    FrameSystemLastRuntimeUpgradeInfo: FrameSystemLastRuntimeUpgradeInfo;
    FrameSystemLimitsBlockLength: FrameSystemLimitsBlockLength;
    FrameSystemLimitsBlockWeights: FrameSystemLimitsBlockWeights;
    FrameSystemLimitsWeightsPerClass: FrameSystemLimitsWeightsPerClass;
    FrameSystemPhase: FrameSystemPhase;
    NetworkMembershipMemberData: NetworkMembershipMemberData;
    PalletBabeCall: PalletBabeCall;
    PalletBabeError: PalletBabeError;
    PalletBalancesAccountData: PalletBalancesAccountData;
    PalletBalancesBalanceLock: PalletBalancesBalanceLock;
    PalletBalancesCall: PalletBalancesCall;
    PalletBalancesError: PalletBalancesError;
    PalletBalancesEvent: PalletBalancesEvent;
    PalletBalancesIdAmount: PalletBalancesIdAmount;
    PalletBalancesReasons: PalletBalancesReasons;
    PalletBalancesReserveData: PalletBalancesReserveData;
    PalletCollectiveCall: PalletCollectiveCall;
    PalletCollectiveError: PalletCollectiveError;
    PalletCollectiveEvent: PalletCollectiveEvent;
    PalletCollectiveRawOrigin: PalletCollectiveRawOrigin;
    PalletCollectiveVotes: PalletCollectiveVotes;
    PalletDidCall: PalletDidCall;
    PalletDidDidDetails: PalletDidDidDetails;
    PalletDidDidDetailsDidAuthorizedCallOperation: PalletDidDidDetailsDidAuthorizedCallOperation;
    PalletDidDidDetailsDidCreationDetails: PalletDidDidDetailsDidCreationDetails;
    PalletDidDidDetailsDidEncryptionKey: PalletDidDidDetailsDidEncryptionKey;
    PalletDidDidDetailsDidPublicKey: PalletDidDidDetailsDidPublicKey;
    PalletDidDidDetailsDidPublicKeyDetails: PalletDidDidDetailsDidPublicKeyDetails;
    PalletDidDidDetailsDidSignature: PalletDidDidDetailsDidSignature;
    PalletDidDidDetailsDidVerificationKey: PalletDidDidDetailsDidVerificationKey;
    PalletDidError: PalletDidError;
    PalletDidEvent: PalletDidEvent;
    PalletDidNamesCall: PalletDidNamesCall;
    PalletDidNamesDidNameDidNameOwnership: PalletDidNamesDidNameDidNameOwnership;
    PalletDidNamesError: PalletDidNamesError;
    PalletDidNamesEvent: PalletDidNamesEvent;
    PalletDidOriginDidRawOrigin: PalletDidOriginDidRawOrigin;
    PalletDidServiceEndpointsDidEndpoint: PalletDidServiceEndpointsDidEndpoint;
    PalletGrandpaCall: PalletGrandpaCall;
    PalletGrandpaError: PalletGrandpaError;
    PalletGrandpaEvent: PalletGrandpaEvent;
    PalletGrandpaStoredPendingChange: PalletGrandpaStoredPendingChange;
    PalletGrandpaStoredState: PalletGrandpaStoredState;
    PalletIdentityCall: PalletIdentityCall;
    PalletIdentityError: PalletIdentityError;
    PalletIdentityEvent: PalletIdentityEvent;
    PalletIdentityIdentityInfo: PalletIdentityIdentityInfo;
    PalletIdentityJudgement: PalletIdentityJudgement;
    PalletIdentityRegistration: PalletIdentityRegistration;
    PalletImOnlineBoundedOpaqueNetworkState: PalletImOnlineBoundedOpaqueNetworkState;
    PalletImOnlineCall: PalletImOnlineCall;
    PalletImOnlineError: PalletImOnlineError;
    PalletImOnlineEvent: PalletImOnlineEvent;
    PalletImOnlineHeartbeat: PalletImOnlineHeartbeat;
    PalletImOnlineSr25519AppSr25519Public: PalletImOnlineSr25519AppSr25519Public;
    PalletImOnlineSr25519AppSr25519Signature: PalletImOnlineSr25519AppSr25519Signature;
    PalletIndicesCall: PalletIndicesCall;
    PalletIndicesError: PalletIndicesError;
    PalletIndicesEvent: PalletIndicesEvent;
    PalletMembershipCall: PalletMembershipCall;
    PalletMembershipError: PalletMembershipError;
    PalletMembershipEvent: PalletMembershipEvent;
    PalletMultisigCall: PalletMultisigCall;
    PalletMultisigError: PalletMultisigError;
    PalletMultisigEvent: PalletMultisigEvent;
    PalletMultisigMultisig: PalletMultisigMultisig;
    PalletMultisigTimepoint: PalletMultisigTimepoint;
    PalletNetworkMembershipCall: PalletNetworkMembershipCall;
    PalletNetworkMembershipCheckNetworkMembership: PalletNetworkMembershipCheckNetworkMembership;
    PalletNetworkMembershipError: PalletNetworkMembershipError;
    PalletNetworkMembershipEvent: PalletNetworkMembershipEvent;
    PalletOffencesEvent: PalletOffencesEvent;
    PalletPreimageCall: PalletPreimageCall;
    PalletPreimageError: PalletPreimageError;
    PalletPreimageEvent: PalletPreimageEvent;
    PalletPreimageRequestStatus: PalletPreimageRequestStatus;
    PalletRegistryCall: PalletRegistryCall;
    PalletRegistryError: PalletRegistryError;
    PalletRegistryEvent: PalletRegistryEvent;
    PalletRegistryPermissions: PalletRegistryPermissions;
    PalletRegistryRegistryAuthorization: PalletRegistryRegistryAuthorization;
    PalletRegistryRegistryCommit: PalletRegistryRegistryCommit;
    PalletRegistryRegistryCommitActionOf: PalletRegistryRegistryCommitActionOf;
    PalletRegistryRegistryEntry: PalletRegistryRegistryEntry;
    PalletRemarkCall: PalletRemarkCall;
    PalletRemarkError: PalletRemarkError;
    PalletRemarkEvent: PalletRemarkEvent;
    PalletRuntimeUpgradeCall: PalletRuntimeUpgradeCall;
    PalletSchedulerCall: PalletSchedulerCall;
    PalletSchedulerError: PalletSchedulerError;
    PalletSchedulerEvent: PalletSchedulerEvent;
    PalletSchedulerScheduled: PalletSchedulerScheduled;
    PalletSchemaCall: PalletSchemaCall;
    PalletSchemaError: PalletSchemaError;
    PalletSchemaEvent: PalletSchemaEvent;
    PalletSchemaSchemaEntry: PalletSchemaSchemaEntry;
    PalletSessionCall: PalletSessionCall;
    PalletSessionError: PalletSessionError;
    PalletSessionEvent: PalletSessionEvent;
    PalletStreamCall: PalletStreamCall;
    PalletStreamError: PalletStreamError;
    PalletStreamEvent: PalletStreamEvent;
    PalletStreamStreamCommit: PalletStreamStreamCommit;
    PalletStreamStreamCommitActionOf: PalletStreamStreamCommitActionOf;
    PalletStreamStreamEntry: PalletStreamStreamEntry;
    PalletStreamTimepoint: PalletStreamTimepoint;
    PalletSudoCall: PalletSudoCall;
    PalletSudoError: PalletSudoError;
    PalletSudoEvent: PalletSudoEvent;
    PalletTimestampCall: PalletTimestampCall;
    PalletUniqueCall: PalletUniqueCall;
    PalletUniqueError: PalletUniqueError;
    PalletUniqueEvent: PalletUniqueEvent;
    PalletUniqueTimepoint: PalletUniqueTimepoint;
    PalletUniqueUniqueCommit: PalletUniqueUniqueCommit;
    PalletUniqueUniqueCommitActionOf: PalletUniqueUniqueCommitActionOf;
    PalletUniqueUniqueEntry: PalletUniqueUniqueEntry;
    PalletUtilityCall: PalletUtilityCall;
    PalletUtilityError: PalletUtilityError;
    PalletUtilityEvent: PalletUtilityEvent;
    SpArithmeticArithmeticError: SpArithmeticArithmeticError;
    SpAuthorityDiscoveryAppPublic: SpAuthorityDiscoveryAppPublic;
    SpConsensusBabeAllowedSlots: SpConsensusBabeAllowedSlots;
    SpConsensusBabeAppPublic: SpConsensusBabeAppPublic;
    SpConsensusBabeBabeEpochConfiguration: SpConsensusBabeBabeEpochConfiguration;
    SpConsensusBabeDigestsNextConfigDescriptor: SpConsensusBabeDigestsNextConfigDescriptor;
    SpConsensusBabeDigestsPreDigest: SpConsensusBabeDigestsPreDigest;
    SpConsensusBabeDigestsPrimaryPreDigest: SpConsensusBabeDigestsPrimaryPreDigest;
    SpConsensusBabeDigestsSecondaryPlainPreDigest: SpConsensusBabeDigestsSecondaryPlainPreDigest;
    SpConsensusBabeDigestsSecondaryVRFPreDigest: SpConsensusBabeDigestsSecondaryVRFPreDigest;
    SpConsensusGrandpaAppPublic: SpConsensusGrandpaAppPublic;
    SpConsensusGrandpaAppSignature: SpConsensusGrandpaAppSignature;
    SpConsensusGrandpaEquivocation: SpConsensusGrandpaEquivocation;
    SpConsensusGrandpaEquivocationProof: SpConsensusGrandpaEquivocationProof;
    SpConsensusSlotsEquivocationProof: SpConsensusSlotsEquivocationProof;
    SpCoreCryptoKeyTypeId: SpCoreCryptoKeyTypeId;
    SpCoreEcdsaPublic: SpCoreEcdsaPublic;
    SpCoreEcdsaSignature: SpCoreEcdsaSignature;
    SpCoreEd25519Public: SpCoreEd25519Public;
    SpCoreEd25519Signature: SpCoreEd25519Signature;
    SpCoreOffchainOpaqueNetworkState: SpCoreOffchainOpaqueNetworkState;
    SpCoreSr25519Public: SpCoreSr25519Public;
    SpCoreSr25519Signature: SpCoreSr25519Signature;
    SpCoreSr25519VrfVrfSignature: SpCoreSr25519VrfVrfSignature;
    SpRuntimeDigest: SpRuntimeDigest;
    SpRuntimeDigestDigestItem: SpRuntimeDigestDigestItem;
    SpRuntimeDispatchError: SpRuntimeDispatchError;
    SpRuntimeHeader: SpRuntimeHeader;
    SpRuntimeModuleError: SpRuntimeModuleError;
    SpRuntimeMultiSignature: SpRuntimeMultiSignature;
    SpRuntimeTokenError: SpRuntimeTokenError;
    SpRuntimeTransactionalError: SpRuntimeTransactionalError;
    SpSessionMembershipProof: SpSessionMembershipProof;
    SpStakingOffenceOffenceDetails: SpStakingOffenceOffenceDetails;
    SpVersionRuntimeVersion: SpVersionRuntimeVersion;
    SpWeightsRuntimeDbWeight: SpWeightsRuntimeDbWeight;
    SpWeightsWeightV2Weight: SpWeightsWeightV2Weight;
  } // InterfaceTypes
} // declare module
