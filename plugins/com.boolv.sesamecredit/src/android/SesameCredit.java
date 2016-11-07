
/**
 * js调用java方法
 * 必须继承CordovaPlugin
 * 芝麻信用 android SDK调用
 * 潘维吉
 */
package com.boolv.sesamecredit;

import android.view.Window;
import android.widget.Toast;
import com.boolv.sesamecredit.CreditAuthHelper;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaArgs;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Intent;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import com.android.moblie.zmxy.antgroup.creditsdk.app.CreditApp;
import com.android.moblie.zmxy.antgroup.creditsdk.app.ICreditListener;

public class SesameCredit extends CordovaPlugin {
  private static final String TAG = "SesameCredit";
  public CallbackContext callbackContext;
  private Activity activity;

  /**
   * Sets the context of the Command. This can then be used to do things like
   * get file paths associated with the Activity.
   *
   * @param cordova The context of the main Activity.
   * @param webView The CordovaWebView Cordova is running in.
   */
  @Override
  public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
    Log.v(TAG, "SesameCredit: initialization");
    this.activity = cordova.getActivity();
    //设置在插件中时被调用的子activity活动 不同activity直接结果返回回调
    cordova.setActivityResultCallback(this);
  }


  //应用调用 Andriod_SDK 接口时,如果要成功接收到回调,需要在调用接口的 Activity 的 onActivityResult 方法中
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    Log.d(TAG, "SesameCredit.onActivityResult");
    super.onActivityResult(requestCode, resultCode, data);
    // 回调事件相应
    CreditApp.onActivityResult(requestCode, resultCode, data);
  }

  /**
   * Executes the request and returns PluginResult.
   *
   * @param action          The action to execute.
   * @param args            JSONArry of arguments for the plugin.
   * @param callbackContext The callback id used when calling back into JavaScript.
   * @return True if the action was valid, false otherwise.
   */
  @Override
  public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext) throws JSONException {
    Log.i(TAG, "执行的方法是: " + action);
/*    Activity activity = this.cordova.getActivity();
    Window window = activity.getWindow();*/
    if ("sesamecredit".equals(action)) {  //芝麻授权
      //请由商户服务端生成下发，具体见开放平台商户对接文档
      //请注意params、sign为encode过后的数据
      String params = args.getString(0);
      String appId = "1000697";//博绿网 芝麻商户应用ID
      String sign = args.getString(1);
      //请求芝麻信用授权方法
      this.doCreditRequest(params, appId, sign, activity, callbackContext);
      return true;
    }

    if ("test".equals(action)) { //测试方法
      callbackContext.success("cordova插件成功返回参数=" + args.getString(0));
      callbackContext.error("cordova插件失败返回参数=" + args.getString(1));
      return true;
    }
    return false;
  }

  //传入参数  请求芝麻信用授权
  private void doCreditRequest(String params, String appId, String sign, Activity activity, final CallbackContext callbackContext) {
    //extParams参数可以放置一些额外的参数，例如当biz_params参数忘记组织auth_code参数时，可以通过extParams参数带入auth_code。
    //不过建议auth_code参数组织到biz_params里面进行加密加签。
    Map<String, String> extParams = new HashMap<String, String>();
    //extParams.put("auth_code", "M_FACE");
    Toast.makeText(cordova.getActivity(), "博绿网芝麻信用授权中", Toast.LENGTH_SHORT).show();
    //返回数据json接收
    final JSONObject json = new JSONObject();
    try {
      //请求授权
      //应用在调用 SDK 提供的接口时,将实现了对应回调接口的实例传入。当 SDK 的接口调用完成后,如授权 调用完成后,会回调传入的接口实例。
      CreditAuthHelper.creditAuth(activity, appId, params, sign, extParams, new ICreditListener() {
        @Override
        public void onComplete(Bundle result) {

          //从result中获取params参数,然后解析params数据,可以获取open_id。
          if (result != null) {
            Set<String> keys = result.keySet();
            for (String key : keys) {
              Log.d(TAG, key + " = " + result.getString(key));
              //params 商家服务器端解密后的值的格式是 key1=value1&key2=value2 包含27位的芝麻客户open_id
              try {
                json.put(key, result.getString(key).toString());
              } catch (JSONException e) {
                e.printStackTrace();
              }
            }
            callbackContext.success(json.toString());
          }
        }

        @Override
        public void onError(Bundle result) {
          Toast.makeText(cordova.getActivity(), "芝麻信用授权失败", Toast.LENGTH_SHORT).show();
          Log.d(TAG, "doCreditAuthRequest.onError.");
        }

        @Override
        public void onCancel() {
          Toast.makeText(cordova.getActivity(), "芝麻信用授权取消", Toast.LENGTH_SHORT).show();
          Log.d(TAG, "doCreditAuthRequest.onCancel.");
        }
      });
    } catch (Exception e) {
      Log.e(TAG, "doCreditAuthRequest.exception=" + e.toString());
    }
  }
}
