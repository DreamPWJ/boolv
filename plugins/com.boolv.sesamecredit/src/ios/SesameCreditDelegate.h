// 芝麻信用 潘维吉
#import <UIKit/UIKit.h>
#import <Cordova/CDVPlugin.h>

@interface SesameCreditDelegate : CDVPlugin
@property (strong, nonatomic) UIWindow *window;

 //芝麻授权方法
- (void)sesamecredit:(CDVInvokedUrlCommand*)command;

@end

