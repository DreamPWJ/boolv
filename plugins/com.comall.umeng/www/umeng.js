/**
 * 友盟社会化插件
 */
var exec = require('cordova/exec');

var umeng = function() {
};

/**
 * 分享
 * @param title {String} 分享标题
 * @param content {String} 分享内容
 * @param pic {String} 分享图片url
 * @param url {String} 分享内容跳转链接
 */
umeng.share = function(title, content, pic, url) {
  alert(55)
    exec(null, null, "UmengPlugin", "share", [title, content, pic, url]);
};

/**
 * 联合登录
 * @param type {String} 平台类型 QQ:qq, 微博:sina, 微信:wechat
 * @param success {Function} 成功回调，返回json字符串{"uid":"uid","name":"name"}
 * @param error {Function} 失败回调，返回错误信息
 */
umeng.login = function(type, success, error) {
    exec(success, error, "UmengPlugin", "login", [type]);
};

/**
 * 检查应用是否已安装
 * @param type {String} 平台类型 QQ:qq, 微博:sina, 微信:wechat
 * @param success {Function} 成功回调
 * @param error {Function} 失败回调，返回错误信息
 */
umeng.checkAppInstalled = function(type, success, error) {
    exec(success, error, "UmengPlugin", "checkAppInstalled", [type]);
};

/*
 * umeng统计的页面统计--进入view
 * @param 监测页面的页面主题  :例如 '#home'
 *
 * */
umeng.viewWillAppear = function(topic) {
    exec(null, null, "UmengPlugin", "viewWillAppear", [topic]);
};
/*
 * umeng统计的页面统计--离开view
 * @param 监测页面的页面主题  :例如 '#home'
 *
 * */
umeng.viewWillDisappear = function(topic) {
    exec(null, null, "UmengPlugin", "viewWillDisappear", [topic]);
};
/**
 * 友盟插件初始化，统计用
 */
umeng.init = function(){
    var data = [];
    exec(null, null, "UmengPlugin", "init", data);
};
module.exports = umeng;



