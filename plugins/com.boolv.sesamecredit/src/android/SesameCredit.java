/*
  芝麻信用 android SDK调用
  潘维吉
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
import org.json.JSONException;
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
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    Log.d(TAG, "SesameCredit.onActivityResult");
    //onActivityResult callback
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
  public boolean execute(final String action, final CordovaArgs args, final CallbackContext callbackContext) throws JSONException {
    Log.i(TAG, "执行的方法是: " + action);
    final Activity activity = this.cordova.getActivity();
    final Window window = activity.getWindow();
    this.callbackContext = callbackContext;
    if ("sesamecredit".equals(action)) {  //芝麻授权
      //请由商户服务端生成下发，具体见开放平台商户对接文档
      //请注意params、sign为encode过后的数据
      String params = args.getString(0);
      String appId = "1000697";//博绿网 芝麻商户应用ID
      String sign = args.getString(1);
      //extParams参数可以放置一些额外的参数，例如当biz_params参数忘记组织auth_code参数时，可以通过extParams参数带入auth_code。
      //不过建议auth_code参数组织到biz_params里面进行加密加签。
      Map<String, String> extParams = new HashMap<String, String>();
      //extParams.put("auth_code", "M_FACE");
      Toast.makeText(cordova.getActivity(), "博绿网芝麻信用授权中", Toast.LENGTH_SHORT).show();
      try {
        //请求授权
        CreditAuthHelper.creditAuth(activity, appId, params, sign, extParams, new ICreditListener() {
          @Override
          public void onComplete(Bundle result) {
            Toast.makeText(cordova.getActivity(), "芝麻信用授权完成", Toast.LENGTH_SHORT).show();
            //从result中获取params参数,然后解析params数据,可以获取open_id。
            if (result != null) {
              Set<String> keys = result.keySet();
              for (String key : keys) {
                Log.d(TAG, key + " = " + result.getString(key));
              }
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
      return true;
    }

    if ("test".equals(action)) { //测试方法
      callbackContext.success("cordova插件成功返回参数=" + args.getString(0));
      callbackContext.error("cordova插件失败返回参数=" + args.getString(1));
      return true;
    }
    return false;
  }

  //传入参数  请求芝麻信用授权 未使用
  private void doCreditRequest() {
    //测试数据，此部分数据，请由商户服务端生成下发，具体见开放平台商户对接文档
    //请注意params、sign为encode过后的数据
    String params = "ApO88WwMflzmDXYX1aTdnz0L3%2FUF8kHXtd5GF1tFJKzDSo2tmOcRmaoDYGiSNUpVyx4jqWl2HgM30v0hOXNDUlKA5ZGrExYmT5qMPbtplGFHpJe4k%2ByZHHIz6CJFuYcq8b2fGMg%2FXAH0Hq2XV2Yhu9ZOahx5W8ryJPnBh8kt1ks%3D";
    String appId = "1000697";//博绿网 芝麻商户应用ID
    String sign = "XusqllQQjawQPF2pmFelPuWrS6zLwLpTzKG5HoSNDyYEshqdjjs1MgOAL7LP8RHceCLu5PPh5SbKAM0ghtR5e%2FvA25eeOY1V4WAVtQq%2FGer197sUNzJsXONAgGAT1ukwJ%2FTIGew384iqRXIf4nV%2BcUjCmlWTC7NXkwKgBE%2FrNdo%3D";
    //extParams参数可以放置一些额外的参数，例如当biz_params参数忘记组织auth_code参数时，可以通过extParams参数带入auth_code。
    //不过建议auth_code参数组织到biz_params里面进行加密加签。
    Map<String, String> extParams = new HashMap<String, String>();
    //extParams.put("auth_code", "M_FACE");

    try {
      final Activity activity = this.cordova.getActivity();
      //请求授权
      CreditAuthHelper.creditAuth(activity, appId, params, sign, extParams, new ICreditListener() {
        @Override
        public void onComplete(Bundle result) {
          //从result中获取params参数,然后解析params数据,可以获取open_id。
          if (result != null) {
            Set<String> keys = result.keySet();
            for (String key : keys) {
              Log.d(TAG, key + " = " + result.getString(key));
            }
          }
        }

        @Override
        public void onError(Bundle result) {
          Log.d(TAG, "doCreditAuthRequest.onError.");
        }

        @Override
        public void onCancel() {
          Log.d(TAG, "doCreditAuthRequest.onCancel.");
        }
      });
    } catch (Exception e) {
      Log.e(TAG, "doCreditAuthRequest.exception=" + e.toString());
    }
  }
}
