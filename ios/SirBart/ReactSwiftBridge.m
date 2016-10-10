#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(WalkingDirectionsManager, NSObject)

RCT_EXTERN_METHOD(getWalkingDirectionsBetween:(double)startLat startLng:(double)startLng endLat:(double)endLat endLng:(double)endLng resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
