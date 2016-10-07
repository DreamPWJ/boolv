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
  exec(null, null, "SesameCredit", "test", [content1,content2]);
}
};

module.exports = SesameCredit;



