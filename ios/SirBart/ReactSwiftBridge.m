#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(WalkingDirectionsManager, NSObject)

RCT_EXTERN_METHOD(getWalkingDirectionsBetween:(Double *)startLat startLng:(Double *)startLng endLat:(Double *)endLat endLng:(Double *)endLng resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
