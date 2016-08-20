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
      if (window.StatusBar) {
        //状态栏颜色设置
        // org.apache.cordova.statusbar required
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#11c1f3");
      }
      //打开外部网页
      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
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
      .state('start', {
        url: '/start',
        templateUrl: 'templates/start.html',
        controller: 'StartCtrl'

      })
      .state('currenttimeoffer', {
        url: '/currenttimeoffer',
        templateUrl: 'templates/maindetails/currenttimeoffer.html',
        controller: 'CurrentTimeOfferCtrl'

      })
      .state('dealnotice', {
        url: '/dealnotice/:Id',
        templateUrl: 'templates/maindetails/dealnotice.html',
        controller: 'DealNoticeCtrl'

      })
      .state('companytrends', {
        url: '/companytrends/:Id',
        templateUrl: 'templates/maindetails/companytrends.html',
        controller: 'CompanyTrendsCtrl'

      })
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
      .state('accountinfo', {
        url: '/accountinfo',
        cache: false,
        templateUrl: 'templates/account/accountinfo.html',
        controller: 'AccountInfoCtrl'
      })
      .state('login', {
        url: '/login',
        cache: false,
        nativeTransitions: {
          "type": "flip",
          "direction": "up"
        },
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('searchorder', {
        url: '/searchorder',
        templateUrl: 'templates/searchorder.html',
        controller: 'SearchOrderCtrl'
      })
      .state('procureorderdetails', {
        url: '/procureorderdetails',
        cache: false,
        templateUrl: 'templates/searchorder/procureorderdetails.html',
        controller: 'ProcureOrderDetailsCtrl'
      })
      .state('supplyorderplan', {
        url: '/supplyorderplan',
        cache: false,
        templateUrl: 'templates/searchorder/supplyorderplan.html',
        controller: 'SupplyOrderPlanCtrl'
      })
      .state('enteringnum', {
        url: '/enteringnum',
        templateUrl: 'templates/searchorder/enteringnum.html',
        controller: 'EnteringNumCtrl'
      })
      .state('supplyorderdetails', {
        url: '/supplyorderdetails',
        cache: false,
        templateUrl: 'templates/searchorder/supplyorderdetails.html',
        controller: 'SupplyOrderDetailsCtrl'
      })
      .state('examinegoodsorder', {
        url: '/examinegoodsorder',
        templateUrl: 'templates/searchorder/examinegoodsorder.html',
        controller: 'ExamineGoodsOrderCtrl'
      })
      .state('deiverorderdetails', {
        url: '/deiverorderdetails',
        cache: false,
        templateUrl: 'templates/searchorder/deiverorderdetails.html',
        controller: 'DeiverOrderDetailsCtrl'
      })
      .state('evaluate', {
        url: '/evaluate',
        templateUrl: 'templates/searchorder/evaluate.html',
        controller: 'EvaluateCtrl'
      })
      .state('tab.news', {
        url: '/news',
        cache: false,
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
        controller: 'SearchCtrl'

      })
      .state('deliverlist', {
        url: '/deliverlist',
        templateUrl: 'templates/delivergoods/deliverlist.html',
        controller: 'DeliverListCtrl'

      })
      .state('deliverdetails', {
        url: '/deliverdetails',
        cache: false,
        templateUrl: 'templates/delivergoods/deliverdetails.html',
        controller: 'DeliverDetailsCtrl'

      })
      .state('delivergoods', {
        url: '/delivergoods',
        templateUrl: 'templates/delivergoods/delivergoods.html',
        controller: 'DeliverGoodsCtrl'

      })
      .state('supplygood', {
        url: '/supplygood',
        templateUrl: 'templates/jiedan/supplygood.html',
        controller: 'SupplyGoodCtrl'

      })
      .state('supplydetails', {
        url: '/supplydetails',
        templateUrl: 'templates/jiedan/supplydetails.html',
        controller: 'SupplyDetailsCtrl'
      })
      .state('supplyplan', {
        url: '/supplyplan',
        templateUrl: 'templates/jiedan/supplyplan.html',
        controller: 'SupplyPlanCtrl'

      })
      .state('releasesupply', {
        url: '/releasesupply',
        templateUrl: 'templates/jiedan/releasesupply.html',
        controller: 'ReleaseSupplyCtrl'

      })
      .state('adddealaddress', {
        url: '/adddealaddress',
        templateUrl: 'templates/jiedan/adddealaddress.html',
        controller: 'AddDealAddressCtrl'

      })
      .state('dealaddress', {
        url: '/dealaddress',

        templateUrl: 'templates/jiedan/dealaddress.html',
        controller: 'DealAddressCtrl'

      })
      .state('buygood', {
        url: '/buygood',
        templateUrl: 'templates/buygood/buygood.html',
        controller: 'BuyGoodCtrl'

      })
      .state('releaseprocure', {
        url: '/releaseprocure',
        templateUrl: 'templates/buygood/releaseprocure.html',
        controller: 'ReleaseProcureCtrl'

      })
      .state('procuredetails', {
        url: '/procuredetails',
        templateUrl: 'templates/buygood/procuredetails.html',
        controller: 'ProcureDetailsCtrl'

      })
      .state('releaseprocureorder', {
        url: '/releaseprocureorder',
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
        templateUrl: 'templates/sellgood/sellprocure.html',
        controller: 'SellProcureCtrl'
      })
      //卖货下单
      .state('selldetails', {
        url: '/selldetails',
        templateUrl: 'templates/sellgood/selldetails.html',
        controller: 'SellDetailsCtrl'
      })
      .state('sellorderdetails', {
        url: '/sellorderdetails',
        cache: false,
        templateUrl: 'templates/sellgood/sellorderdetails.html',
        controller: 'SellOrderDetailsCtrl'
      })
      .state('checkgood', {
        url: '/checkgood',
        templateUrl: 'templates/checkgood/checkgood.html',
        controller: 'CheckGoodCtrl'
      })
      .state('checkdetails', {
        url: '/checkdetails',
        templateUrl: 'templates/checkgood/checkdetails.html',
        controller: 'CheckDetailsCtrl'
      })
      .state('enteringcheck', {
        url: '/enteringcheck',
        templateUrl: 'templates/checkgood/enteringcheck.html',
        controller: 'EnteringCheckCtrl'
      })
      .state('addproduct', {
        url: '/addproduct',
        templateUrl: 'templates/checkgood/addproduct.html',
        controller: 'AddProductCtrl'
      })
      .state('signlist', {
        url: '/signlist',
        templateUrl: 'templates/sign/signlist.html',
        controller: 'SignListCtrl'
      })
      .state('signdetails', {
        url: '/signdetails',
        templateUrl: 'templates/sign/signdetails.html',
        controller: 'SignDetailsCtrl'
      })
      .state('sign', {
        url: '/sign',
        templateUrl: 'templates/sign/sign.html',
        controller: 'SignCtrl'
      })
      .state('applyprovider', {
        url: '/applyprovider',
        templateUrl: 'templates/account/applyprovider.html',
        controller: 'ApplyProviderCtrl'
      })
      .state('myadvance', {
        url: '/myadvance',
        templateUrl: 'templates/account/myadvance.html',
        controller: 'MyAvanceCtrl'
      })
      .state('davancedetails', {
        url: '/davancedetails',
        templateUrl: 'templates/account/davancedetails.html',
        controller: 'DavanceDetailsCtrl'
      })
      .state('applyadvance', {
        url: '/applyadvance',
        templateUrl: 'templates/account/applyadvance.html',
        controller: 'ApplyAdvancesCtrl'
      })
      .state('collectionaccount', {
        url: '/collectionaccount',
        templateUrl: 'templates/account/collectionaccount.html',
        controller: 'CollectionAccountCtrl'
      })
      .state('addbankaccount', {
        url: '/addbankaccount',
        templateUrl: 'templates/account/addbankaccount.html',
        controller: 'AddBankAccountCtrl'
      })
      .state('mycredit', {
        url: '/mycredit',
        templateUrl: 'templates/account/mycredit.html',
        controller: 'MyCreditCtrl'
      })
      .state('setting', {
        url: '/setting',
        templateUrl: 'templates/account/setting.html',
        controller: 'SettingCtrl'
      })
      .state('updateuser', {
        url: '/updateuser',
        templateUrl: 'templates/account/updateuser.html',
        controller: 'UpdateUserCtrl'
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
