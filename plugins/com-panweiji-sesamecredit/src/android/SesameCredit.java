/*
  芝麻信用 android SDK调用
  潘维吉
*/
package com.panweiji.sesamecredit;

import android.app.Activity;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import org.json.JSONException;

public class SesameCredit extends CordovaPlugin {
  private static final String TAG = "SesameCredit";

  @Override
  public void initialize(final CordovaInterface cordova, CordovaWebView webView) {

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
    Log.v(TAG, "执行的方法是: " + action);
    final Activity activity = this.cordova.getActivity();
    final Window window = activity.getWindow();

    if ("test".equals(action)) {
      System.out.println("第一个参数：" + args.getString(0));
      System.out.println("第二个参数：" + args.getString(1));
      System.out.println("=====测试cordova插件");
      return true;
    }


    return false;
  }


}
