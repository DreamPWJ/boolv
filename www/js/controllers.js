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
  .controller('MainCtrl', function ($scope, $state, $rootScope, $ionicPopover, $ionicModal, $stateParams, $http, BooLv, $ionicLoading, $ionicHistory) {
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


    //统一返回上一级方法
    $rootScope.goBack = function () {
      $ionicHistory.goBack();
    }

  })
  .controller('SearchCtrl', function ($scope, $rootScope, $ionicModal, BooLv, $http, $state, commonService) {

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
  .controller('SearchOrderCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    commonService.searchModal($scope);
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

    $scope.delivergoods();

    $scope.delivergoodssubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！您的发货信息提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭')
    }
  })
  .controller('SupplyGoodCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('SupplyPlanCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('BuyGoodCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {
    commonService.searchModal($scope);

  })
  .controller('SellGoodCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {
    commonService.searchModal($scope);

  })
  .controller('CheckGoodCtrl', function ($scope, BooLv, $http, commonService) {


  })

  .controller('SupplyDetailsCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('ReleaseSupplyCtrl', function ($scope, BooLv, $http, commonService) {
    $scope.supplysubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！您的订单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭')
    }

  })
  .controller('AddDealAddressCtrl', function ($scope, BooLv, $http, commonService) {
    $scope.dealaddresssubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！</p><p>地址信息添加成功！</p>', '查看', '关闭', 'dealaddress')
    }

  })
  .controller('DealAddressCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('SignListCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('SignDetailsCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('SignCtrl', function ($scope, BooLv, $http, commonService) {
    $scope.delivery = function () {
      $scope.goodtype = 1;
    }
    $scope.delivergoods = function () {
      $scope.goodtype = 2;
    }
    $scope.oneself = function () {
      $scope.goodtype = 3;
    }

    $scope.delivergoods();
    $scope.signsubmit = function () {
      commonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>')
    }
  })
  .controller('AccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('AccountInfoCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('ApplyProviderCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {
    $scope.applyprovidersubmit = function () {
      commonService.showAlert('', '<p>恭喜您！提交申请成功！</p>')
    }
  })
  .controller('MyAvanceCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('DavanceDetailsCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('ApplyAdvancesCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('CollectionAccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('AddBankAccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
