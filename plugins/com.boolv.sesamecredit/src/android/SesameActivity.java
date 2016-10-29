package com.boolv.sesamecredit;

import android.widget.Toast;
import org.apache.cordova.*;
import android.app.Activity;
import android.os.Bundle;
import com.android.moblie.zmxy.antgroup.creditsdk.app.CreditApp;
import com.android.moblie.zmxy.antgroup.creditsdk.app.ICreditListener;
import com.android.moblie.zmxy.antgroup.creditsdk.app.SDKActivity;

import static org.apache.cordova.device.Device.TAG;

public class SesameActivity extends CordovaActivity {
//创建实例 CreditApp 是 SDK 的功能入口,所有的接口调用都得通过 CreditApp 进行调用。因此,调用 SDK,首先需 要创建一个 CreditApp 实例
/*  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // CreditApp 类 是SDK的主要实现类，开发者可用通过CreditApp类访问芝麻信用的授权等API。
    // 传入应用程序的全局context, 可通过activity 的 getApplicationContext 方法获取
     creditApp = CreditApp.getOnCreateInstance(this.getApplicationContext());
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
}
