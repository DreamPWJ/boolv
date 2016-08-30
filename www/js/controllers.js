angular.module('starter.controllers', [])
  .config(function ($httpProvider) {
    //$http模块POST请求类型编码转换 统一配置
    /*    $httpProvider.defaults.transformRequest = function (obj) {
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
     }*/
    //服务注册到$httpProvider.interceptors中
    $httpProvider.interceptors.push('authInterceptor');
    /*   $httpProvider.defaults.headers.common['Authorization'] = localStorage.getItem('token');*/
  })
  .controller('TabCtrl', function ($scope, $state, $rootScope, $ionicModal, $ionicLoading, CommonService) {


  })
  .controller('MainCtrl', function ($scope, $state, $rootScope, $stateParams, CommonService, $ionicLoading, $ionicHistory, MainService, NewsService) {
    CommonService.ionicLoadingShow();

    $scope.getMainData = function () {
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
          sessionStorage.setItem("getProds", JSON.stringify(data.Values));//行情报价数据复用
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

        //提交设备信息到服务器
        $scope.datas = {
          registration_id: "fawffeae121155",	//极光注册id
          user: localStorage.getItem("usertoken"),	//用户id,没登录为空
          mobile: JSON.stringify(localStorage.getItem("user")).mobile,	//手机号码
          alias: "",	//设备别名
          device: 0	//设备类型:0-android,1-ios
        }
        NewsService.setDeviceInfo().success(function (data) {
          console.log(data);
        })
      }).finally(function () {
        CommonService.ionicLoadingHide();
        $scope.$broadcast('scroll.refreshComplete');
      })

    }

    $scope.getMainData();
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


  })
  .controller('StartCtrl', function ($scope, $state, $rootScope, CommonService) {
    $scope.tomain = function () {
      $state.go('tab.main', {reload: true});
    }
  })
  .controller('SearchCtrl', function ($scope, $rootScope, $ionicModal, $state, CommonService) {

  })
  //实时报价
  .controller('CurrentTimeOfferCtrl', function ($scope, $rootScope, $state, CommonService) {
    $scope.currentprods = JSON.parse(sessionStorage.getItem("getProds"));//行情报价数据
  })
  .controller('DealNoticeCtrl', function ($scope, $rootScope, $stateParams, $state, CommonService, MainService) {
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
  .controller('CompanyTrendsCtrl', function ($scope, $rootScope, $stateParams, $state, CommonService, MainService) {
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

  .controller('LoginCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {

    $scope.user = {};//提前定义用户对象
    $scope.sendCode = function () {
      AccountService.sendCode($scope.user.username).success(function (data) {
        $scope.user.password = data.Values;
      }).error(function () {
        CommonService.showAlert("博绿网", "验证码获取失败!", 'login');
      })
    }
    $scope.loginSubmit = function () {
      CommonService.ionicLoadingShow();
      AccountService.login($scope.user).success(function (data) {
        localStorage.setItem('usertoken', data.Values);
        $state.go("tab.main")
      }).error(function () {
        CommonService.showAlert("博绿网", "登录失败!", 'login');
      }).then(function () {
        $scope.userid = localStorage.getItem("usertoken");
        AccountService.getUserInfo($scope.userid).success(function (data) {
          localStorage.setItem('user', JSON.stringify(data.Values));
        })
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }
  })
  //查单列表
  .controller('SearchOrderCtrl', function ($scope, $rootScope, CommonService, SearchOrderService, SupplyService, DeliverService, $ionicTabsDelegate, $ionicSlideBoxDelegate) {
    //查单(卖货订单)获取卖货单列表参数
    $scope.sellparams = {
      currentPage: 1,//当前页码
      pageSize: 10,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//下单人账号
      Type: '',//0-物流配送1-送货上门2-上门回收
      Status: '',//0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款
      FromUser: ''//供货人
    }
    //查单(卖货订单)获取卖货单列表
    SearchOrderService.getSaleOrderList($scope.sellparams).success(function (data) {
      $scope.saleorderlist = data.Values;
      //订单状态(卖货单)
      $rootScope.saleorderStatus = ['关闭/取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认(已审验货单)', '已交易', '已结款'];
    })
    //查单(买货订单)获取买货单列表参数
    $scope.buyparams = {
      currentPage: 1,//当前页码
      pageSize: 10,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//买家账号
      Type: '',//0-物流配送1-送货上门2-上门回收
      Status: '',//0-未审核1-审核未通过2-审核通过3-已支付定金4-已收到定金5-备货中 6-备货完成7-已结款8-已返定金9-已成交10-已评价
      Expiration: ''//过期时间 是否取非过期时间 1是 0否
    }
    //查单(买货订单)获取买货单列表
    SupplyService.getToPage($scope.buyparams).success(function (data) {
      $scope.buyorderlist = data.Values;
      //订单状态(买货单)
      $rootScope.buyorderStatus = ['关闭/取消订单', '未审核', '审核未通过', '审核通过', '已支付定金', '已收到定金', '备货中', '备货完成', '已结款', '已返定金', '已成交', '已评价'];
    })
    //查单(供货订单)获取供货单列表参数
    $scope.supplyparams = {
      currentPage: 1,//当前页码
      pageSize: 10,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//下单人账号
      Status: '',//0-未审核1-审核未通过2-审核通过3-备货中/供货中4-供货完成
      BONo: '',//买货单号 关联买货单号
      ToUser: ''//买货人 关联买货单人
    }
    //查单(供货订单)获取供货单列表
    SearchOrderService.getSupplyPlanList($scope.supplyparams).success(function (data) {
      $scope.supplyorderlist = data.Values;
      console.log($scope.supplyorderlist);
      //订单状态(供货单)
      $rootScope.supplyorderStatus = ['关闭/取消订单', '未审核', '审核未通过', '审核通过', '备货中/供货中', '供货完成'];
    })
    //查单(收货订单)获取收货单列表参数
    $scope.collectparams = {
      currentPage: 1,//当前页码
      pageSize: 10,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
      FromUser: '',//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
      Status: '',//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
      ordertype: '',//类型 1卖货单2供货单
      Type: '' //0-物流配送1-送货上门2-上门回收
    }
    //查单(收货订单)获取收货单列表
    DeliverService.getSaleSupply($scope.collectparams).success(function (data) {
      $scope.collectorderlist = data.Values;
      //订单状态(卖货单)
      $rootScope.collectsellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
      //订单状态(供货单)
      $rootScope.collectsupplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
    })

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
  //查单买货详情
  .controller('ProcureOrderDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    CommonService.ionicPopover($scope, 'my-pay.html')

    $scope.procureorderdetailssubmit = function () {
      CommonService.showConfirm('', '<p>温馨提示:此订单的采购定金为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(定金=预计总金额*30%)</p>', '确定', '取消', 'procureorderdetails', 'procureorderdetails')
    }
  })
  //查单供货详情
  .controller('SupplyOrderPlanCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    CommonService.ionicPopover($scope, 'my-stockup.html');

  })
  .controller('EnteringNumCtrl', function ($scope, $rootScope, CommonService) {
    $scope.enteringnumsubmit = function () {
      CommonService.showConfirm('', '<p>恭喜您！您的供货单提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', '')
    }
  })
  .controller('SupplyOrderDetailsCtrl', function ($scope, $rootScope, CommonService) {
    CommonService.ionicPopover($scope, 'my-order.html');
  })
  // 查单审核验货单列表
  .controller('ExamineGoodsOrderCtrl', function ($scope, $rootScope, CommonService, SearchOrderService) {
    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 5,//编码 ,等于空时取所有
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      OrderNo: '',//卖货单号
      AddUser: '',//添加人
      Status: '',//1-待审核/验货完成2-已审核
      YhUser: ''//验货人
    }
    SearchOrderService.getYanhuoList($scope.params).success(function (data) {
      $scope.yanhuolist=data.Values.data_list;
      $scope.yanhuolistDetails=[];
      angular.forEach($scope.yanhuolist[0].Details,function (item) {
        item.checked=true;
        $scope.yanhuolistDetails.push(item)
      })

    })
    $scope.examinegoodsordersubmit = function () {
      CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', '')
    }

  })
  //查单收货单详情
  .controller('DeiverOrderDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    CommonService.ionicPopover($scope, 'my-payorder.html');

  })
  .controller('EvaluateCtrl', function ($scope, $rootScope, CommonService) {
    $scope.evaluatestar = function (index) {
      $scope.star = index;
    }
    ;
  })
  //通知消息列表
  .controller('NewsCtrl', function ($scope, $rootScope, CommonService, NewsService) {
    $scope.params = {
      page: 1,//页码
      size: 10,//条数
      userid: localStorage.getItem("usertoken")//用户id
    }
    NewsService.getNewsList($scope.params).success(function (data) {
      $scope.newsList = data.Values;
    })

    $scope.updateNewsLook = function (look, id) { //设置已读未读
      $scope.lookparams = {
        look: look,//页码
        ids: id
      }
      NewsService.updateNewsLook($scope.lookparams).success(function (data) {

      })
    }
  })
  //发货列表
  .controller('DeliverListCtrl', function ($scope, $rootScope, CommonService, DeliverService) {
    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 5,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
      FromUser: '',//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
      Status: 2,//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
      ordertype: '',//类型 1卖货单2供货单
      Type: '' //0-物流配送1-送货上门2-上门回收
    };
    DeliverService.getSaleSupply($scope.params).success(function (data) {
      $scope.deliverlist = data.Values;
      //订单状态(卖货单)
      $rootScope.sellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
      //订单状态(供货单)
      $rootScope.supplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
    })
  })
  //发货详情
  .controller('DeliverDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.deliverDetails = JSON.parse($stateParams.item);
    CommonService.ionicPopover($scope, 'my-order.html');

  })
  //提交发货信息
  .controller('DeliverGoodsCtrl', function ($scope, $rootScope, CommonService, DeliverService, AccountService) {
    $scope.deliverinfo = {};//发货信息获取
    $scope.Imgs = [];//图片信息数组
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
    //扫描物流单号
    $scope.barcodeScanner = function () {
      CommonService.barcodeScanner($scope);
    }
    //上传照片
    $scope.uploadActionSheet = function () {
      CommonService.uploadActionSheet($scope, 'Receipt');
    }

    //查询物流快递
    $scope.params = {
      code: '',
      name: ''
    }
    AccountService.getExpresses($scope.params).success(function (data) {
      $scope.expresses = data.Values;
    })

    //获取收货人地址
    $scope.addparams = {
      page: 1,
      size: 5,
      userid: $rootScope.deliverDetails.ToUser,
    }
    //获取用户常用地址
    AccountService.getAddrlist($scope.addparams).success(function (data) {
      $scope.addrliststatus = [];
      angular.forEach(data.Values.data_list, function (item) {
        if (item.status == 1) {
          $scope.addrliststatus.push(item);
        }
      })
    })


    //提交发货
    $scope.delivergoodssubmit = function () {

      //提交发货详细数据
      $scope.details = [];
      var ordeType = $rootScope.deliverDetails.OrdeType;
      angular.forEach(ordeType == 1 ? $rootScope.deliverDetails.Details : $rootScope.deliverDetails.SpO_Details, function (item) {
        var items = {};
        items.ProdID = item.ProdID;
        items.ProdName = item.ProdName;
        items.Unit = item.Unit;
        items.Num = item.Num;
        items.Price = item.Price;
        items.SaleClass = item.SaleClass;
        $scope.details.push(items);
      })
      //提交发货数据
      $scope.datas = {
        User: $rootScope.deliverDetails.ToUser,//订单所对应的会员账号
        OrderType: ordeType,//类型 1卖货单2供货单
        OrderNo: $rootScope.deliverDetails.No,//卖货单/供货单订单号
        TradeType: $scope.goodtype - 1,//交易方式 0-物流配送1-送货上门2-上门回收
        ExpName: $scope.deliverinfo.ExpName,//物流名称
        ExpNo: $scope.deliverinfo.ExpNo,//物流单号
        Number: $scope.deliverinfo.Number,//件数
        Weight: $scope.deliverinfo.Weight,//总重量
        Cost: '',//送货费或提货费
        ExpCost: '',//到付物流费
        Imgs: [{  //上传图片集合
          PicAddr: $scope.Imgs.PicAddr,
          PicDes: "拍照图库照片！"
        }],
        Details: $scope.details //发货明细

      }

      DeliverService.addFaHuo($scope.datas).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！您的发货信息提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', 'sellorderdetails', 'deliverlist');
      })

    }
  })
  //接单供货计划订单列表以及详情
  .controller('SupplyGoodCtrl', function ($scope, $rootScope, CommonService, SupplyService) {
    //接单供货模块要先判断一下，此会员是不是供货商，非供货商没有权限供货的 根据这个接口判断grade级别是不是5（5代表供货商）
    if (JSON.parse(localStorage.getItem("user")).grade != 5) {
      CommonService.showAlert("非供货商没有权限供货");
    }

    CommonService.ionicLoadingShow();
    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 10,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//买家账号
      Type: '',//交易方式 0-物流配送1-送货上门2-上门回收
      Status: 4,//0-未审核1-审核未通过2-审核通过3-已支付定金4-已收到定金5-备货中 6-备货完成7-已结款8-已返定金9-已成交10-已评价
      Expiration: 1//非过期时间 是否取非过期时间 1是 0否
    }
    //接单供货计划订单列表以及详情
    SupplyService.getToPage($scope.params).success(function (data) {
      $scope.supplylist = data.Values.data_list;
    }).finally(function () {
      CommonService.ionicLoadingHide();
    })

  })
  //供货计划填写
  .controller('SupplyPlanCtrl', function ($scope, $rootScope, CommonService, SupplyService, $stateParams) {
    $rootScope.supplyDetails = JSON.parse($stateParams.item);
    $rootScope.supplyinfo = [];//供货信息填写信息

    //根据距离及产品明细数量得到参考物流费用
    $scope.calculateExpressesCost = function () {
      $scope.details = [];
      angular.forEach($rootScope.supplyDetails.Details, function (item, index) {
        var items = {};
        items.Num = $rootScope.supplyinfo[index].num;
        items.SaleClass = item.SaleClass;
        $scope.details.push(items);
      })
      $scope.datas = {
        Distance: $rootScope.distance.replace('Km', ''),
        pDetail: $scope.details
      }

      SupplyService.addExpressesCost($scope.datas).success(function (data) {
        $scope.expressesCost = data.Values
      })
    }

  })
  //买货选择产品
  .controller('ReleaseProcureCtrl', function ($scope, $rootScope, CommonService) {
    //获取买货选择产品列表
    $rootScope.buyprods = JSON.parse(sessionStorage.getItem("getProds"));//行情报价数据
    $rootScope.buyprodsList = [];
    angular.forEach($rootScope.buyprods, function (item) {
      item.checked = false;
      $scope.buyprodsList.push(item);
    })
    //检查是否复选框选中
    $scope.checkChecded = function () {
      $scope.ischecked = false;
      angular.forEach($scope.buyprodsList, function (item) {
        if (item.checked) {
          $scope.ischecked = true;
        }
      })
    }
  })
  //买货发布采购单
  .controller('ProcureDetailsCtrl', function ($scope, $rootScope, CommonService, BuyService) {
    $scope.buyDetails = [];
    angular.forEach($rootScope.buyprodsList, function (item) {
      if (item.checked == true) {
        $scope.buyDetails.push(item);
      }
    })

    $scope.itemnumprice = [];//买货数量和价格
    $rootScope.buygoodssubmit = function () {//提交买货订单
      $scope.Details = [];//收货明细数据数组
      angular.forEach($scope.buyDetails, function (item, index) {
        var items = {};//收货明细json数据
        items.ProdID = item.PID;//产品编号
        items.ProdName = item.PName;//产品名称
        items.Unit = item.PUID;//计算单位ID
        items.Num = $scope.itemnumprice[index].buynum;//输入数量
        items.Price = $scope.itemnumprice[index].buyprice;//采购价格
        items.SaleClass = item.PUSaleType;//销售分类ID
        $scope.Details.push(items)
      })
      //提交买货订单数据
      $scope.buyDatas = {
        FromUser: localStorage.getItem('usertoken'),//下单人
        TradeType: 1,//交易方式 0-物流配送1-送货上门2-上门回收
        ToAddr: $rootScope.addrlistFirst.id,//收货地址ID
        Cycle: 0,//供货周期（天） 0-无限期：Cycle
        Details: $scope.Details//收货明细
      }
      BuyService.addBuyOrderDetails($scope.buyDatas).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！您的采购单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'procureorderdetails')
      })


    }

  })
  //收货地址选择提交采购单
  .controller('ReleaseProcureOrderCtrl', function ($scope, $rootScope, CommonService, AccountService) {
    CommonService.ionicLoadingShow()
    $scope.params = {
      page: 1,
      size: 10,
      userid: localStorage.getItem("usertoken")
    }
    //获取用户常用地址
    AccountService.getAddrlist($scope.params).success(function (data) {
      $rootScope.addrlist = data.Values.data_list;
      $rootScope.addrlistFirst = data.Values.data_list[0]
    }).finally(function () {
      CommonService.ionicLoadingHide()
    })


  })
  .controller('BuyGoodCtrl', function ($scope, $rootScope, CommonService) {
    CommonService.searchModal($scope);

  })
  .controller('SellGoodCtrl', function ($scope, $rootScope, $state, CommonService) {
    $scope.supplierList = $rootScope.supplierList;
    $scope.selectSupplier = function (item) {
      $rootScope.supplierListFirst = item;
      $state.go("selldetails");
    }
    CommonService.searchModal($scope);

  })
  //卖货下单
  .controller('SellDetailsCtrl', function ($scope, $rootScope, CommonService, SellService, AccountService) {
    CommonService.ionicLoadingShow();
    $scope.sellDetails = [];
    angular.forEach($rootScope.sellprodsList, function (item) {
      if (item.checked == true) {
        $scope.sellDetails.push(item);
      }
    })
    CommonService.getLocation();
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
      });
      //获取当前用户地址id和银行账号id
      $scope.params = {
        page: 1,
        size: 10,
        userid: localStorage.getItem("usertoken")
      }
      //获取用户常用地址
      AccountService.getAddrlist($scope.params).success(function (data) {
        $scope.addrliststatus = [];
        angular.forEach(data.Values.data_list, function (item) {
          if (item.status == 1) {
            $scope.addrliststatus.push(item);
          }
        })
      }).then(function () {
        //查询用户银行信息
        AccountService.getUserBanklist($scope.params).success(function (data) {
          $scope.userbankliststatus = [];
          angular.forEach(data.Values.data_list, function (item) {
            if (item.isdefault == 1) {
              $scope.userbankliststatus.push(item);
            }
          })
        }).then(function () {
          //提交卖货订单数据
          $scope.sellDatas = {
            FromUser: localStorage.getItem('usertoken'),//供应商账号
            ToUser: $rootScope.supplierListFirst.LogID,//回收商账号
            TradeType: 1,//交易方式 0-物流配送1-送货上门2-上门回收
            FromAddr: $rootScope.supplierListFirst.AddrID,//发货地址ID
            ToAddr: $scope.addrliststatus[0].id,//收货地址ID
            Account: $scope.userbankliststatus[0].id,//收款账号ID
            Details: $scope.Details//收货明细
          }

          SellService.addOrderDetails($scope.sellDatas).success(function (data) {
            CommonService.showConfirm('', '<p>恭喜您！您的卖货单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'sellorderdetails')
          }).finally(function () {
            CommonService.ionicLoadingHide();
          })
        })
      })

    }

  })
  //查单卖货详情
  .controller('SellOrderDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.deliverDetails = JSON.parse($stateParams.item);
    CommonService.ionicPopover($scope, 'my-order.html');


  })
  //我要卖货
  .controller('SellProcureCtrl', function ($scope, $rootScope, CommonService) {
    //获取卖货列表
    $rootScope.sellprods = JSON.parse(sessionStorage.getItem("getProds"));//行情报价数据
    $rootScope.sellprodsList = [];
    angular.forEach($rootScope.sellprods, function (item) {
      item.checked = false;
      $scope.sellprodsList.push(item);
    })
    //检查是否复选框选中
    $scope.checkChecded = function () {
      $scope.ischecked = false;
      angular.forEach($scope.sellprodsList, function (item) {
        if (item.checked) {
          $scope.ischecked = true;
        }
      })
    }
  })
  //验货列表
  .controller('CheckGoodCtrl', function ($scope, $rootScope, CommonService, DeliverService) {
    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 5,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
      FromUser: '',//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
      Status: 4,//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
      ordertype: '',//类型 1卖货单2供货单
      Type: '' //0-物流配送1-送货上门2-上门回收
    };
    DeliverService.getSaleSupply($scope.params).success(function (data) {
      $scope.deliverlist = data.Values;
      //订单状态(卖货单)
      $rootScope.sellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
      //订单状态(供货单)
      $rootScope.supplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
    })

  })
  //验货列表详情
  .controller('CheckDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.checkDetails = JSON.parse($stateParams.item);

  })
  //录入验货数据
  .controller('EnteringCheckCtrl', function ($scope, $rootScope, $state, CommonService, DeliverService) {
    $scope.checkinfo = {};//验货信息获取
    $scope.Imgs = [];//图片数组
    $scope.toaddproduct = function () {
      $state.go("addproduct")
    }

    //上传照片
    $scope.uploadActionSheet = function () {
      CommonService.uploadActionSheet($scope, 'Receipt');
    }
    $scope.checkgoodssubmit = function () {
      //提交验货详细数据
      $scope.details = [];
      var ordeType = $rootScope.checkDetails.OrdeType;
      angular.forEach(ordeType == 1 ? $rootScope.checkDetails.Details : $rootScope.checkDetails.SpO_Details, function (item) {
        var items = {};
        items.ProdID = item.ProdID;
        items.ProdName = item.ProdName;
        items.Unit = item.Unit;
        items.Num = item.Num;
        items.Price = item.Price;
        items.SaleClass = item.SaleClass;
        items.Status = item.Status;//（卖货单）0-待确认1-已退货2-暂存3-已成交 （供货单）4-待确认5-已退货6-暂存7-已成交
        $scope.details.push(items);
      })
      //提交验货数据
      $scope.datas = {
        AddUser: $rootScope.checkDetails.FromUser,//添加人账号 AddUser (SaleOrder/GetSaleSupply接口中对应的 FromUser）
        OrderType: ordeType,//类型 1卖货单2供货单
        OrderNo: $rootScope.checkDetails.No,//卖货单/供货单订单号
        Imgs: [{  //上传图片集合
          PicAddr: $scope.Imgs.PicAddr,
          PicDes: "拍照图库照片！"
        }],
        Details: $scope.details //验货明细

      }
      DeliverService.addYanhuo($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', 'checkgood')
      })

    }
  })

  .controller('AddProductCtrl', function ($scope, CommonService) {

  })
  //接单供货计划详情
  .controller('SupplyDetailsCtrl', function ($scope, $rootScope, CommonService, $stateParams, SupplyService) {
    $scope.supplyDetails = JSON.parse($stateParams.item);

    CommonService.getLocation();
    $scope.params = {
      longt: localStorage.getItem("longitude") || 116.4854800,//当前经度
      lat: localStorage.getItem("latitude") || 39.9484000,//胆怯纬度
      user: $scope.supplyDetails.FromUser //对应的会员对应的会员(一般为买家)
    }
    SupplyService.getRange($scope.params).success(function (data) {
      $rootScope.distance = data.Values;
    })

    SupplyService.getExpressesPrice().success(function (data) {
      $scope.expressesPrice = data.Values;
    })

  })
  //提交供货计划选择地址
  .controller('ReleaseSupplyCtrl', function ($scope, $rootScope, CommonService, AccountService, SupplyService) {
    $scope.params = {
      page: 1,
      size: 10,
      userid: localStorage.getItem("usertoken")
    }
    //获取用户常用地址
    AccountService.getAddrlist($scope.params).success(function (data) {
      $scope.addrlist = data.Values.data_list;
      $scope.addrliststatus = [];
      angular.forEach($scope.addrlist, function (item) {
        if (item.status == 1) {
          $scope.addrliststatus.push(item);
        }
      })
    })
    $scope.supplysubmit = function () {

      //供货计划明细数组
      $scope.details = [];

      angular.forEach($rootScope.supplyDetails.Details, function (item, index) {
        var items = {};//提交供货计划明细json数据
        items.ProdID = item.ProdID, // 产品编号
          items.ProdName = item.ProdName , // 产品名称
          items.SaleClass = item.SaleClass , // 销售分类ID
          items.Unit = item.Unit, // 计算单位ID
          items.Num = $rootScope.supplyinfo[index].num, //数量
          items.Price = item.Price//采购单价
        $scope.details.push(items)
      })
      //提交供货计划
      $scope.datas = {
        BONo: $rootScope.supplyDetails.No,//买货(采购)单号（待供货接口获取（BuyOrder/GetToPage））
        ToUser: $rootScope.supplyDetails.FromUser,//买货单(采购)账号（待供货接口获取）
        SupCycle: $rootScope.supplyDetails.SurplusCycle,//剩余供货周期（待供货接口获取）
        FromUser: localStorage.getItem("usertoken"),//供货人账号
        SupCount: $rootScope.supplyinfo.SupCount,//供货次数
        SupNum: $rootScope.supplyinfo.SupNum,//平均供货周期
        Details: $scope.details// 供货计划明细（BuyOrder/GetToPage））
      };

      SupplyService.addSupplyPlan($scope.datas).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！您的订单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'supplyorderplan')
      })

    }

  })
  //添加地址
  .controller('AddDealAddressCtrl', function ($scope, CommonService, AccountService) {
    CommonService.ionicLoadingShow();
    $scope.addrinfo = {};
    $scope.addrinfoother = {};
    $scope.addrcode = '0';
    AccountService.getArea($scope.addrcode).success(function (data) {
      $scope.addrareaprovince = data.Values;
    }).finally(function () {
      CommonService.ionicLoadingHide();
    })
    //选择省级联查询市
    $scope.selectProvince = function (addrcode) {
      AccountService.getArea(addrcode).success(function (data) {
        $scope.addrareacity = data.Values;
      })
    }
    //选择市级联查询县级
    $scope.selectCity = function (addrcode) {
      AccountService.getArea(addrcode).success(function (data) {
        $scope.addrareacounty = data.Values;
      })
    }

    //增加地址方法
    $scope.dealaddresssubmit = function () {
      CommonService.ionicLoadingShow();
      //选择县级查询当前记录
      angular.forEach($scope.addrareacounty, function (item) {
        if (item.code == $scope.addrinfoother.county) {
          $scope.addrareacountyone = item;
        }
      })
      $scope.addrinfo.id = 0;//传入id 则是修改地址
      $scope.addrinfo.userid = localStorage.getItem("usertoken");//用户id
      $scope.addrinfo.tel = $scope.addrinfo.mobile;//固定电话
      $scope.addrinfo.addrcode = $scope.addrareacountyone.code,	//地区编码
        $scope.addrinfo.areaname = $scope.addrareacountyone.mergername, // 地区全称
        $scope.addrinfo.status = $scope.addrinfoother.isstatus ? 1 : 0,	//是否默认0-否，1-是
        $scope.addrinfo.postcode = $scope.addrareacountyone.zipcode,	//邮政编码
        $scope.addrinfo.lat = $scope.addrareacountyone.lat, 	//纬度
        $scope.addrinfo.lon = $scope.addrareacountyone.lng, 	//经度
        $scope.addrinfo.addrtype = 0	//地址类型0-	交易地址（默认）1-	家庭住址2-公司地址

      AccountService.setAddr($scope.addrinfo).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！</p><p>地址信息添加成功！</p>', '查看', '关闭', 'dealaddress')
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }

  })
  //地址详细列表
  .controller('DealAddressCtrl', function ($scope, $state, $rootScope, CommonService, AccountService) {
    if ($rootScope.addrlist) {
      $scope.addrlist = $rootScope.addrlist;
      $scope.selectAddress = function (item) {
        $rootScope.addrlistFirst = item;
        $state.go("releaseprocureorder");
      }
    }
    $scope.params = {
      page: 1,
      size: 10,
      userid: localStorage.getItem("usertoken")
    }
    //获取用户常用地址
    AccountService.getAddrlist($scope.params).success(function (data) {
      $scope.addrlist = data.Values.data_list;
    })
    //删除用户常用地址
    $scope.deleteAddr = function (addrid, index) {
      $scope.delparams = {
        id: addrid,
        userid: localStorage.getItem("usertoken")
      }
      AccountService.deleteAddr($scope.delparams).success(function (data) {
        $scope.addrlist.splice(index, 1)
      })
    }

  })
  //签收列表
  .controller('SignListCtrl', function ($scope, $rootScope, CommonService, DeliverService) {
    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 5,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      User: '',//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
      FromUser: '',//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
      Status: 3,//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
      ordertype: '',//类型 1卖货单2供货单
      Type: '' //0-物流配送1-送货上门2-上门回收
    };
    DeliverService.getSaleSupply($scope.params).success(function (data) {
      $scope.deliverlist = data.Values;
      //订单状态(卖货单)
      $rootScope.sellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
      //订单状态(供货单)
      $rootScope.supplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
    })

  })
  .controller('SignDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.signDetails = JSON.parse($stateParams.item);

  })
  .controller('SignCtrl', function ($scope, $rootScope, CommonService, DeliverService, AccountService) {
    $scope.signinfo = {};//签收信息获取
    $scope.Imgs = [];//图片信息数组
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
    //扫描物流单号
    $scope.barcodeScanner = function () {
      CommonService.barcodeScanner($scope);
    }
    //上传照片
    $scope.uploadActionSheet = function () {
      CommonService.uploadActionSheet($scope, 'Receipt');
    }

    //查询物流快递
    $scope.params = {
      code: '',
      name: ''
    }
    AccountService.getExpresses($scope.params).success(function (data) {
      $scope.expresses = data.Values;
    })


    //签收提交
    $scope.signsubmit = function () {

      var ordeType = $rootScope.deliverDetails.OrdeType;
      //提交签收数据
      $scope.datas = {
        User: $rootScope.deliverDetails.FromUser,//订单所对应的会员账号
        OrderType: ordeType,//类型 1卖货单2供货单
        OrderNo: $rootScope.deliverDetails.No,//卖货单/供货单订单号
        TradeType: $scope.goodtype - 1,//交易方式 0-物流配送1-送货上门2-上门回收
        ExpName: $scope.signinfo.ExpName,//物流名称
        ExpNo: $scope.signinfo.ExpNo,//物流单号
        Number: $scope.signinfo.Number,//件数
        Weight: $scope.signinfo.Weight,//总重量
        Cost: $scope.signinfo.Cost,//送货费或提货费
        ExpCost: $scope.signinfo.ExpCost,//到付物流费
        Imgs: [{  //上传图片集合
          PicAddr: $scope.Imgs.PicAddr,
          PicDes: "拍照图库照片！"
        }]

      }

      DeliverService.addSign($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', 'signlist')
      })

    }


  })
  //我的账号
  .controller('AccountCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {
    $scope.userid = localStorage.getItem("usertoken");
    AccountService.getUserInfo($scope.userid).success(function (data) {
      $rootScope.userinfo = data.Values;
    })
  })
  //账号信息
  .controller('AccountInfoCtrl', function ($scope, $rootScope, $state, CommonService) {

  })
  //申请成为供应商
  .controller('ApplyProviderCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {
    $scope.addrinfo = {};
    $scope.addrcode = '0';
    //选择省级
    AccountService.getArea($scope.addrcode).success(function (data) {
      $scope.addrareaprovince = data.Values;
    })
    //选择省级联查询市
    $scope.selectProvince = function (addrcode) {
      AccountService.getArea(addrcode).success(function (data) {
        $scope.addrareacity = data.Values;
      })
    }
    //选择市级联查询县级
    $scope.selectCity = function (addrcode) {
      AccountService.getArea(addrcode).success(function (data) {
        $scope.addrareacounty = data.Values;
      })
    }

    $scope.applyprovidersubmit = function () {
      //选择县级查询当前记录
      angular.forEach($scope.addrareacounty, function (item) {
        if (item.code == $scope.addrinfo.county) {
          $scope.addrareaone = item;
        }
      })
      $scope.datas = {
        userid: localStorage.getItem("usertoken"),		//用户id
        username: JSON.parse(localStorage.getItem("user")).username,	//姓名
        mobile: JSON.parse(localStorage.getItem("user")).mobile,	//手机号码
        addrcode: $scope.addrareaone.code,	//地区编码
        addr: $scope.addrinfo.address,	//详细地址
        quantity: $scope.addrinfo.num, 	//供货量
        prodclass: "",//供货品类（多个以逗号隔开）
        lat: $scope.addrareaone.lat,	//纬度
        lng: $scope.addrareaone.lng	//经度

      }
      AccountService.applySupply($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！提交申请成功！</p>')
      })

    }
  })
  //我的预收款列表
  .controller('MyAvanceCtrl', function ($scope, $rootScope, CommonService, ApplyAdvanceService) {

    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 5,//每页条数
      ID: '',//编码 ,等于空时取所有
      No: '',//单号
      RelateNo: 0,//关联单号
      User: localStorage.getItem("usertoken")//申请人
    }
    ApplyAdvanceService.getApplyPayment($scope.params).success(function (data) {
      $scope.applylist = data.Values;
      $scope.applystatus = ['关闭/取消', '未审核', '审核未通过', '审核通过', '款已到账', '款已还完', '已完成'];
    })
  })
  //获取还款记录列表
  .controller('DavanceDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.applaydetails = JSON.parse($stateParams.item);
  })
  //还款提交
  .controller('RepaymentCtrl', function ($scope, $rootScope, $state, CommonService, ApplyAdvanceService) {
    $scope.applaydetails = $rootScope.applaydetails;
    $scope.repaymentinfo = {};

    $scope.repaymentMoney = function () {
      //计算还款金额   应还金额=本金金额*服务费比率*贷款周期+本金金额
      $scope.repayMoney = $scope.repaymentinfo.Money * $scope.applaydetails.FuWu / 100 * $scope.applaydetails.Cycle + $scope.repaymentinfo.Money;
      //提交还款记录数据
      $scope.datas = {
        RelateNo: 0,//关联单号
        User: localStorage.getItem("usertoken"),//还款人
        Money: $scope.repayMoney,//还款金额
        Remark: "还款完毕"//备注
      }
      ApplyAdvanceService.addRepayment($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！还款成功！</p>')
      })
    }
  })
  //申请预收款
  .controller('ApplyAdvancesCtrl', function ($scope, $rootScope, $state, CommonService, ApplyAdvanceService, AccountService) {
    $scope.applyinfo = {}
    //查询用户银行信息
    $scope.params = {
      page: 1,
      size: 5,
      userid: localStorage.getItem("usertoken")
    }
    AccountService.getUserBanklist($scope.params).success(function (data) {
      $scope.userbankliststatus = [];
      angular.forEach(data.Values.data_list, function (item) {
        if (item.isdefault == 1) {
          $scope.userbankliststatus.push(item);
        }
      })
    })
    $scope.applyadvancesubmit = function () {
      $scope.datas = {
        RelateNo: 0,//关联单号
        User: localStorage.getItem("usertoken"),//申请人
        BankID: $scope.userbankliststatus[0].id,//银行ID
        Money: $scope.applyinfo.Money,//申请金额
        Cycle: $scope.applyinfo.Cycle,//货款周期（天）
        RepaymentType: 1,//还款方式1.等额本金2.等额本息
        FuWu: 3,//服务费比例
        Remark: "第一次申请"//备注
      }
      ApplyAdvanceService.applyPayment($scope.datas).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！您的预收款申请提交成功！</p><p>我们会尽快处理您的订单</p>', '查看订单', '关闭', 'myadvance')
      })

    }
  })
  //收款银行账号列表
  .controller('CollectionAccountCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {
    $scope.params = {
      page: 1,//页码
      size: 5,//条数
      userid: localStorage.getItem("usertoken")//用户id
    }
    $scope.getUserBanklist = function () {
      AccountService.getUserBanklist($scope.params).success(function (data) {
        $scope.userbanklist = data.Values;
      })
    }
    $scope.getUserBanklist();
    //删除银行账号
    $scope.delUserBank = function (bankId) {
      $scope.delparams = {
        id: bankId,//银行id
        userid: localStorage.getItem("usertoken")//用户id
      }
      AccountService.delUserBank($scope.delparams).success(function (data) {
        $scope.getUserBanklist();//刷新
      })
    }
  })
  //增加收款银行账号
  .controller('AddBankAccountCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {
    //查询银行名称
    AccountService.getBankName({name: ''}).success(function (data) {
      $scope.bankName = data.Values;
    })
    //增加收款银行账号信息
    $scope.bankinfo = {};
    $scope.addUserBank = function () {
      $scope.datas = {
        id: 0, 	// id
        bankname: $scope.bankinfo.bankname,	//银行名称
        userid: localStorage.getItem("usertoken"),	//用户id
        branchname: $scope.bankinfo.branchname,	//支行名称
        accountno: $scope.bankinfo.accountno,	//银行帐号
        accountname: $scope.bankinfo.accountname,	//开户人名称
        isdefault: $scope.bankinfo.isdefault ? 1 : 0, 	//是否默认0-	否（默认值）1-	是
        remark: ""	//备注
      }
      AccountService.addUserBank($scope.datas).success(function (data) {
        $state.go('collectionaccount');
      })
    }

  })
  .controller('MyCreditCtrl', function ($scope, $rootScope, $state, CommonService) {

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
  .controller('SettingCtrl', function ($scope, $rootScope, $state, CommonService) {

  })
  //解绑手机
  .controller('CancelMobileCtrl', function ($scope, $rootScope, $state, CommonService) {

  })
  //修改用户头像图片
  .controller('UploadHeadrCtrl', function ($scope, $rootScope, $stateParams, $state, CommonService) {
    $scope.figureurl = $stateParams.figure;
    $scope.uploadActionSheet = function () {
      CommonService.uploadActionSheet($scope, 'User');
    }
  })
  //修改用户信息
  .controller('UpdateUserCtrl', function ($scope, $rootScope, $stateParams, $state, CommonService, AccountService) {
    $scope.type = $stateParams.type;
    $scope.value = $stateParams.value;
    ;
    $scope.user = {};
    $scope.updateUser = function () {
      $scope.params = {
        userid: localStorage.getItem("usertoken"),
        sex: $scope.user.sex,
        nickname: $scope.user.nickname
      }
      if ($scope.type == 'nickname') { //修改昵称
        AccountService.modifyNickname($scope.params).success(function (data) {
          $state.go('tab.account');
        })
      } else if ($scope.type == 'sex') {//修改性别
        AccountService.modifySex($scope.params).success(function (data) {
          $state.go('tab.account');
        })
      }
    }

  })
  .controller('MyPopover', function ($scope, $rootScope, $state, CommonService) {
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
