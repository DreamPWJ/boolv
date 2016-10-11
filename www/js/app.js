// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.config', 'starter.directive', 'ngCordova','ionic-native-transitions'])

  .run(function ($ionicPlatform, $rootScope, $ionicPopup, $location, $ionicHistory,$cordovaToast) {
    localStorage.setItem("start", 1);
    $ionicPlatform.ready(function () {
      if (window.StatusBar) {
        //状态栏颜色设置
        // org.apache.cordova.statusbar required
        if($ionicPlatform.is('ios')){
          StatusBar.styleLightContent();
        }
        if($ionicPlatform.is('android')){
          StatusBar.backgroundColorByHexString("#11c1f3");
        }

      }
      //主页面显示退出提示框
      $ionicPlatform.registerBackButtonAction(function (e) {
        e.preventDefault();
        function showConfirm() {
          var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '你确定要退出博绿网应用吗?',
            okText: '退出',
            cancelText: '取消',
            okType: 'button-calm',
            cancelType: 'button-assertive'
          });

          confirmPopup.then(function (res) {
            if (res) {
              ionic.Platform.exitApp();
            } else {
              // Don't close
            }
          });
        }

        // Is there a page to go back to? 制定页面返回退出程序
        if ($location.path() == '/tab/main') {
          if ($rootScope.backButtonPressedOnceToExit) {
            showConfirm();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortCenter('再按返回退出博绿网');
            setTimeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 3000);
          }

        } else if ($ionicHistory.backView()) {
          // Go back in history
          $ionicHistory.goBack();
        } else {
        }

        return false;
      }, 101);

      //hide splash immediately 加载完成立刻隐藏启动画面
      if (navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }

      //打开外部网页
      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }

      //启动极光推送服务
        try{
          window.plugins.jPushPlugin.init();
        }catch (e){
          console.log(e);
        }
      //调试模式，这样报错会在应用中弹出一个遮罩层显示错误信息
      //window.plugins.jPushPlugin.setDebugMode(true);

      //页面   A->B  B的缓存是清掉的，B->C->B B的缓存是保留
/*      $rootScope.clearcacheInfo = [];
      $rootScope.$on('$ionicView.beforeEnter', function (event, data) {
        var history = $ionicHistory.forwardView();
        if (history && history.stateName) {
          $rootScope.clearcacheInfo.push(history.stateName);
        }

      });
      $rootScope.$on('$ionicView.afterEnter', function (event, data) {
        if ($rootScope.clearcacheInfo.length > 0)
        {
          $ionicHistory.clearCache($rootScope.clearcacheInfo).then(function () {
            $rootScope.clearcacheInfo = [];
          });
        }
      });*/

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,$ionicNativeTransitionsProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-chevron-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-chevron-left');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    //设置默认返回按钮的文字
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    //原生动画效果统一配置
    $ionicNativeTransitionsProvider.setDefaultOptions({
      duration: 200, // in milliseconds (ms), default 400,
    });
    $ionicNativeTransitionsProvider.setDefaultTransition({
      type: 'slide',
      direction: 'left'
    });
    $ionicNativeTransitionsProvider.setDefaultBackTransition({
      type: 'slide',
      direction: 'right'
    });

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'
      })

      // Each tab has its own nav history stack:
      //APP首页面
      .state('tab.main', {
        url: '/main',
        nativeTransitions: null,
        views: {
          'tab-main': {
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl'
          }
        }
      })
      //APP初次启动轮播图片
      .state('start', {
        url: '/start',
        templateUrl: 'templates/start.html',
        controller: 'StartCtrl'

      })
      //实时报价
      .state('currenttimeoffer', {
        url: '/currenttimeoffer/:GrpID',
        templateUrl: 'templates/maindetails/currenttimeoffer.html',
        controller: 'CurrentTimeOfferCtrl'

      })
      //交易公告
      .state('dealnotice', {
        url: '/dealnotice/:Id',
        templateUrl: 'templates/maindetails/dealnotice.html',
        controller: 'DealNoticeCtrl'

      })
      //公司新闻
      .state('companytrends', {
        url: '/companytrends/:Id',
        templateUrl: 'templates/maindetails/companytrends.html',
        controller: 'CompanyTrendsCtrl'

      })
      //我的账号
      .state('tab.account', {
        url: '/account',
        cache: false,
        nativeTransitions: null,
        views: {
          'tab-account': {
            templateUrl: 'templates/account.html',
            controller: 'AccountCtrl'
          }
        }
      })
      //账号信息
      .state('accountinfo', {
        url: '/accountinfo',
        cache: false,
        templateUrl: 'templates/account/accountinfo.html',
        controller: 'AccountInfoCtrl'
      })
      //登录页面
      .state('login', {
        url: '/login',
        cache: false,
/*        nativeTransitions: {
          "type": "flip",
          "direction": "up"
        },*/
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
       //查单列表
      .state('searchorder', {
        url: '/searchorder',
        cache: false,
        templateUrl: 'templates/searchorder.html',
        controller: 'SearchOrderCtrl'
      })
      //查单买货详情
      .state('procureorderdetails', {
        url: '/procureorderdetails/:item',
        cache: false,
        templateUrl: 'templates/searchorder/procureorderdetails.html',
        controller: 'ProcureOrderDetailsCtrl'
      })
      //查单供货详情
      .state('supplyorderplan', {
        url: '/supplyorderplan/:item',
        cache: false,
        templateUrl: 'templates/searchorder/supplyorderplan.html',
        controller: 'SupplyOrderPlanCtrl'
      })
      //查单供货计划备货录入
      .state('enteringnum', {
        url: '/enteringnum/:item',
        cache: false,
        templateUrl: 'templates/searchorder/enteringnum.html',
        controller: 'EnteringNumCtrl'
      })
      //供货记录单列表
      .state('supplyorderlist', {
        url: '/supplyorderlist',
        cache: false,
        templateUrl: 'templates/searchorder/supplyorderlist.html',
        controller: 'SupplyOrderListCtrl'
      })
       //供货单详情
      .state('supplyorderdetails', {
        url: '/supplyorderdetails/:item',
        cache: false,
        templateUrl: 'templates/searchorder/supplyorderdetails.html',
        controller: 'SupplyOrderDetailsCtrl'
      })
     // 查单卖货单审核验货单列表
      .state('examinegoodsorder', {
        url: '/examinegoodsorder',
        cache: false,
        templateUrl: 'templates/searchorder/examinegoodsorder.html',
        controller: 'ExamineGoodsOrderCtrl'
      })
      // 查单供货计划审核验货单列表
      .state('supplyexamineorder', {
        url: '/supplyexamineorder',
        cache: false,
        templateUrl: 'templates/searchorder/supplyexamineorder.html',
        controller: 'SupplyExamineOrderCtrl'
      })
      //查单收货单详情
      .state('deiverorderdetails', {
        url: '/deiverorderdetails/:item',
        cache: false,
        templateUrl: 'templates/searchorder/deiverorderdetails.html',
        controller: 'DeiverOrderDetailsCtrl'
      })
      //发货详情页面
      .state('deiverdetails', {
        url: '/deiverdetails',
        templateUrl: 'templates/searchorder/deiverdetails.html',
        controller: 'DeiverDetailsCtrl'
      })

      //签收详情页面
      .state('signindetails', {
        url: '/signindetails',
        templateUrl: 'templates/searchorder/signindetails.html',
        controller: 'SigninDetailsCtrl'
      })

      //添加评论页面
      .state('evaluate', {
        url: '/evaluate',
        templateUrl: 'templates/searchorder/evaluate.html',
        controller: 'EvaluateCtrl'
      })
      //通知消息列表
      .state('tab.news', {
        url: '/news',
        cache:false,
        nativeTransitions: null,
        views: {
          'tab-news': {
            templateUrl: 'templates/news.html',
            controller: 'NewsCtrl'
          }
        }
      })
      .state('search', {
        url: '/search',
        templateUrl: 'templates/search.html',
        controller: 'SearchOrderCtrl'

      })
      //发货列表
      .state('deliverlist', {
        url: '/deliverlist',
        cache:false,
        templateUrl: 'templates/delivergoods/deliverlist.html',
        controller: 'DeliverListCtrl'

      })
      //发货详情
      .state('deliverdetails', {
        url: '/deliverdetails/:item',
        cache: false,
        templateUrl: 'templates/delivergoods/deliverdetails.html',
        controller: 'DeliverDetailsCtrl'

      })
      //添加发货清单
      .state('adddeliverlist', {
        url: '/adddeliverlist',
        cache:false,
        templateUrl: 'templates/delivergoods/adddeliverlist.html',
        controller: 'AddDeliverListCtrl'
      })
       //添加发货清单model
      .state('delivergoodsmodel', {
        url: '/delivergoodsmodel',
        templateUrl: 'templates/delivergoods/delivergoodsmodel.html',
        controller: 'AddDeliverListCtrl'
      })

      //提交发货信息
      .state('delivergoods', {
        url: '/delivergoods',
        templateUrl: 'templates/delivergoods/delivergoods.html',
        controller: 'DeliverGoodsCtrl'

      })
      //接单供货计划
      .state('supplygood', {
        url: '/supplygood',
        cache:false,
        templateUrl: 'templates/jiedan/supplygood.html',
        controller: 'SupplyGoodCtrl'

      })
      //接单供货计划详情
      .state('supplydetails', {
        url: '/supplydetails/:item',
        templateUrl: 'templates/jiedan/supplydetails.html',
        controller: 'SupplyDetailsCtrl'
      })
      //供货计划填写
      .state('supplyplan', {
        url: '/supplyplan/:item',
        templateUrl: 'templates/jiedan/supplyplan.html',
        controller: 'SupplyPlanCtrl'

      })
      //提交供货计划选择地址
      .state('releasesupply', {
        url: '/releasesupply',
        templateUrl: 'templates/jiedan/releasesupply.html',
        controller: 'ReleaseSupplyCtrl'

      })

      //地址详细列表
      .state('dealaddress', {
        url: '/dealaddress',
        cache:false,
        templateUrl: 'templates/jiedan/dealaddress.html',
        controller: 'DealAddressCtrl'

      })

      //添加地址
      .state('adddealaddress', {
        url: '/adddealaddress',
        cache:false,
        templateUrl: 'templates/jiedan/adddealaddress.html',
        controller: 'AddDealAddressCtrl'

      })

      //买货选择产品
      .state('releaseprocure', {
        url: '/releaseprocure',
        cache:false,
        templateUrl: 'templates/buygood/releaseprocure.html',
        controller: 'ReleaseProcureCtrl'

      })
      //买货发布买货单数量
      .state('procuredetailsnum', {
        url: '/procuredetailsnum',
        cache:false,
        templateUrl: 'templates/buygood/procuredetailsnum.html',
        controller: 'ProcureDetailsNumCtrl'

      })
      //买货发布买货单报价
      .state('procuredetails', {
        url: '/procuredetails',
        cache:false,
        templateUrl: 'templates/buygood/procuredetails.html',
        controller: 'ProcureDetailsCtrl'

      })
      //收货地址选择提交买货单
      .state('releaseprocureorder', {
        url: '/releaseprocureorder',
        cache:false,
        templateUrl: 'templates/buygood/releaseprocureorder.html',
        controller: 'ReleaseProcureOrderCtrl'

      })
      .state('sellgood', {
        url: '/sellgood',
        templateUrl: 'templates/sellgood/sellgood.html',
        controller: 'SellGoodCtrl'
      })
      //我要卖货
      .state('sellprocure', {
        url: '/sellprocure',
        cache:false,
        templateUrl: 'templates/sellgood/sellprocure.html',
        controller: 'SellProcureCtrl'
      })
      //卖货下单
      .state('selldetails', {
        url: '/selldetails',
        cache:false,
        templateUrl: 'templates/sellgood/selldetails.html',
        controller: 'SellDetailsCtrl'
      })
      //查单卖货详情
      .state('sellorderdetails', {
        url: '/sellorderdetails/:item',
        cache:false,
        templateUrl: 'templates/sellgood/sellorderdetails.html',
        controller: 'SellOrderDetailsCtrl'
      })
      //验货列表
      .state('checkgood', {
        url: '/checkgood',
        cache:false,
        templateUrl: 'templates/checkgood/checkgood.html',
        controller: 'CheckGoodCtrl'
      })

      //验货列表详情
      .state('checkdetails', {
        url: '/checkdetails/:item',
        cache:false,
        templateUrl: 'templates/checkgood/checkdetails.html',
        controller: 'CheckDetailsCtrl'
      })
      //添加验货清单
      .state('addproduct', {
        url: '/addproduct',
        cache:false,
        templateUrl: 'templates/checkgood/addproduct.html',
        controller: 'AddProductCtrl'
      })
      //添加验货清单model
      .state('checkgoodsmodel', {
        url: '/checkgoodsmodel',
        templateUrl: 'templates/checkgood/checkgoodsmodel.html',
        controller: 'AddProductCtrl'
      })
      //添加扣款项
      .state('addcutpayment', {
        url: '/addcutpayment',
        cache:false,
        templateUrl: 'templates/checkgood/addcutpayment.html',
        controller: 'AddCutPaymentCtrl'
      })
      //添加扣款项模板
      .state('cutpaymentmodel', {
        url: '/cutpaymentmodel',
        templateUrl: 'templates/checkgood/cutpaymentmodel.html',
        controller: 'AddCutPaymentCtrl'
      })


      //签收列表
      .state('signlist', {
        url: '/signlist',
        cache:false,
        templateUrl: 'templates/sign/signlist.html',
        controller: 'SignListCtrl'
      })
      //签收收货单详情
      .state('signdetails', {
        url: '/signdetails/:item',
        cache:false,
        templateUrl: 'templates/sign/signdetails.html',
        controller: 'SignDetailsCtrl'
      })
      //签收提交
      .state('sign', {
        url: '/sign',
        cache:false,
        templateUrl: 'templates/sign/sign.html',
        controller: 'SignCtrl'
      })
      //申请成为供货商
      .state('applyprovider', {
        url: '/applyprovider',
        templateUrl: 'templates/account/applyprovider.html',
        controller: 'ApplyProviderCtrl'
      })
      //申请预收款
      .state('applyadvance', {
        url: '/applyadvance',
        cache:false,
        templateUrl: 'templates/account/applyadvance.html',
        controller: 'ApplyAdvancesCtrl'
      })
      //我的预收款列表
      .state('myadvance', {
        url: '/myadvance',
        cache:false,
        templateUrl: 'templates/account/myadvance.html',
        controller: 'MyAvanceCtrl'
      })
       //获取还款记录列表
      .state('davancedetails', {
        url: '/davancedetails/:item',
        cache:false,
        templateUrl: 'templates/account/davancedetails.html',
        controller: 'DavanceDetailsCtrl'
      })
      //还款提交
      .state('repayment', {
        url: '/repayment',
        templateUrl: 'templates/account/repayment.html',
        controller: 'RepaymentCtrl'
      })

      //收款银行账号列表
      .state('collectionaccount', {
        url: '/collectionaccount',
        cache:false,
        templateUrl: 'templates/account/collectionaccount.html',
        controller: 'CollectionAccountCtrl'
      })

      //增加收款银行账号
      .state('addbankaccount', {
        url: '/addbankaccount',
        cache:false,
        templateUrl: 'templates/account/addbankaccount.html',
        controller: 'AddBankAccountCtrl'
      })
      //芝麻信用
      .state('mycredit', {
        url: '/mycredit',
        cache:false,
        templateUrl: 'templates/account/mycredit.html',
        controller: 'MyCreditCtrl'
      })
      //芝麻信用身份证授权
      .state('creditnoauthorization', {
        url: '/creditnoauthorization',
        cache:false,
        templateUrl: 'templates/account/creditnoauthorization.html',
        controller: 'CreditNoAuthorizationCtrl'
      })
      //芝麻信用手机号授权
      .state('creditphoneauthorization', {
        url: '/creditphoneauthorization',
        cache:false,
        templateUrl: 'templates/account/creditphoneauthorization.html',
        controller: 'CreditPhoneAuthorizationCtrl'
      })
      //帮助信息共用模板
      .state('help', {
        url: '/help/:ID',
        templateUrl: 'templates/account/help.html',
        controller: 'HelpCtrl'
      })
      //我的设置
      .state('setting', {
        url: '/setting',
        templateUrl: 'templates/account/setting.html',
        controller: 'SettingCtrl'
      })
      //设置安全
      .state('accountsecurity', {
        url: '/accountsecurity',
        templateUrl: 'templates/account/accountsecurity.html',
        controller: 'AccountSecurityCtrl'
      })
      //帮助与反馈
      .state('helpfeedback', {
        url: '/helpfeedback',
        cache:false,
        templateUrl: 'templates/account/helpfeedback.html',
        controller: 'HelpFeedBackCtrl'
      })
      //修改用户信息
      .state('updateuser', {
        url: '/updateuser/:type/:value',
        templateUrl: 'templates/account/updateuser.html',
        controller: 'UpdateUserCtrl'
      })
      //修改用户头像图片
      .state('uploadhead', {
        url: '/uploadhead/:figure',
        templateUrl: 'templates/account/uploadhead.html',
        controller: 'UploadHeadCtrl'
      })
      //解绑手机
      .state('cancelmobile', {
        url: '/cancelmobile',
        templateUrl: 'templates/account/cancelmobile.html',
        controller: 'CancelMobileCtrl'
      })
      //绑定手机
      .state('bindingmobile', {
        url: '/bindingmobile/:oldphone',
        templateUrl: 'templates/account/bindingmobile.html',
        controller: 'BindingMobileCtrl'
      })
      //绑定邮箱
      .state('bindingemail', {
        url: '/bindingemail',
        templateUrl: 'templates/account/bindingemail.html',
        controller: 'BindingEmailCtrl'
      })
      //认证邮箱
      .state('authenticationemail', {
        url: '/authenticationemail',
        templateUrl: 'templates/account/authenticationemail.html',
        controller: 'AuthenticationEmailCtrl'
      })
      //实名认证
      .state('realname', {
        url: '/realname',
        cache:false,
        templateUrl: 'templates/account/realname.html',
        controller: 'RealNameCtrl'
      })
    ;
// if none of the above states are matched, use this as the fallback


    if (localStorage.getItem('start') == 1) {
      $urlRouterProvider.otherwise('/tab/main');
    } else {
      $urlRouterProvider.otherwise('start');
    }

  })
;
