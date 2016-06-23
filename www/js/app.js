// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.config', 'ngCordova'])

  .run(function ($ionicPlatform, $rootScope, $ionicPopup, $location, $ionicHistory) {
    $ionicPlatform.ready(function () {
      //主页面显示退出提示框
      $ionicPlatform.registerBackButtonAction(function (e) {
        e.preventDefault();
        function showConfirm() {
          var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '你确定要退出博绿网应用吗?',
            okText: '退出',
            cancelText: '取消'
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
        if ($location.path() == '/tab/main' || $location.path() == '/login' ) {
          showConfirm();
        } else if ($ionicHistory.backView()) {
          // Go back in history
          $ionicHistory.goBack();
        } else {
          // This is the last page: Show confirmation popup
          showConfirm();
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
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-back');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-ios-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    //设置默认返回按钮的文字
    $ionicConfigProvider.backButton.previousTitleText(false).text('返回');
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        cache: false,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'
      })

      // Each tab has its own nav history stack:

      .state('tab.main', {
        url: '/main',
        views: {
          'tab-main': {
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl'
          }
        }
      })


      .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
          'tab-account': {
            templateUrl: 'templates/account.html',
            controller: 'AccountCtrl'
          }
        }
      })
      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('tab.searchorder', {
        url: '/searchorder',
        cache: false,
        views: {
          'tab-searchorder': {
            templateUrl: 'templates/searchorder.html',
            controller: 'SearchOrderCtrl'
          }
        }
      })
      .state('tab.news', {
        url: '/news',
        cache: false,
        views: {
          'tab-news': {
            templateUrl: 'templates/news.html',
            controller: 'NewsCtrl'
          }
        }
      })
      .state('tab.delivergoods', {
        url: '/delivergoods',
        views: {
          'tab-main': {
            templateUrl: 'templates/delivergoods/delivergoods.html',
            controller: 'DeliverGoodsCtrl'
          }
        }
      })
      .state('tab.supplygood', {
        url: '/supplygood',
        views: {
          'tab-main': {
            templateUrl: 'templates/jiedan/supplygood.html',
            controller: 'SupplyGoodCtrl'
          }
        }
      })
      .state('tab.supplydetails', {
        url: '/supplydetails',
        views: {
          'tab-main': {
            templateUrl: 'templates/jiedan/supplydetails.html',
            controller: 'SupplyDetailsCtrl'
          }
        }
      })
      .state('tab.supplyplan', {
        url: '/supplyplan',
        views: {
          'tab-main': {
            templateUrl: 'templates/jiedan/supplyplan.html',
            controller: 'SupplyPlanCtrl'
          }
        }
      })
      .state('tab.releasesupply', {
        url: '/releasesupply',
        views: {
          'tab-main': {
            templateUrl: 'templates/jiedan/releasesupply.html',
            controller: 'ReleaseSupplyCtrl'
          }
        }
      })
      .state('tab.adddealaddress', {
        url: '/adddealaddress',
        views: {
          'tab-main': {
            templateUrl: 'templates/jiedan/adddealaddress.html',
            controller: 'AddDealAddressCtrl'
          }
        }
      })
      .state('tab.dealaddress', {
        url: '/dealaddress',
        views: {
          'tab-main': {
            templateUrl: 'templates/jiedan/dealaddress.html',
            controller: 'DealAddressCtrl'
          }
        }
      })
      .state('tab.buygood', {
        url: '/buygood',
        views: {
          'tab-main': {
            templateUrl: 'templates/buygood/buygood.html',
            controller: 'BuyGoodCtrl'
          }
        }
      })
      .state('tab.sellgood', {
        url: '/sellgood',
        views: {
          'tab-main': {
            templateUrl: 'templates/sellgood/sellgood.html',
            controller: 'SellGoodCtrl'
          }
        }
      })
      .state('tab.checkgood', {
        url: '/checkgood',
        views: {
          'tab-main': {
            templateUrl: 'templates/checkgood/checkgood.html',
            controller: 'CheckGoodCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/tab/main');


  });
