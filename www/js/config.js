/**
 * Created by pwj on 2016/5/23.
 * 系统接口常量配置
 */
var configMod = angular.module("starter.config", []);

configMod.constant("BooLv", {
  "name": "BooLv", //项目名称
  "debug": false, //调试标示 暂无使用
  "api": "http://a.boolv.com",//接口服务地址  使用
  'siteUrl': "http://a.boolv.com",//仓库地址 暂无使用
  'imgUrl': "http://f.boolv.com",//图片地址 暂无使用
  'moblileApi':"http://m.boolv.com",//手机端服务  使用（分享链接展示调用）
  'version': '1.0.12' //版本号
});

