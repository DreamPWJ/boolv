/*
  芝麻信用 android SDK调用
  潘维吉
*/
package com.boolv.sesamecredit;

import android.view.Window;
import android.widget.Toast;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaArgs;
import org.json.JSONException;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import java.util.Set;
import com.android.moblie.zmxy.antgroup.creditsdk.app.CreditApp;
import com.android.moblie.zmxy.antgroup.creditsdk.app.ICreditListener;
import com.android.moblie.zmxy.antgroup.creditsdk.app.SDKActivity;

public class SesameCredit extends CordovaPlugin {
  private static final String TAG = "SesameCredit";
  public CallbackContext callbackContext;

  //创建实例 CreditApp 是 SDK 的功能入口,所有的接口调用都得通过 CreditApp 进行调用。因此,调用 SDK,首先需 要创建一个 CreditApp 实例
/*  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // CreditApp 类 是SDK的主要实现类，开发者可用通过CreditApp类访问芝麻信用的授权等API。
    // 传入应用程序的全局context, 可通过activity 的 getApplicationContext 方法获取
     creditApp = CreditApp.getOnCreateInstance(this.cordova.getActivity().getApplicationContext());
  }

  //所有的 SDK 接口调用,都会传入一个回调,用以接收 SDK 返回的调用结果
  //请求芝麻信用授权
  ICreditListener iCreditListener = new ICreditListener() {
    @Override
    public void onComplete(Bundle result) {
      Toast.makeText(SDKActivity.this, "complete", Toast.LENGTH_SHORT).show();
      if (result != null) {
        Set keys = result.keySet();
        for (String key : keys) {
          Log.d(TAG, key + " = " + result.getString(key));
        }
      }
    }

    @Override
    public void onError(Bundle error) {
      Toast.makeText(SDKActivity.this, "error", Toast.LENGTH_SHORT).show();
      if (error != null) {
        Set keys = error.keySet();
        for (String key : keys) {
          Log.d(TAG, key + " = " + error.getString(key));
        }
      }
    }

    @Override
    public void onCancel() {
      Toast.makeText(SDKActivity.this, "cancel", Toast.LENGTH_LONG).show();
    }
  };*/
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
    if ("test".equals(action)) {
      callbackContext.success("=====测试cordova插件" + args.getString(0));
      callbackContext.error("=====测试cordova插件" + args.getString(1));
      return true;
    }
     if("sesamecredit".equals(action)){

     }
    return false;
  }


}
