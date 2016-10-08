/*
  芝麻信用 android SDK调用
  潘维吉
*/
package com.boolv.sesamecredit;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaArgs;
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
import android.content.Context;;

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
/*    final Activity activity = this.cordova.getActivity();
    final Window window = activity.getWindow();*/
    this.callbackContext = callbackContext;
    if ("test".equals(action)) {
      callbackContext.success("=====测试cordova插件"+args.getString(0));
      callbackContext.error("=====测试cordova插件"+args.getString(1));
      return true;
    }


    return false;
  }


}
