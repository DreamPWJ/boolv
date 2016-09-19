package com.comall.umeng;

import java.util.Map;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.content.Context;

import com.umeng.socialize.bean.HandlerRequestCode;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.controller.UMServiceFactory;
import com.umeng.socialize.controller.UMSocialService;
import com.umeng.socialize.controller.listener.SocializeListeners.UMAuthListener;
import com.umeng.socialize.controller.listener.SocializeListeners.UMDataListener;
import com.umeng.socialize.exception.SocializeException;
import com.umeng.socialize.media.QQShareContent;
import com.umeng.socialize.media.QZoneShareContent;
import com.umeng.socialize.media.SinaShareContent;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.sso.QZoneSsoHandler;
import com.umeng.socialize.sso.SinaSsoHandler;
import com.umeng.socialize.sso.UMQQSsoHandler;
import com.umeng.socialize.sso.UMSsoHandler;
import com.umeng.socialize.weixin.controller.UMWXHandler;
import com.umeng.socialize.weixin.media.CircleShareContent;
import com.umeng.socialize.weixin.media.WeiXinShareContent;

import com.umeng.analytics.MobclickAgent;
import com.umeng.analytics.MobclickAgent.EScenarioType;
import com.umeng.analytics.MobclickAgent.UMAnalyticsConfig;

public class UmengPlugin extends CordovaPlugin{

    private Activity activity;
    private UMSocialService shareController;
    private UMSocialService loginController;
    private final String mPageName = "UMAnalyticsHome";
    private static Context mContext;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        this.activity = cordova.getActivity();
        cordova.setActivityResultCallback(this);
        this.shareController  = UMServiceFactory.getUMSocialService("com.umeng.share");
        this.shareController.getConfig().setSsoHandler(new SinaSsoHandler());
        this.shareController.getConfig().removePlatform(SHARE_MEDIA.TENCENT);
        this.shareController.getConfig().setPlatformOrder(SHARE_MEDIA.WEIXIN, SHARE_MEDIA.WEIXIN_CIRCLE, SHARE_MEDIA.QQ, SHARE_MEDIA.QZONE, SHARE_MEDIA.SINA);

        this.loginController = UMServiceFactory.getUMSocialService("com.umeng.login");
        this.loginController.getConfig().setSsoHandler(new SinaSsoHandler());

        // ApplicationInfo info = activity.getPackageManager().getApplicationInfo(activity.getPackageName(), PackageManager.GET_META_DATA);

        // 添加QQ平台
        String qqAppKey = preferences.getString("QQ_APPKEY", "");
        String qqAppSecret = preferences.getString("QQ_APPSECRET", "");
        UMQQSsoHandler qqSsoHandler = new UMQQSsoHandler(this.activity, qqAppKey, qqAppSecret);
        qqSsoHandler.addToSocialSDK();
        QZoneSsoHandler qZoneSsoHandler = new QZoneSsoHandler(this.activity, qqAppKey, qqAppSecret);
        qZoneSsoHandler.addToSocialSDK();

        // 添加微信平台
        String wechatAppKey = preferences.getString("WECHAT_APPKEY", "");
        String wechatAppSecret = preferences.getString("WECHAT_APPSECRET", "");
        UMWXHandler wxHandler = new UMWXHandler(this.activity, wechatAppKey, wechatAppSecret);
        wxHandler.addToSocialSDK();
        // 支持微信朋友圈
        UMWXHandler wxCircleHandler = new UMWXHandler(this.activity, wechatAppKey, wechatAppSecret);
        wxCircleHandler.setToCircle(true);
        wxCircleHandler.addToSocialSDK();

        //统计
        String umAppKey = preferences.getString("UMENG_APPKEY_ANDROID", "");
        String umAppChannel = preferences.getString("UMENG_CHANNEL", "");
        Log.d("UMengPlugin","umAppKey="+umAppKey+", umAppChannel="+umAppChannel);

        mContext = this.cordova.getActivity().getApplicationContext();
        //MobclickAgent.setDebugMode(true);
        MobclickAgent.openActivityDurationTrack(false);
        MobclickAgent.startWithConfigure(new UMAnalyticsConfig(mContext, umAppKey, umAppChannel, EScenarioType.E_UM_NORMAL));

        //MobclickAgent.setScenarioType(mContext, EScenarioType.E_UM_NORMAL);
    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {

        // 分享
        if ("share".equals(action)) {
            // qq
            QQShareContent qqShareContent = new QQShareContent();
            qqShareContent.setTitle(args.getString(0));
            qqShareContent.setShareContent(args.getString(1));
            qqShareContent.setShareImage(new UMImage(this.activity, args.getString(2)));
            qqShareContent.setTargetUrl(args.getString(3));
            this.shareController.setShareMedia(qqShareContent);
            // qzone
            QZoneShareContent qzone = new QZoneShareContent();
            qzone.setTitle(args.getString(0));
            qzone.setShareContent(args.getString(1));
            qzone.setShareImage(new UMImage(this.activity, args.getString(2)));
            qzone.setTargetUrl(args.getString(3));
            this.shareController.setShareMedia(qzone);
            // 微博
            SinaShareContent sina = new SinaShareContent();
            sina.setTitle(args.getString(0));
            sina.setShareContent(args.getString(1) + ", " + args.getString(3));
            sina.setShareImage(new UMImage(this.activity, args.getString(2)));
            this.shareController.setShareMedia(sina);
            // 微信
            WeiXinShareContent weixinContent = new WeiXinShareContent();
            weixinContent.setTitle(args.getString(0));
            weixinContent.setShareContent(args.getString(1));
            weixinContent.setShareImage(new UMImage(this.activity, args.getString(2)));
            weixinContent.setTargetUrl(args.getString(3));
            this.shareController.setShareMedia(weixinContent);
            // 微信朋友圈
            CircleShareContent circleMedia = new CircleShareContent();
            circleMedia.setTitle(args.getString(1));
            circleMedia.setShareContent(args.getString(1));
            circleMedia.setShareImage(new UMImage(this.activity, args.getString(2)));
            circleMedia.setTargetUrl(args.getString(3));
            this.shareController.setShareMedia(circleMedia);

            this.activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    shareController.openShare(activity, false);
                }
            });
            return true;
        }

        // 联合登录
        if ("login".equals(action)) {
            String type = args.getString(0);
            SHARE_MEDIA platformTemp = null;

            if (type.equals("sina")) {
                platformTemp = SHARE_MEDIA.SINA;
            } else if (type.equals("qq")) {
                platformTemp = SHARE_MEDIA.QQ;
            } else if (type.equals("wechat")) {
                platformTemp = SHARE_MEDIA.WEIXIN;
            } else {
                return false;
            }

            final SHARE_MEDIA platform = platformTemp;
            this.activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    loginController.doOauthVerify(activity, platform, new UMAuthListener() {
                        @Override
                        public void onError(SocializeException e, SHARE_MEDIA platform) {
                            callbackContext.error("授权失败"+e.getMessage());
                        }
                        @Override
                        public void onComplete(Bundle value, final SHARE_MEDIA platform) {
                            String uid = value.getString("uid");
                            if (value != null && !TextUtils.isEmpty(uid)) {
                                try {
                                    final JSONObject json = new JSONObject();
                                    json.put("uid", uid);
                                    loginController.getPlatformInfo(activity, platform, new UMDataListener() {
                                        @Override
                                        public void onStart() {}
                                        @Override
                                        public void onComplete(int status, Map<String, Object> info) {
                                            if(status == 200 && info != null){
                                                try {
                                                    String name = "";
                                                    if (platform.equals(SHARE_MEDIA.WEIXIN)) {
                                                        name = info.get("nickname").toString();
                                                    } else {
                                                        name = info.get("screen_name").toString();
                                                    }
                                                    json.put("name", name);

													for(String key : info.keySet()) {
														json.put(key, info.get(key).toString());
													}	

                                                    // String gender = info.get("gender").toString();
                                                    // if (gender.equals("1")) {
                                                    //     gender = "男";
                                                    // } else if (gender.equals("0")) {
                                                    //     gender = "女";
                                                    // }
                                                    // json.put("gender", gender);
                                                    callbackContext.success(json.toString());
                                                } catch (JSONException e) {
                                                    e.printStackTrace();
                                                    callbackContext.error("授权失败");
                                                }
                                            }else{
                                                callbackContext.error("授权失败");
                                           }
                                        }
                                    });
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                    callbackContext.error("授权失败" + e.getMessage());
                                }
                            } else {
                                callbackContext.error("授权失败,uid不存在");
                            }
                        }
                        @Override
                        public void onCancel(SHARE_MEDIA platform) {
                            callbackContext.error("授权取消");
                        }
                        @Override
                        public void onStart(SHARE_MEDIA platform) {}
                    });
                }
            });
            return true;
        }

        // 统计开始
        if ("viewWillAppear".equals(action)) {
            MobclickAgent.onPageStart(args.getString(0));
            MobclickAgent.onResume(activity);
        }
        if ("viewWillDisappear".equals(action)) {
            MobclickAgent.onPageEnd(args.getString(0));
            MobclickAgent.onPause(activity);
        }
        //用户退出
        if ("onKillProcess".equals(action)) {
            onKillProcess();
        }

        // 检查应用是否安装
        if ("checkAppInstalled".equals(action)) {
            String type = args.getString(0);
            boolean installed = false;

            if (type.equals("qq")) {
                installed = loginController.getConfig().getSsoHandler(HandlerRequestCode.QQ_REQUEST_CODE).isClientInstalled();
            } else if (type.equals("wechat")) {
                installed = loginController.getConfig().getSsoHandler(HandlerRequestCode.WX_REQUEST_CODE).isClientInstalled();
            } else {
                return false;
            }
            callbackContext.success(installed ? "1" : "0");
            return true;
        }

        return false;
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(false);
        //Log.d("UMengPlugin","onResume");
        MobclickAgent.onPageStart(mPageName);
        MobclickAgent.onResume(activity);
    }

    @Override
    public void onPause(boolean multitasking) {
        super.onPause(false);
        //Log.d("UMengPlugin","onPause");
        MobclickAgent.onPageEnd(mPageName);
        MobclickAgent.onPause(activity);
        onKillProcess();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMSsoHandler ssoHandler = this.shareController.getConfig().getSsoHandler(requestCode) ;
        if(ssoHandler != null){
           ssoHandler.authorizeCallBack(requestCode, resultCode, data);
           return;
        }

        ssoHandler = this.loginController.getConfig().getSsoHandler(requestCode);
        if(ssoHandler != null){
           ssoHandler.authorizeCallBack(requestCode, resultCode, data);
           return;
        }
    }

    void onKillProcess() {
        MobclickAgent.onKillProcess(mContext);
    }

}
