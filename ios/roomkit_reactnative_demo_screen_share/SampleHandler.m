//
//  SampleHandler.m
//  RunnerScreenShare
//
//  Created by zego on 2022/7/30.
//


#import "SampleHandler.h"
#import <ZegoRoomKitCore/ZegoRoomKitCore.h>

@interface SampleHandler ()<ZegoScreenShareServiceDelegate>

@end
@implementation SampleHandler

- (void)broadcastStartedWithSetupInfo:(NSDictionary<NSString *,NSObject *> *)setupInfo {
    // User has requested to start the broadcast. Setup info from the UI extension can be supplied but optional.
    [[ZegoScreenShareService sharedInstance] configWithAppGroup:@"group.im.zego.RoomKitRNDemo"];
    [ZegoScreenShareService sharedInstance].delegate = self;
    [[ZegoScreenShareService sharedInstance] startBroadcast];
}

- (void)broadcastPaused {
    // User has requested to pause the broadcast. Samples will stop being delivered.
}

- (void)broadcastResumed {
    // User has requested to resume the broadcast. Samples delivery will resume.
}

// 点击系统按钮的 ”停止直播“ 时调用，子线程调用
- (void)broadcastFinished {
    [[ZegoScreenShareService sharedInstance] broadcastFinished];
}

- (void)processSampleBuffer:(CMSampleBufferRef)sampleBuffer withType:(RPSampleBufferType)sampleBufferType {
    if (sampleBufferType == RPSampleBufferTypeVideo) {
        [[ZegoScreenShareService sharedInstance] sendVideoBufferToHostApp:sampleBuffer];
    }
}


#pragma mark - ZegoScreenShareSampleDelegate
- (void)onFinishBroadcastWithError:(NSError *)error
{
    [self finishBroadcastWithError:error];
}

@end
