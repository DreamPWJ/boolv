angular.module('starter.controllers', [])
  .config(function ($httpProvider) {
    //$http模块POST请求类型编码转换 统一配置
    $httpProvider.defaults.transformRequest = function (obj) {
      var str = [];
      for (var p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
      }
      return str.join("&")
    }
    $httpProvider.defaults.headers.post = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    $httpProvider.defaults.headers.put = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .controller('TabCtrl', function ($scope, $state, $rootScope, $ionicModal, $http, BooLv, $ionicLoading, commonService) {


  })
  .controller('MainCtrl', function ($scope, $state, $rootScope, $ionicPopover, $ionicModal, $stateParams, $http, BooLv, $ionicLoading) {
    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope,
    }).then(function (popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

  })


  .controller('AccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('LoginCtrl', function ($scope, $rootScope, BooLv, $http, encodingService, $state, commonService) {

    $scope.user = {};//提前定义用户对象
    $scope.loginSubmit = function () {
      var promise = $http({
          method: 'POST',
          url: BooLv.api + '/mobile/user/login',
          data: {
            username: $scope.user.username,
            password: encodingService.md5($scope.user.password)
          }
        }
      )
      promise.success(function (data) {
        localStorage.setItem('token', data.token);
      })
      promise.error(function () {
        commonService.showAlert("博绿网", "登录失败!");
      })

    }

  })
  .controller('SearchOrderCtrl', function ($scope, BooLv, $http, $rootScope, commonService, $ionicTabsDelegate) {
    $scope.searchsettitle = function (title) {
      $scope.title = title;
    }

  })
  .controller('NewsCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {


  })
  .controller('DeliverGoodsCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    $scope.delivery = function () {
      $scope.goodtype = 1;
    }
    $scope.delivergoods = function () {
      $scope.goodtype = 2;
    }
    $scope.recover = function () {
      $scope.goodtype = 3;
    }
  })
  .controller('SupplyGoodCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('SupplyPlanCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('BuyGoodCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('SellGoodCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('CheckGoodCtrl', function ($scope, BooLv, $http, commonService) {


  })

