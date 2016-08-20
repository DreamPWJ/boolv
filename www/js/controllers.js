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

    $httpProvider.defaults.headers.common['Authorization'] = localStorage.getItem('token');
  })
  .controller('TabCtrl', function ($scope, $state, $rootScope, $ionicModal, $http, BooLv, $ionicLoading, CommonService) {


  })
  .controller('MainCtrl', function ($scope, $state, $rootScope, $stateParams, CommonService, $ionicLoading, $ionicHistory, MainService) {
    CommonService.ionicLoadingShow()
    //登录授权
    MainService.authLogin().success(function (data) {
      localStorage.setItem('token', data.Values)
    }).then(function () {
      //获取广告图
      MainService.getAdMsg().success(function (data) {
        $scope.adImg = data.Values;
      })
      //获取行情报价
      MainService.getProds().success(function (data) {
        $scope.prods = data.Values;
      })
      //获取交易公告
      $scope.listNewsParams = {
        currentPage: 1,
        pageSize: 5,
        ID: 0,
        Keyword: '',
        IsNew: 1,
        IsRed: 1,
        GrpCode: '002'
      }
      MainService.getListNews($scope.listNewsParams).success(function (data) {
        $scope.listNews = data.Values;

      }).then(function () {
        //获取公司公告
        $scope.listNewsParams.GrpCode = '003';
        MainService.getListNews($scope.listNewsParams).success(function (data) {
          $scope.listCompanyNews = data.Values;

        })
      })

    }).finally(function () {
      CommonService.ionicLoadingHide()
    })

    CommonService.ionicPopover($scope, 'my-popover.html');
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
  .controller('DealNoticeCtrl', function ($scope, $rootScope, $stateParams, BooLv, $http, $state, CommonService, MainService) {
    CommonService.ionicLoadingShow();
    var Id = $stateParams.Id;
    MainService.getNews(Id).success(function (data) {
      $scope.news = data.Values;
    }).finally(function () {
      CommonService.ionicLoadingHide();
    })

    $scope.shareActionSheet = function () {
      CommonService.shareActionSheet();
    }

  })
  .controller('CompanyTrendsCtrl', function ($scope, $rootScope, $stateParams, BooLv, $http, $state, CommonService, MainService) {
    CommonService.ionicLoadingShow();
    var Id = $stateParams.Id;
    MainService.getNews(Id).success(function (data) {
      $scope.news = data.Values;
    }).finally(function () {
      CommonService.ionicLoadingHide();
    })
    $scope.shareActionSheet = function () {
      CommonService.shareActionSheet();


      //微信分享
//Wechat.Scene.TIMELINE 表示分享到朋友圈
//Wechat.Scene.SESSION 表示分享给好友
//（1）文本
      /*      Wechat.share({
       text: "This is just a plain string",
       scene: Wechat.Scene.TIMELINE   // share to Timeline
       }, function () {
       alert("Success");
       }, function (reason) {
       alert("Failed: " + reason);
       });*/
      //（2）媒体
      /*    Wechat.share({
       message: {
       title: "Hi, there",
       description: "This is description.",
       thumb: "www/img/thumbnail.png",
       mediaTagName: "TEST-TAG-001",
       messageExt: "这是第三方带的测试字段",
       messageAction: "<action>dotalist</action>",
       media: "YOUR_MEDIA_OBJECT_HERE"
       },
       scene: Wechat.Scene.TIMELINE   // share to Timeline
       }, function () {
       alert("Success");
       }, function (reason) {
       alert("Failed: " + reason);
       });*/
      //（3）网页链接
    }


  })

  .controller('LoginCtrl', function ($scope, $rootScope, BooLv, $state, CommonService, AccountService) {

    $scope.user = {};//提前定义用户对象
    $scope.sendCode = function () {
      AccountService.sendCode($scope.user.username).success(function (data) {
        $scope.user.password = data.Values;
      }).error(function () {
        CommonService.showAlert("博绿网", "验证码获取失败!", 'login');
      })
    }
    $scope.loginSubmit = function () {
      AccountService.login($scope.user).success(function (data) {
        localStorage.setItem('token', data.Values);
      }).error(function () {
        CommonService.showAlert("博绿网", "登录失败!", 'login');
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
  .controller('SellGoodCtrl', function ($scope, $rootScope, $state, CommonService) {
    $scope.supplierList = $rootScope.supplierList;
    $scope.selectSupplier = function (item) {
      $rootScope.supplierListFirst = item;
      console.log(item);
      $state.go("selldetails");
    }
    CommonService.searchModal($scope);

  })
  //卖货下单
  .controller('SellDetailsCtrl', function ($scope, $rootScope, CommonService, SellService) {
    CommonService.ionicLoadingShow();
    $scope.sellDetails = [];
    angular.forEach($rootScope.sellprodsList, function (item) {
      if (item.checked == true) {
        $scope.sellDetails.push(item);
      }
    })
    //根据经纬度获取最近N个供应商
    $scope.supplierListParams = {
      currentPage: 1,
      pageSize: 5,
      Longitude: localStorage.getItem("longitude") || 4.333,
      Latitude: localStorage.getItem("latitude") || 3.3456,
      buff: 5
    }
    SellService.getListLongAndLat($scope.supplierListParams).success(function (data) {
      $rootScope.supplierList = data.Values.data_list;
      $rootScope.supplierListFirst = $rootScope.supplierList[0];
    }).finally(function () {
      CommonService.ionicLoadingHide()
    })

    $scope.itemnum = [];//卖货数量
    $scope.sellgoodssubmit = function () {//提交卖货订单
      CommonService.ionicLoadingShow();
      $scope.Details = [];//收货明细数据数组
      angular.forEach($scope.sellDetails, function (item, index) {
        var items = {};//收货明细json数据
        items.ProdID = item.PID;//产品编号
        items.ProdName = item.PName;//产品名称
        items.Unit = item.PUID;//计算单位ID
        items.Num = $scope.itemnum[index].sellnum;//输入数量
        items.SaleClass = item.PUSaleType;//销售分类ID
        var referenceprice;//参考价格  PriType=1    才会有多条，价格要根据数量区间来取 数量为0时，表示以上或以下
        if (item.PriType == 1) {
          angular.forEach(item.Prices, function (itemprice, index) {
            if (parseInt(items.Num) >= parseInt(itemprice.PriNumMin) && parseInt(items.Num) <= parseInt(itemprice.PriNumMax)) {
              referenceprice = item.Prices[index].Price;
            }
          })
        } else {
          referenceprice = item.Prices[0].Price;
        }
        items.Price = referenceprice;//参考价格
        $scope.Details.push(items)
      })
      //提交卖货订单数据
      $scope.sellDatas = {
        FromUser: '7BF8D79B-9228-445A-AB69-887BF4BC4C5B',//供应商账号
        ToUser: $rootScope.supplierListFirst.LogID,//供应商账号
        TradeType: 1,//交易方式 0-物流配送1-送货上门2-上门回收
        FromAddr: 0,//发货地址ID
        ToAddr: 0,//收货地址ID
        Account: 0,//收款账号ID
        Details: $scope.Details//收货明细
      }

      SellService.addOrderDetails($scope.sellDatas).success(function () {
        CommonService.showConfirm('', '<p>恭喜您！您的卖货单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'sellorderdetails')
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }

  })
  .controller('SellOrderDetailsCtrl', function ($scope, $rootScope, BooLv, $http, CommonService) {
    CommonService.ionicPopover($scope, 'my-order.html');

  })
  //我要卖货
  .controller('SellProcureCtrl', function ($scope, $rootScope, CommonService, MainService) {
    //获取卖货列表
    CommonService.ionicLoadingShow();
    MainService.getProds().success(function (data) {
      $rootScope.sellprods = data.Values;
      $rootScope.sellprodsList = [];
      angular.forEach(data.Values, function (item) {
        item.checked = false;
        $scope.sellprodsList.push(item);
      })

    }).finally(function () {
      CommonService.ionicLoadingHide();
    })

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
