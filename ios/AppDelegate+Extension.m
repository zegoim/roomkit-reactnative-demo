//
//  AppDelegate+Extension.m
//  roomkit_reactnative_demo
//
//  Created by liquan on .
//

#import "AppDelegate+Extension.h"
#import <Bugly/Bugly.h>
@implementation AppDelegate (Extension)

- (void)configBugly {
#ifndef DEBUG
    BuglyConfig *config = [BuglyConfig new];
    config.blockMonitorEnable = YES;
    [Bugly startWithAppId:@"74ea7a20e0" config:config];
#endif
}


@end
