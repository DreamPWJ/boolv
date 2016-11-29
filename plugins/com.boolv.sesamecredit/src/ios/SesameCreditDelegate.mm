// 芝麻信用 潘维吉


#import "SesameCreditDelegate.h"
#import "ALCreditService.h"
#import "ViewController.h"
#import <Cordova/CDVPlugin.h>
@interface SesameCreditDelegate ()
@property (strong, nonatomic) UINavigationController *navController;
@end

@implementation SesameCreditDelegate

//芝麻授权初始化方法
- (void)pluginInitialize {
  //ALCreditService是IOS SDK的功能入口，所有的接口调用都需要通过ALCreditService进行调用
  //注册应用
  [[ALCreditService sharedService] resgisterApp];

    //self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    //ViewController* controller = [[ViewController alloc] init];

    //self.navController = [[UINavigationController alloc] init];
    //[self.navController pushViewController:controller animated:YES];

    //[controller.view setBackgroundColor:[UIColor whiteColor]];
    //self.window.rootViewController = self.navController;

    //[self.window makeKeyAndVisible];

}

//芝麻授权回调返回结果数据方法
- (void)result:(NSMutableDictionary*)dic{
    NSLog(@"芝麻授权回调返回结果数据result ");
    //芝麻信用返回给我们的字典就是这的dic
     NSLog(@"=====params= ",dic[@"params"]);
}
 //芝麻授权方法
- (void)sesamecredit:(CDVInvokedUrlCommand*)command{
   self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    ViewController* controller = [[ViewController alloc] init];

    self.navController = [[UINavigationController alloc] init];
    [self.navController pushViewController:controller animated:YES];

    [controller.view setBackgroundColor:[UIColor whiteColor]];
    self.window.rootViewController = self.navController;

   //[self.window makeKeyAndVisible];

   // 商户需要从服务端获取
    NSString* params = [command.arguments objectAtIndex:0];

    NSString* sign = [command.arguments objectAtIndex:1];

    NSString* appId = @"1000697"; //博绿网 芝麻商户应用ID
   NSLog(@"=====目标controller,商户Controller必须是基于Navigation Controller= ",self.navController);
   //目标controller,商户Controller必须是基于Navigation Controller  不能为nil 只有控制器才能控制页面跳转
   //  使用queryUserAuthReq方法进行授权验证 由于sdk里面有用到c编译,请把调用queryUserAuthReq的controller后缀名改成.mm
   [[ALCreditService sharedService] queryUserAuthReq:appId sign:sign params:params extParams:nil selector:@selector(result:) target:self.navController];

 //  CDVPluginResult* pluginResult = nil;
 // if (appId != nil && [appId length] > 0) {
  //               NSMutableDictionary* dictionary = [[NSMutableDictionary alloc] init];
  //                [dictionary setValue:params forKey:@"params"];
  //                [dictionary setValue:sign forKey:@"sign"];
  //                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:nil];
  //                NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  //                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsonString];
 //   } else {
  //      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
  //  }

    //回调方法
    //[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.

    [[ALCreditService sharedService] resgisterApp];

    return YES;
}
@end
