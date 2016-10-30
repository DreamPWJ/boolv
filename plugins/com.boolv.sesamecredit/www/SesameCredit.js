/**
 * 芝麻信用插件
 *  潘维吉
 */

var exec = require('cordova/exec');
/**
 * 芝麻信用
 */
var SesameCredit = {
  test: function (content1, content2) {
    exec(function (message) {
      alert("成功==" + message);
    }, function (message) {
      alert(message);
    }, "SesameCredit", "test", [content1, content2]);
  },
  sesamecredit: function (params, sign,success, error) { //芝麻授权
    exec( success, error, "SesameCredit", "sesamecredit", [params, sign]
);}

};

module.exports = SesameCredit;



