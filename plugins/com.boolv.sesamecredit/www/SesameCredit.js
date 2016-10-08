/**
 * 芝麻信用插件
 *  潘维吉
 */

var exec = require('cordova/exec');
/**
 * 芝麻信用
 */
var SesameCredit =  {
  test : function(content1,content2) {
    alert(content1);
  exec(function(message) {
    alert("成功=="+message);
  }, function(message) {
    alert(message);
  }, "SesameCredit", "test", [content1,content2]);
}
};

module.exports = SesameCredit;



