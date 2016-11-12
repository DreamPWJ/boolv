// 芝麻信用 潘维吉


#import "SesameCreditDelegate.h"
#import "ALCreditService.h"
#import <Cordova/CDVPlugin.h>

@implementation SesameCreditDelegate

- (void)pluginInitialize {
  //ALCreditService是IOS SDK的功能入口，所有的接口调用都需要通过ALCreditService进行调用
  [[ALCreditService sharedService] resgisterApp];
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
}

//芝麻授权回调返回结果数据
- (void)result:(NSMutableDictionary*)dic{
    NSLog(@"芝麻授权回调返回结果数据result ");

    NSString* system  = [[UIDevice currentDevice] systemVersion];
    if([system intValue]>=7){
        self.navigationController.navigationBar.barTintColor = [UIColor whiteColor];
    }

}
 //芝麻授权方法
- (void)sesamecredit:(CDVInvokedUrlCommand*)command{


   // 商户需要从服务端获取
    NSString* params = [command.arguments objectAtIndex:0];

    NSString* sign = [command.arguments objectAtIndex:1];

    NSString* appId = @"1000697"; //博绿网 芝麻商户应用ID

   [[ALCreditService sharedService] queryUserAuthReq:appId sign:sign params:params extParams:nil selector:@selector(result:) target:self];


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




@end
