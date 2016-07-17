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
  .controller('MainCtrl', function ($scope, $state, $rootScope, $stateParams, commonService, $http, BooLv, $ionicLoading, $ionicHistory) {
    commonService.ionicPopover($scope,'my-popover.html')

    //统一返回上一级方法
    $rootScope.goBack = function () {
      $ionicHistory.goBack();
    }
    //扫一扫
    $rootScope.barcodeScanner = function () {
      commonService.barcodeScanner();
    }
    //拍照
    $rootScope.takePicture = function () {
      commonService.takePicture();
    }


  })
  .controller('SearchCtrl', function ($scope, $rootScope, $ionicModal, BooLv, $http, $state, commonService) {

  })

  .controller('CurrentTimeOfferCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {


  })
  .controller('DealNoticeCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {
    $scope.shareActionSheet = function () {
      commonService.shareActionSheet();
    }

  })
  .controller('CompanyTrendsCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {
    $scope.shareActionSheet = function () {
      commonService.shareActionSheet();
    }

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
  .controller('SearchOrderCtrl', function ($scope, BooLv, $http, $rootScope, commonService,$ionicTabsDelegate) {
    //左右滑动方法
    $scope.selectTabWithIndex = function(index) {
      $ionicTabsDelegate.select(index);
    }
    commonService.searchModal($scope);
    $scope.searchsettitle = function (title) {
      $scope.title = title;
    }
    $ionicTabsDelegate.select(1);
  })
  .controller('ProcureOrderDetailsCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    commonService.ionicPopover($scope,'my-pay.html')

    $scope.procureorderdetailssubmit = function () {
      commonService.showConfirm('', '<p>温馨提示:此订单的采购定金为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(定金=预计总金额*30%)</p>', '确定', '取消', 'procureorderdetails','procureorderdetails')
    }
  })
  .controller('SupplyOrderPlanCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    commonService.ionicPopover($scope,'my-stockup.html');

  })
  .controller('EnteringNumCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    $scope.enteringnumsubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！您的供货单提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', '')
    }
  })
  .controller('SupplyOrderDetailsCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    commonService.ionicPopover($scope,'my-order.html');
  })
  .controller('ExamineGoodsOrderCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    $scope.examinegoodsordersubmit = function () {
      commonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', '')
    }

  })

  .controller('DeiverOrderDetailsCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    commonService.ionicPopover($scope,'my-payorder.html');

  })
  .controller('EvaluateCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    $scope.evaluatestar=function (index) {
      $scope.star=index;
    }
 ;
  })
  .controller('NewsCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {


  })
  .controller('DeliverListCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {

  })
  .controller('DeliverDetailsCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {
    commonService.ionicPopover($scope,'my-order.html');

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
      commonService.showConfirm('', '<p>恭喜您！您的发货信息提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', 'sellorderdetails','deliverlist')
    }
  })
  .controller('SupplyGoodCtrl', function ($scope,$rootScope, BooLv, $http, commonService) {


  })
  .controller('SupplyPlanCtrl', function ($scope, BooLv, $http, commonService) {


  })

  .controller('ReleaseProcureCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {


  })
  .controller('ProcureDetailsCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {


  })
  .controller('ReleaseProcureOrderCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {
    $scope.releaseprocureordersubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！您的采购单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'procureorderdetails')
    }

  })
  .controller('BuyGoodCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {
    commonService.searchModal($scope);

  })
  .controller('SellGoodCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {
    commonService.searchModal($scope);

  })
  .controller('SellDetailsCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {
    $scope.sellgoodssubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！您的卖货单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'sellorderdetails')
    }

  })
  .controller('SellOrderDetailsCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {
    commonService.ionicPopover($scope,'my-order.html');

  })
  .controller('SellProcureCtrl', function ($scope, $rootScope, BooLv, $http, commonService) {


  })
  .controller('CheckGoodCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('CheckDetailsCtrl', function ($scope, BooLv, $http, commonService) {


  })

  .controller('EnteringCheckCtrl', function ($scope, $state, BooLv, $http, commonService) {

    $scope.toaddproduct = function () {
      $state.go("addproduct")
    }

    $scope.checkgoodssubmit = function () {
      commonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', 'checkgood')
    }
  })

  .controller('AddProductCtrl', function ($scope, BooLv, $http, commonService) {

  })
  .controller('SupplyDetailsCtrl', function ($scope, BooLv, $http, commonService) {


  })
  .controller('ReleaseSupplyCtrl', function ($scope, BooLv, $http, commonService) {
    $scope.supplysubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！您的订单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'supplyorderplan')
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

    $scope.delivery();
    $scope.signsubmit = function () {
      commonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', 'signlist')
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

    $scope.applyadvancesubmit = function () {
      commonService.showConfirm('', '<p>恭喜您！您的预收款申请提交成功！</p><p>我们会尽快处理您的订单</p>', '查看订单', '关闭', 'davancedetails')
    }
  })
  .controller('CollectionAccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('AddBankAccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('MyCreditCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('mycredit'));
    option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '信用指标',
          type: 'gauge',
          detail: {formatter: '80%'},
          data: [{value: 80, name: '信用率'}]
        }
      ]
    };
    myChart.setOption(option, true);

  })
  .controller('SettingCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('UpdateUserCtrl', function ($scope, $rootScope, BooLv, $http, $state, commonService) {

  })
  .controller('MyPopover', function ($scope, $rootScope, BooLv, $http, $state, commonService) {
    $scope.paymentsubmit = function () {
      commonService.showConfirm('', '<p>温馨提示:此订单的采购定金为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(定金=预计总金额*30%)</p>', '确定', '取消', '','')
    }
    $scope.closeordersubmit = function () {
      commonService.showConfirm('', '<p>温馨提示:您是否确认关闭此订单吗？</p><p>是请点击"确认"，否则请点击"取消"</p>', '确定', '取消', '','')
    }
    $scope.paytopaymentsubmit = function () {
      commonService.showConfirm('', '<p>温馨提示:此订单的到付款为</p><p>50000元，支付请点击"确认"，否则</p><p>点击"取消"(到付款=预计总金额)</p>', '确定', '取消', '','')
    }
    $scope.payfinalpaymenttsubmit = function () {
      commonService.showConfirm('', '<p>温馨提示:此订单的尾款为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(尾款=订单总金额-到付款)</p>', '确定', '取消', '','')
    }
  })
