/**
 * 芝麻信用插件
 *  潘维吉
 */

var exec = require('cordova/exec');
/**
 * 芝麻信用
 */
var SesameCredit = {
  /**
   * 一共5个参数
   第一个 :成功会掉
   第二个 :失败回调
   第三个 :将要调用的类的配置名字(在config.xml中配置 )
   第四个 :调用的方法名(一个类里可能有多个方法 靠这个参数区分)
   第五个 :传递的参数  以json的格式
   */
  sesamecredit: function (params, sign, success, error) { //芝麻授权调用原生android ios的方法
    exec(success, error, "SesameCredit", "sesamecredit", [params, sign]
    );
  },
  test: function (content1, content2) { //测试方法
    exec(function (message) {
      alert("test方法成功回调数据:" + message);
    }, function (message) {
      alert("test方法回调数据:" + message);
    }, "SesameCredit", "test", [content1, content2]);
  }


};

module.exports = SesameCredit;



