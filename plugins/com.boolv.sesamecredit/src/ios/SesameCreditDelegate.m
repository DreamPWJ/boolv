// 芝麻信用 潘维吉


#import "SesameCreditDelegate.h"
#import "ALCreditService.h"
#import <Cordova/CDVPlugin.h>

@implementation SesameCreditDelegate

- (void)pluginInitialize {

}
 //芝麻授权方法
- (void)sesamecredit:(CDVInvokedUrlCommand*)command{
  //ALCreditService是IOS SDK的功能入口，所有的接口调用都需要通过ALCreditService进行调用
 //[[ALCreditService sharedService] resgisterApp];

   // 商户需要从服务端获取
    NSString* params = [command.arguments objectAtIndex:0];

    NSString* sign = [command.arguments objectAtIndex:1];

    NSString* appId = @"1000697"; //博绿网 芝麻商户应用ID

   // [[ALCreditService sharedService] queryUserAuthReq:appId sign:sign params:params extParams:nil selector:@selector(result:) target:self];


   CDVPluginResult* pluginResult = nil;
   if (appId != nil && [appId length] > 0) {
                 NSMutableDictionary* dictionary = [[NSMutableDictionary alloc] init];
                  [dictionary setValue:params forKey:@"params"];
                  [dictionary setValue:sign forKey:@"sign"];
                  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:nil];
                  NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                  pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsonString];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    //回调方法
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.


    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
