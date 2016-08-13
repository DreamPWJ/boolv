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
  .controller('TabCtrl', function ($scope, $state, $rootScope, $ionicModal, $http, BooLv, $ionicLoading, CommonService) {


  })
  .controller('MainCtrl', function ($scope, $state, $rootScope, $stateParams, CommonService, $http, BooLv, $ionicLoading, $ionicHistory) {

    CommonService.ionicPopover($scope, 'my-popover.html')
    //在首页中清除导航历史退栈
    $scope.$on('$ionicView.afterEnter', function () {
      $ionicHistory.clearHistory();
    })
    //统一返回上一级方法
    $rootScope.goBack = function () {
      $ionicHistory.goBack();
    }
    //扫一扫
    $rootScope.barcodeScanner = function () {
      CommonService.barcodeScanner();
    }
    //拍照
    $rootScope.takePicture = function () {
      CommonService.takePicture();
    }


  })
  .controller('StartCtrl', function ($scope, $state, $rootScope, $http, BooLv, CommonService) {
    $scope.tomain = function () {
      $state.go('tab.main');
    }
  })
  .controller('SearchCtrl', function ($scope, $rootScope, $ionicModal, BooLv, $http, $state, CommonService) {

  })

  .controller('CurrentTimeOfferCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {


  })
  .controller('DealNoticeCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {
    $scope.shareActionSheet = function () {
      CommonService.shareActionSheet();
    }

  })
  .controller('CompanyTrendsCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {
    $scope.shareActionSheet = function () {
      CommonService.shareActionSheet();
    }

  })

  .controller('LoginCtrl', function ($scope, $rootScope, BooLv, $state, CommonService, AccountService) {

    $scope.user = {};//提前定义用户对象
    $scope.loginSubmit = function () {
      AccountService.login($scope.user).success(function (data) {
/*        localStorage.setItem('token', data.token);*/
      }).error(function () {
        CommonService.showAlert("博绿网", "登录失败!");
      })

    }

  })
  .controller('SearchOrderCtrl', function ($scope, BooLv, $http, $rootScope, CommonService, $ionicTabsDelegate, $ionicSlideBoxDelegate) {
    $scope.slideChanged = function (index) {
      $ionicTabsDelegate.select(index);
    };
    /*    $scope.$on('$ionicView.afterEnter', function () {
     //等待视图加载完成的时候默认选中第一个菜单
     $ionicTabsDelegate._instances[1].select($ionicSlideBoxDelegate._instances[1].currentIndex());
     });*/

    $scope.selectedTab = function (title, index) {
      //更改标题
      $scope.title = title;
      //滑动的索引和速度
      $ionicSlideBoxDelegate.slide(index)
    }
    CommonService.searchModal($scope);

  })
  .controller('ProcureOrderDetailsCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    CommonService.ionicPopover($scope, 'my-pay.html')

    $scope.procureorderdetailssubmit = function () {
      CommonService.showConfirm('', '<p>温馨提示:此订单的采购定金为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(定金=预计总金额*30%)</p>', '确定', '取消', 'procureorderdetails', 'procureorderdetails')
    }
  })
  .controller('SupplyOrderPlanCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    CommonService.ionicPopover($scope, 'my-stockup.html');

  })
  .controller('EnteringNumCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    $scope.enteringnumsubmit = function () {
      CommonService.showConfirm('', '<p>恭喜您！您的供货单提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', '')
    }
  })
  .controller('SupplyOrderDetailsCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    CommonService.ionicPopover($scope, 'my-order.html');
  })
  .controller('ExamineGoodsOrderCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    $scope.examinegoodsordersubmit = function () {
      CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', '')
    }

  })

  .controller('DeiverOrderDetailsCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    CommonService.ionicPopover($scope, 'my-payorder.html');

  })
  .controller('EvaluateCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    $scope.evaluatestar = function (index) {
      $scope.star = index;
    }
    ;
  })
  .controller('NewsCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {


  })
  .controller('DeliverListCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {

  })
  .controller('DeliverDetailsCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
    CommonService.ionicPopover($scope, 'my-order.html');

  })
  .controller('DeliverGoodsCtrl', function ($scope, BooLv, $http, $rootScope, CommonService) {
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
      CommonService.showConfirm('', '<p>恭喜您！您的发货信息提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', 'sellorderdetails', 'deliverlist')
    }
  })
  .controller('SupplyGoodCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {


  })
  .controller('SupplyPlanCtrl', function ($scope, BooLv, $http, CommonService) {


  })

  .controller('ReleaseProcureCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {


  })
  .controller('ProcureDetailsCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {


  })
  .controller('ReleaseProcureOrderCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {
    $scope.releaseprocureordersubmit = function () {
      CommonService.showConfirm('', '<p>恭喜您！您的采购单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'procureorderdetails')
    }

  })
  .controller('BuyGoodCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {
    CommonService.searchModal($scope);

  })
  .controller('SellGoodCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {
    CommonService.searchModal($scope);

  })
  .controller('SellDetailsCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {
    $scope.sellgoodssubmit = function () {
      CommonService.showConfirm('', '<p>恭喜您！您的卖货单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'sellorderdetails')
    }

  })
  .controller('SellOrderDetailsCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {
    CommonService.ionicPopover($scope, 'my-order.html');

  })
  .controller('SellProcureCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {


  })
  .controller('CheckGoodCtrl', function ($scope, BooLv, $http, CommonService) {


  })
  .controller('CheckDetailsCtrl', function ($scope, BooLv, $http, CommonService) {


  })

  .controller('EnteringCheckCtrl', function ($scope, $state, BooLv, $http, CommonService) {

    $scope.toaddproduct = function () {
      $state.go("addproduct")
    }

    $scope.checkgoodssubmit = function () {
      CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', 'checkgood')
    }
  })

  .controller('AddProductCtrl', function ($scope, BooLv, $http, CommonService) {

  })
  .controller('SupplyDetailsCtrl', function ($scope, BooLv, $http, CommonService) {


  })
  .controller('ReleaseSupplyCtrl', function ($scope, BooLv, $http, CommonService) {
    $scope.supplysubmit = function () {
      CommonService.showConfirm('', '<p>恭喜您！您的订单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'supplyorderplan')
    }

  })
  .controller('AddDealAddressCtrl', function ($scope, BooLv, $http, CommonService) {
    $scope.dealaddresssubmit = function () {
      CommonService.showConfirm('', '<p>恭喜您！</p><p>地址信息添加成功！</p>', '查看', '关闭', 'dealaddress')
    }

  })
  .controller('DealAddressCtrl', function ($scope, BooLv, $http, CommonService) {


  })
  .controller('SignListCtrl', function ($scope, BooLv, $http, CommonService) {


  })
  .controller('SignDetailsCtrl', function ($scope, BooLv, $http, CommonService) {


  })
  .controller('SignCtrl', function ($scope, BooLv, $http, CommonService) {
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
      CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', 'signlist')
    }
  })
  .controller('AccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('AccountInfoCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('ApplyProviderCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

    $scope.applyprovidersubmit = function () {
      CommonService.showAlert('', '<p>恭喜您！提交申请成功！</p>')
    }
  })
  .controller('MyAvanceCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('DavanceDetailsCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('ApplyAdvancesCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

    $scope.applyadvancesubmit = function () {
      CommonService.showConfirm('', '<p>恭喜您！您的预收款申请提交成功！</p><p>我们会尽快处理您的订单</p>', '查看订单', '关闭', 'davancedetails')
    }
  })
  .controller('CollectionAccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('AddBankAccountCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('MyCreditCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

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
  .controller('SettingCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('UpdateUserCtrl', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {

  })
  .controller('MyPopover', function ($scope, $rootScope, BooLv, $http, $state, CommonService) {
    $scope.paymentsubmit = function () {
      CommonService.showConfirm('', '<p>温馨提示:此订单的采购定金为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(定金=预计总金额*30%)</p>', '确定', '取消', '', '')
    }
    $scope.closeordersubmit = function () {
      CommonService.showConfirm('', '<p>温馨提示:您是否确认关闭此订单吗？</p><p>是请点击"确认"，否则请点击"取消"</p>', '确定', '取消', '', '')
    }
    $scope.paytopaymentsubmit = function () {
      CommonService.showConfirm('', '<p>温馨提示:此订单的到付款为</p><p>50000元，支付请点击"确认"，否则</p><p>点击"取消"(到付款=预计总金额)</p>', '确定', '取消', '', '')
    }
    $scope.payfinalpaymenttsubmit = function () {
      CommonService.showConfirm('', '<p>温馨提示:此订单的尾款为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(尾款=订单总金额-到付款)</p>', '确定', '取消', '', '')
    }
  })
