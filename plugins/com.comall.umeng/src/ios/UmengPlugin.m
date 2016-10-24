#import "UmengPlugin.h"
#import "MobClick.h"
#import "UMSocial.h"
#import "UMSocialSinaHandler.h"
#import "UMSocialQQHandler.h"
#import "UMSocialWechatHandler.h"
#import "WXApi.h"
#import <Cordova/CDV.h>

@implementation UmengPlugin

- (void)pluginInitialize {
    NSDictionary *settings = [self.commandDelegate settings];
    NSString *umengAppKey = [settings objectForKey:@"umeng_appkey"];
    NSString *qqAppKey = [settings objectForKey:@"qq_appkey"];
    NSString *qqAppSecret = [settings objectForKey:@"qq_appsecret"];
    NSString *wechatAppKey = [settings objectForKey:@"wechat_appkey"];
    NSString *wechatAppSecret = [settings objectForKey:@"wechat_appsecret"];

    //打开调试模式
    [MobClick setLogEnabled:YES];

    UMConfigInstance.appKey = umengAppKey;
    UMConfigInstance.ChannelId = @"";
    [MobClick startWithConfigure:UMConfigInstance];


    // 友盟初始化
    [UMSocialData setAppKey:umengAppKey];
    // 添加新浪微博
    [UMSocialSinaHandler openSSOWithRedirectURL:@"http://sns.whalecloud.com/sina2/callback"];
    // 添加QQ
    [UMSocialQQHandler setQQWithAppId:qqAppKey appKey:qqAppSecret url:@"http://mobile.umeng.com/social"];
    // 添加微信
    [UMSocialWechatHandler setWXAppId:wechatAppKey appSecret:wechatAppSecret url:@"http://mobile.umeng.com/social"];
}

- (void)share:(CDVInvokedUrlCommand*)command
{
    [[UMSocialData defaultData].urlResource setResourceType:UMSocialUrlResourceTypeImage url:[command.arguments objectAtIndex:2]];

    [UMSocialData defaultData].extConfig.wechatSessionData.title = [command.arguments objectAtIndex:0];
    [UMSocialData defaultData].extConfig.wechatSessionData.url = [command.arguments objectAtIndex:3];
    [UMSocialData defaultData].extConfig.wechatTimelineData.title = [command.arguments objectAtIndex:1];
    [UMSocialData defaultData].extConfig.wechatTimelineData.url = [command.arguments objectAtIndex:3];
    [UMSocialData defaultData].extConfig.qqData.title = [command.arguments objectAtIndex:0];
    [UMSocialData defaultData].extConfig.qqData.url = [command.arguments objectAtIndex:3];
    [UMSocialData defaultData].extConfig.qzoneData.title = [command.arguments objectAtIndex:0];
    [UMSocialData defaultData].extConfig.qzoneData.url = [command.arguments objectAtIndex:3];
    [UMSocialSnsService presentSnsIconSheetView:self.viewController
                                         appKey:nil
                                      shareText:[command.arguments objectAtIndex:1]
                                     shareImage:nil
                                shareToSnsNames:[NSArray arrayWithObjects: UMShareToWechatSession, UMShareToWechatTimeline, UMShareToSina, UMShareToQQ, UMShareToQzone, nil]
                                       delegate:self];
}//by xuf
-(BOOL)isDirectShareInIconActionSheet
{
    return YES;
}

- (void)login:(CDVInvokedUrlCommand*)command
{
    NSString* type = [command.arguments objectAtIndex:0];
    NSString* platform = nil;

    if ([type isEqualToString:@"sina"]) {
        platform = UMShareToSina;
    } else if ([type isEqualToString:@"qq"]) {
        platform = UMShareToQQ;
    } else if ([type isEqualToString:@"wechat"]) {
        platform = UMShareToWechatSession;
    } else {
        return;
    }

    UMSocialSnsPlatform* snsPlatform = [UMSocialSnsPlatformManager getSocialPlatformWithName:platform];
    snsPlatform.loginClickHandler(self.viewController, [UMSocialControllerService defaultControllerService],YES,^(UMSocialResponseEntity *response){

        CDVPluginResult* pluginResult = nil;

        if (response.responseCode == UMSResponseCodeSuccess) {

            UMSocialAccountEntity *snsAccount = [[UMSocialAccountManager socialAccountDictionary] valueForKey:platform];
            NSLog(@"username is %@, uid is %@, token is %@ url is %@",snsAccount.userName,snsAccount.usid,snsAccount.accessToken,snsAccount.iconURL);

            NSMutableDictionary* dictionary = [[NSMutableDictionary alloc] init];
            [dictionary setValue:snsAccount.usid forKey:@"uid"];
            [dictionary setValue:snsAccount.userName forKey:@"name"];
            [dictionary setValue:snsAccount.iconURL forKey:@"headimgurl"];
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary options:NSJSONWritingPrettyPrinted error:nil];
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsonString];

        } else if (response.responseCode == UMSResponseCodeCancel) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"授权取消"];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"授权失败"];
        }

        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    });

}

- (void)checkAppInstalled:(CDVInvokedUrlCommand *)command {
    NSString* type = [command.arguments objectAtIndex:0];
    CDVPluginResult* pluginResult = nil;

    if ([type isEqualToString:@"qq"]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[QQApi isQQInstalled]];
    } else if ([type isEqualToString:@"wechat"]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[WXApi isWXAppInstalled]];
    } else {
        return;
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)handleOpenURL:(NSNotification *)notification {
    NSURL* url = [notification object];
    NSString* scheme = [url scheme];

    if ([scheme hasPrefix:@"QQ"] || [scheme hasPrefix:@"tencent"] || [scheme hasPrefix:@"sina"] || [scheme hasPrefix:@"wx"]) {
        [UMSocialSnsService handleOpenURL:url];
    }
}

- (void)viewWillAppear:(CDVInvokedUrlCommand *)command {
    NSString* topic = [command.arguments objectAtIndex:0];
    [MobClick beginLogPageView:topic];
}

- (void)viewWillDisappear:(CDVInvokedUrlCommand *)command {
    NSString* topic = [command.arguments objectAtIndex:0];
    [MobClick endLogPageView:topic];
}
- (void)init:(CDVInvokedUrlCommand *)command {}
@end
