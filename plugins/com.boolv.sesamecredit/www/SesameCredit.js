/**
 * 芝麻信用插件
 *  潘维吉
 */

var exec = require('cordova/exec');
/**
 * 芝麻信用
 */
var SesameCredit = {
  
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



