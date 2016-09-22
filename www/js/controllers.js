angular.module('starter.controllers', [])
  .config(function ($httpProvider) {
    //发货录入Fromuser，签收，验货录user，审核验货，及退货录Fromuser
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
  .controller('MainCtrl', function ($scope, $state, $rootScope, $stateParams, $ionicSlideBoxDelegate, CommonService, $ionicLoading, $ionicHistory, BooLv, MainService, NewsService, $ionicPlatform, AccountService) {
    CommonService.ionicLoadingShow();
    $rootScope.commonService = CommonService;
    $scope.getMainData = function () {
      //登录授权
      MainService.authLogin().success(function (data) {
        localStorage.setItem('token', data.Values)
      }).then(function () {
        //获取广告图
        MainService.getAdMsg().success(function (data) {
          $scope.adImg = data.Values;
          console.log($scope.adImg);
          //ng-repeat遍历生成一个个slide块的时候，执行完成页面是空白的 手动在渲染之后更新一下，在控制器注入$ionicSlideBoxDelegate，然后渲染数据之后
          $ionicSlideBoxDelegate.update();
          //上面这句就是实现无限循环的关键，绑定了滑动框，
          $ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);

        })
        //获取行情报价
        /*     MainService.getProds().success(function (data) {
         $scope.prods = data.Values;
         sessionStorage.setItem("getProds", JSON.stringify(data.Values));//行情报价数据复用
         })*/
        //获取行情报价分页列表

        $scope.restProdsParams = {
          currentPage: 1,
          pageSize: 10
        }
        $scope.ProdsParams = {
          IDList: '',
          prodname: '',//产品类别名
          GrpIDList: '',//产品类别ID，多个用，隔开
          IsTH: 1,//是否为统货 0否1是
          NoGrpIDList: ''//其他类别
        }
        MainService.getProdsList($scope.restProdsParams, $scope.ProdsParams).success(function (data) {
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
        try {
          window.plugins.jPushPlugin.getRegistrationID(function (data) {
            $scope.jPushRegistrationID = data;

            //提交设备信息到服务器
            $scope.datas = {
              registration_id: $scope.jPushRegistrationID,	//极光注册id
              user: localStorage.getItem("usertoken"),	//用户id,没登录为空
              mobile: JSON.stringify(localStorage.getItem("user")).mobile,	//手机号码
              alias: "",	//设备别名
              device: $ionicPlatform.is('android') ? 0 : 1	//设备类型:0-android,1-ios
            }
            NewsService.setDeviceInfo($scope.datas).success(function (data) {

            })
          })
        } catch (e) {
          console.log(e);
        }
        if ($ionicPlatform.is('android') || $ionicPlatform.is('ios')) {
          //自动更新软件版本
          $scope.versionparams = {
            currentPage: 1,//当前页码
            pageSize: 5,//每页条数
            ID: '',//编码 ,等于空时取所有
            Name: '博绿固废直卖',//软件名称（中文）
            NameE: '',//软件名称（英文）
            Enable: 1 //是否启用 1启用 2禁用
          }
          AccountService.getVersions($scope.versionparams).success(function (data) {
            $scope.versions = data.Values.data_list[0];
            if (BooLv.version < $scope.versions.VerCode) {
              AccountService.showUpdateConfirm($scope.versions.Remark, $scope.versions.Attached,$scope.versions.VerCode);
            }
          })
        }

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

    $scope.windowOpen = function (url) {
      CommonService.windowOpen(url)
    }
  })
  .controller('StartCtrl', function ($scope, $state, $rootScope, CommonService) {
    $scope.tomain = function () {
      $state.go('tab.main', {reload: true});
    }
  })

  //实时报价
  .controller('CurrentTimeOfferCtrl', function ($scope, $rootScope, $state, $stateParams, CommonService, MainService) {
    $scope.type = $stateParams.GrpID;
    //获取行情报价分页列表
    $scope.currentprods = [];
    $scope.currentPage = 0;
    $scope.total = 1;
    $scope.currentTimeOffer = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.currentPage = 0;
        $scope.currentprods = [];
      }
      $scope.currentPage++;
      $scope.restProdsParams = {
        currentPage: $scope.currentPage,
        pageSize: 10
      }
      $scope.ProdsParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: $scope.type == 0 ? '' : $scope.type,//产品类别ID，多个用，隔开
        IsTH: $scope.type == 0 ? 1 : 0,//是否为统货 0否1是
        NoGrpIDList: ''//其他类别
      }
      MainService.getProdsList($scope.restProdsParams, $scope.ProdsParams).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.currentprods.push(item);
        })
        $scope.total = data.Values.page_count;
      })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }).then(function () {
        if ($scope.type == 0) {
          angular.forEach($scope.currentprods, function (item, index) {
            $scope.getProdsListIsNotTH(item.GrpID, index);
          })
        }
      })
    }
    $scope.currentTimeOffer();
    $scope.isNotTHCurrentprods = [];
    //首页调统货，详情就是这个类下的非统货
    $scope.getProdsListIsNotTH = function (GrpIDList, index) {
      $scope.restIsNotTHParams = {
        currentPage: 1,
        pageSize: 1000
      }
      $scope.isNotTHParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: GrpIDList || '',//产品类别ID，多个用，隔开
        IsTH: 0,//是否为统货 0否1是
        NoGrpIDList: ''//其他类别
      }
      MainService.getProdsList($scope.restIsNotTHParams, $scope.isNotTHParams).success(function (data) {
        //类下的非统货
        $scope.isNotTHCurrentprods[index] = data.Values.data_list;
      })
    }
  })
  //交易公告
  .controller('DealNoticeCtrl', function ($scope, $rootScope, $stateParams, $state, BooLv, CommonService, MainService) {
    CommonService.ionicLoadingShow();
    var Id = $stateParams.Id;
    MainService.getNews(Id).success(function (data) {
      $scope.news = data.Values;
    }).finally(function () {
      CommonService.ionicLoadingHide();
    })
    //分享
    $scope.shareActionSheet = function () {
      umeng.share($scope.news.Title, $scope.news.Note, $scope.news.PicAddr, BooLv.moblileApi + '/#/dealnotice/' + Id);
    }

  })
  //公司新闻
  .controller('CompanyTrendsCtrl', function ($scope, $rootScope, $stateParams, $state, BooLv, CommonService, MainService) {
    CommonService.ionicLoadingShow();
    var Id = $stateParams.Id;
    MainService.getNews(Id).success(function (data) {
      $scope.news = data.Values;
    }).finally(function () {
      CommonService.ionicLoadingHide();
    })
    //分享
    $scope.shareActionSheet = function () {
      umeng.share($scope.news.Title, $scope.news.Note, $scope.news.PicAddr, BooLv.moblileApi + '/#/companytrends/' + Id);
    }


  })

  .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, CommonService, AccountService) {
    $rootScope.commonService = CommonService;
    //删除记住用户信息
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    $scope.user = {};//提前定义用户对象
    $scope.agreedeal = true;//同意用户协议
    $scope.paracont = "获取验证码"; //初始发送按钮中的文字
    $scope.paraclass = false; //控制验证码的disable
    $scope.checkphone = function (mobilephone) {//检查手机号
      AccountService.checkMobilePhone($scope, mobilephone);
    }
    $scope.blurcheckphone=function (mobilephone) {
      if(!AccountService.checkMobilePhone($scope, mobilephone)){
        CommonService.toolTip("手机号有误","")
      }

    }
    $scope.sendCode = function () {
      event.preventDefault();
      if ($scope.paraclass) { //按钮可用
        //60s倒计时
        AccountService.countDown($scope);
        AccountService.sendCode($scope.user.username).success(function (data) {
          $scope.user.passwordcode = data.Values;
        }).error(function () {
          CommonService.platformPrompt("验证码获取失败!", 'close');
        })
      }

    }
    $scope.loginSubmit = function () {
      if ($scope.user.passwordcode != $scope.user.password) {
        CommonService.platformPrompt("输入验证码不正确", 'close');
        return;
      }
      CommonService.ionicLoadingShow();
      AccountService.login($scope.user).success(function (data) {
        if (data.Key != 200) {
          CommonService.platformPrompt("登录失败!", 'close');
          return;
        }
        localStorage.setItem('usertoken', data.Values);

      }).error(function () {
        CommonService.platformPrompt("登录失败!", 'close');
      }).then(function () {
        $scope.userid = localStorage.getItem("usertoken");
        AccountService.getUserInfo($scope.userid).success(function (data) {
          localStorage.setItem('user', JSON.stringify(data.Values));
        })
        CommonService.getStateName();   //跳转页面
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }

  })
  //查单列表
  .controller('SearchOrderCtrl', function ($scope, $rootScope, CommonService, SearchOrderService, SupplyService, DeliverService, $ionicTabsDelegate, $ionicSlideBoxDelegate) {
    //是否登录
    if (!CommonService.isLogin()) {
      return;
    }
    //搜索订单号内容
    $scope.search = {};//搜索内容
    $scope.searchcontent = '';//输入内容
    $scope.searchquery = function (searchcontent) {
      var index = $ionicTabsDelegate.selectedIndex();
      $scope.searchcontent = searchcontent;
      if (index == 0) {
        $scope.getSaleOrderList();
      } else if (index == 1) {
        $scope.buyOrderList();
      } else if (index == 2) {
        $scope.getSupplyPlanList();
      } else if (index == 3) {
        $scope.getSaleSupply();
      }
      $scope.closeModal();
    }
    $scope.saleorderlist = [];
    $scope.sellparamspage = 0;
    $scope.sellparamstotal = 1;
    $scope.getSaleOrderList = function () {
      if ((arguments != [] && arguments[0] == 0) || $scope.searchcontent != '') {
        $scope.sellparamspage = 0;
        $scope.saleorderlist = [];
      }
      $scope.sellparamspage++;
      //查单(卖货订单)获取卖货单列表参数
      $scope.sellparams = {
        currentPage: $scope.sellparamspage,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: $scope.searchcontent || '',//订单号，模糊匹配
        User: '',//下单人账号
        Type: '',//0-物流配送1-送货上门2-上门回收
        Status: '',//0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款
        FromUser: localStorage.getItem("usertoken")//供货人
      }

      //查单(卖货订单)获取卖货单列表
      SearchOrderService.getSaleOrderList($scope.sellparams).success(function (data) {
        $scope.searchcontent = '';//清空搜索条件
        angular.forEach(data.Values.data_list, function (item) {
          $scope.saleorderlist.push(item);
        })
        $scope.sellparamstotal = data.Values.page_count;
        //订单状态(卖货单)
        $rootScope.saleorderStatus = ['关闭/取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认(已审验货单)', '已交易', '已结款'];

      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getSaleOrderList();
    $scope.buyorderlist = [];
    $scope.buyparamspage = 0;
    $scope.buyparamstotal = 1;
    $scope.buyOrderList = function () {
      if (arguments != [] && arguments[0] == 0 || $scope.searchcontent != '') {
        $scope.buyparamspage = 0;
        $scope.buyorderlist = [];
      }
      $scope.buyparamspage++;
      //查单(买货订单)获取买货单列表参数
      $scope.buyparams = {
        currentPage: $scope.buyparamspage,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: $scope.searchcontent || '',//订单号，模糊匹配
        User: localStorage.getItem("usertoken"),//买家账号
        Type: '',//0-物流配送1-送货上门2-上门回收
        Status: '',//0-未审核1-审核未通过2-审核通过3-已支付定金4-已收到定金5-备货中 6-备货完成7-已结款8-已返定金9-已成交10-已评价
        Expiration: '',//过期时间 是否取非过期时间 1是 0否
        SurplusNum: '' //表示剩余供货量大于0，如果剩余供货量0，就不需要供货了
      }
      //查单(买货订单)获取买货单列表
      SupplyService.getToPage($scope.buyparams).success(function (data) {
        $scope.searchcontent = '';//清空搜索条件
        angular.forEach(data.Values.data_list, function (item) {
          $scope.buyorderlist.push(item);
        })
        $scope.buyparamstotal = data.Values.page_count;
        //订单状态(买货单)
        $rootScope.buyorderStatus = ['关闭/取消订单', '未审核', '审核未通过', '审核通过', '已支付定金', '已收到定金', '备货中', '备货完成', '已结款', '已返定金', '已成交', '已评价'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.buyOrderList();

    $scope.supplyorderlist = [];
    $scope.supplyparamspage = 0;
    $scope.supplyparamstotal = 1;
    $scope.getSupplyPlanList = function () {
      if (arguments != [] && arguments[0] == 0 || $scope.searchcontent != '') {
        $scope.supplyparamspage = 0;
        $scope.supplyorderlist = [];
      }
      $scope.supplyparamspage++;
      //查单(供货订单)获取供货单列表参数
      $scope.supplyparams = {
        currentPage: $scope.supplyparamspage,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: $scope.searchcontent || '',//订单号，模糊匹配
        User: localStorage.getItem("usertoken"),//下单人账号
        Status: '',//0-未审核1-审核未通过2-审核通过3-备货中/供货中4-供货完成
        BONo: '',//买货单号 关联买货单号
        ToUser: ''//买货人 关联买货单人
      }
      //查单(供货订单)获取供货单列表
      SearchOrderService.getSupplyPlanList($scope.supplyparams).success(function (data) {
        $scope.searchcontent = '';//清空搜索条件
        angular.forEach(data.Values.data_list, function (item) {
          $scope.supplyorderlist.push(item);
        })
        $scope.supplyparamstotal = data.Values.page_count;
        //订单状态(供货单)
        $rootScope.supplyorderStatus = ['关闭/取消订单', '未审核', '审核未通过', '审核通过', '备货中/供货中', '供货完成'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getSupplyPlanList();

    $scope.collectorderlist = [];
    $scope.collectparamspage = 0;
    $scope.collectparamstotal = 1;
    $scope.getSaleSupply = function () {
      if (arguments != [] && arguments[0] == 0 || $scope.searchcontent != '') {
        $scope.collectparamspage = 0;
        $scope.collectorderlist = [];
      }
      $scope.collectparamspage++;
      //查单(收货订单)获取收货单列表参数
      $scope.collectparams = {
        currentPage: $scope.collectparamspage,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: $scope.searchcontent || '',//订单号，模糊匹配
        User: localStorage.getItem("usertoken"),//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
        FromUser: '',//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
        Status: '',//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
        ordertype: '',//类型 1卖货单2供货单
        Type: '' //0-物流配送1-送货上门2-上门回收
      }
      //查单(收货订单)获取收货单列表
      DeliverService.getSaleSupply($scope.collectparams).success(function (data) {
        $scope.searchcontent = '';//清空搜索条件
        angular.forEach(data.Values.data_list, function (item) {
          $scope.collectorderlist.push(item);
        })
        $scope.collectparamstotal = data.Values.page_count;
        //订单状态(卖货单)
        $rootScope.collectsellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
        //订单状态(供货单)
        $rootScope.collectsupplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getSaleSupply();

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
    CommonService.searchModal($scope, 'templates/search.html');

  })
  //查单买货详情
  .controller('ProcureOrderDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService, MainService,SearchOrderService) {
    $rootScope.buyDetails = JSON.parse($stateParams.item);
    console.log($rootScope.buyDetails);
    CommonService.ionicPopover($scope, 'my-pay.html');
    //订单号
    $rootScope.orderId = $rootScope.buyDetails.No;
    //订单类型
    $rootScope.OrdeType = $rootScope.buyDetails.OrdeType;//订单类型 1卖货单2供货单
    //评价订单类型
    $rootScope.orderType = 2;//订单类型1-卖货单2-买货单3-供货单
    //被评价人的ID
    $rootScope.evaluateFromUser = $rootScope.buyDetails.FromUser;
    //订单状态
    $rootScope.orderStatus = $rootScope.buyDetails.Status;

    $scope.isNotTHCurrentprods = [];
    //买货统货类下的非统货
    $scope.getProdsListIsNotTH = function (GrpIDList, index) {
      $scope.restIsNotTHParams = {
        currentPage: 1,
        pageSize: 1000
      }
      $scope.isNotTHParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: GrpIDList || '',//产品类别ID，多个用，隔开
        IsTH: 0,//是否为统货 0否1是
        NoGrpIDList: ''//其他类别
      }
      MainService.getProdsList($scope.restIsNotTHParams, $scope.isNotTHParams).success(function (data) {
        //产品类别下的非统货
        $scope.isNotTHCurrentprods[index] = data.Values.data_list;
      })

    }

    angular.forEach($scope.buyDetails, function (item, index) {
      $scope.getProdsListIsNotTH(item.GrpID, index);
    })

    //支付定金
    $rootScope.procureorderdetailssubmit = function () {
      //支付定金确认
      $scope.paymoney = function () {
        //提交结算信息  到付款输入金额，其他3个余款，定金，订单金额是不是为0
        /*      这个是根据单号来分析的，结算在买货，卖货，供货里都有结算功能
         是卖货时，审核验货单后（6）或者已交易（7）后就是结款（8）
         是买货时，审核通过（2）后就是已支付定金（3），及备货完成（6)后就是已结款(7)
         供货时，审核验货单（7）后就是结款（8）*/
        $scope.datas = {
          OrderNo: $rootScope.buyDetails.No,//订单号
          OrderType: 2,//1-卖货单2-买货单3-供货单
          FromUser: $rootScope.buyDetails.FromUser,//付款方
          ToUser: $rootScope.buyDetails.ToUser,//收款方
          Amount: 0,//订单金额
          Yushou: 0,//到付款
          AmountFu: 0,//余款
          Earnest: 0,//定金
          Status: 6 //订单所对应的结算状态值
        }
        SearchOrderService.addStatement($scope.datas).success(function (data) {

        }).then(function () {
          //查单(买货订单)修改买货订单状态
          $scope.params = {
            No: $rootScope.buyDetails.No,//订单号
            User: $rootScope.buyDetails.FromUser,//下单人账号
            Status: 3//状态值(-1取消订单 0-未审核1-审核未通过2-审核通过3-已支付定金4-已收到定金5-备货中 6-备货完成7-已结款8-已返定金9-已成交10-已评价)
          }
          SearchOrderService.updateBuyOrderStatus($scope.params).success(function (data) {
            CommonService.platformPrompt('定金支付成功');
          })
        })
      }
      CommonService.showConfirm('', '<p>温馨提示:此订单的买货定金为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(定金=预计总金额*30%)</p>', '确定', '取消', '', 'procureorderdetails', $scope.paymoney)
    }

  })
  //查单供货详情
  .controller('SupplyOrderPlanCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.supplyDetails = JSON.parse($stateParams.item);
    CommonService.ionicPopover($scope, 'my-stockup.html');
    //订单号
    $rootScope.orderId = $rootScope.supplyDetails.No;
    //订单类型
    $rootScope.OrdeType = $rootScope.supplyDetails.OrdeType;//订单类型 1卖货单2供货单
    //评价订单类型
    $rootScope.orderType = 3;//订单类型1-卖货单2-买货单3-供货单
    //被评价人的ID
    $rootScope.evaluateFromUser = $rootScope.supplyDetails.FromUser;
    //订单状态
    $rootScope.orderStatus = $rootScope.supplyDetails.Status;

    //是否供货   备货按钮的条件是计划单的状态是2或者 3，且要供的总数量总重量不等于已供的数量总重量才能备货。不然可能就是还没有到这一步或者已经供完了
    $rootScope.isSupply = ($rootScope.supplyDetails.NumSum != $rootScope.supplyDetails.SupSum || $rootScope.supplyDetails.WeightSum != $rootScope.supplyDetails.SupWeight) ? true : false;
  })
  //查单供货计划备货录入
  .controller('EnteringNumCtrl', function ($scope, $rootScope, $state, $stateParams, CommonService, AccountService, SearchOrderService) {
    $rootScope.deliverDetails = JSON.parse($stateParams.item)

    $scope.supplyinfo = [];//供货信息
    $scope.params = {
      page: 1,
      size: 10,
      userid: localStorage.getItem("usertoken")
    }
    //获取发货用户常用地址ID
    AccountService.getAddrlist($scope.params).success(function (data) {
      $scope.addrlist = data.Values.data_list;
      $scope.addrliststatus = [];
      angular.forEach($scope.addrlist, function (item) {
        if (item.status == 1) {
          $scope.addrliststatus.push(item);
        }
      })
    })
    $scope.toAddrparams = {
      page: 1,
      size: 10,
      userid: $rootScope.deliverDetails.ToUser
    }
    //获取收货用户常用地址ID
    AccountService.getAddrlist($scope.toAddrparams).success(function (data) {
      $scope.toAddraddrlist = data.Values.data_list;
      $scope.toAddraddrliststatus = [];
      angular.forEach($scope.toAddraddrlist, function (item) {
        if (item.status == 1) {
          $scope.toAddraddrliststatus.push(item);
        }
      })
    })
    //查询用户银行信息
    AccountService.getUserBanklist($scope.params).success(function (data) {
      $scope.userbankliststatus = [];
      angular.forEach(data.Values.data_list, function (item) {
        if (item.isdefault == 1) {
          $scope.userbankliststatus.push(item);
        }
      })
    })
    $scope.enteringnumsubmit = function () {
      if ($scope.addrliststatus.length == 0) {
        CommonService.platformPrompt('请先添加一个默认地址', 'adddealaddress')
        $state.go('adddealaddress');
        return;
      }
      if ($scope.userbankliststatus.length == 0) {
        CommonService.platformPrompt('请先添加一个默认银行账户', 'addbankaccount')
        $state.go('addbankaccount');
        return;
      }
      if ($scope.toAddraddrliststatus.length == 0) {
        CommonService.platformPrompt('获取收货用户常用地址失败');
        return;
      }
      //供货计划明细数组
      $scope.details = [];
      angular.forEach($rootScope.deliverDetails.Details, function (item, index) {
        var items = {};//提交供货计划明细json数据
        items.ProdID = item.ProdID, // 产品编号
          items.ProdName = item.ProdName , // 产品名称
          items.SaleClass = item.SaleClass , // 销售分类ID
          items.Unit = item.Unit, // 计算单位ID
          items.Num = $scope.supplyinfo[index].num, //数量
          items.Price = item.Price//买货单价
        $scope.details.push(items)
      })
      //提交供货计划
      $scope.datas = {
        SPNo: "",//供货计划单号
        BONo: $rootScope.deliverDetails.No,//买货单号
        ToUser: $rootScope.deliverDetails.FromUser,//买货单(买货)账号（待供货接口获取）
        FromUser: localStorage.getItem("usertoken"),//供货人账号
        FromAddr: $scope.addrliststatus[0].id,//发货地址ID
        ToAddr: $scope.toAddraddrliststatus[0].id,//收货地址ID
        TradeType: 0,//0-物流配送1-送货上门3-上门回收：TradeType
        Account: $scope.userbankliststatus[0].id,//收款账号ID
        Details: $scope.details// 供货明细
      };

      SearchOrderService.addSearchOrderSupplyPlan($scope.datas).success(function (data) {

        CommonService.showConfirm('', '<p>恭喜您！您的供货单提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', '')
      })

    }
  })
  //供货记录单列表
  .controller('SupplyOrderListCtrl', function ($scope, $rootScope, CommonService, SearchOrderService) {
    $scope.supplylist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getSupplyPlanList = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.supplylist = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: '',//订单号，模糊匹配
        User: '',//下单人账号
        Status: '',//订单状态0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
        BONo: '',//关联买货单号
        ToUser: '',//关联买货单人
        SPNo: ''//供货计划单
      };
      //查单(供货订单)获取供货单列表
      SearchOrderService.getSupplyPlan($scope.params).success(function (data) {
        if (data.Values == null) {
          CommonService.platformPrompt('暂无供货记录', '');
          return
        }
        angular.forEach(data.Values.data_list, function (item) {
          $scope.supplylist.push(item);
        })
        $scope.total = data.Values.page_count;
        //订单状态(供货单)
        $rootScope.supplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }

    $scope.getSupplyPlanList();

  })
  //供货单详情
  .controller('SupplyOrderDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.deliverDetails = JSON.parse($stateParams.item);//用于发货数据传递
    $rootScope.supplyDetails = JSON.parse($stateParams.item);
    CommonService.ionicPopover($scope, 'my-order.html');
    //订单号
    $rootScope.orderId = $rootScope.supplyDetails.No;
    //订单类型
    $rootScope.OrdeType = $rootScope.supplyDetails.OrdeType || 2;//订单类型 1卖货单2供货单
    //评价订单类型
    $rootScope.orderType = 3;//订单类型1-卖货单2-买货单3-供货单
    //被评价人的ID
    $rootScope.evaluateFromUser = $rootScope.deliverDetails.FromUser;
    //订单状态
    $rootScope.orderStatus = $rootScope.deliverDetails.Status;
  })
  // 查单卖货审核验货单列表
  .controller('ExamineGoodsOrderCtrl', function ($scope, $rootScope, CommonService, SearchOrderService, DeliverService) {

    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 5,//编码 ,等于空时取所有
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      OrderNo: $rootScope.orderId,//卖货单号
      AddUser: '',//添加人
      Status: '',//1-待审核/验货完成2-已审核
      YhUser: ''//验货人
    }
    SearchOrderService.getYanhuoList($scope.params).success(function (data) {
      $scope.yanhuolist = data.Values.data_list;
      $scope.yanhuolistDetails = [];
      angular.forEach($scope.yanhuolist, function (item) {
        angular.forEach(item.Details, function (items) {
          items.checked = false;
          $scope.yanhuolistDetails.push(items)
        })
      })

    })
    //查询卖货验货扣款记录分页列
    $scope.sellquejianList = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getPageSQueJian = function () {
      $scope.page++;
      $scope.quejianparams = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//编码 ,等于空时取所有
        ID: '',//编码 ,等于空时取所有
        No: '',//订单号，模糊匹配
        User: ''//添加人的值
      }

      DeliverService.getPageSQueJian($scope.quejianparams).success(function (data) {
        console.log(data);
        angular.forEach(data.Values.data_list, function (item) {
          $scope.sellquejianList.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getPageSQueJian();
    //检查是否复选框选中
    $scope.checkChecded = function () {
      $scope.ischecked = false;
      angular.forEach($scope.yanhuolistDetails, function (item) {
        if (item.checked) {
          $scope.ischecked = true;
        }
      })
    }
    //数据组织复用方法
    $scope.datareuse = function () {
      $scope.details = [];
      $scope.detailsmore = [];//更多字段的信息
      $scope.IDList = [];//已选明细编号数组：ID
      $scope.isAllUpdate = true;
      angular.forEach($scope.yanhuolistDetails, function (item) {
        var items = {};//提交卖货交易信息明细json数据
        if (item.checked && item.Status == 0) {  //选择选中的  明细不是默认值后下次就不能修改状态了 如一条明细是退货了，就不能改成成交了
          items.ProdID = item.ProdID, // 产品编号
            items.ProdName = item.ProdName , // 产品名称
            items.SaleClass = item.SaleClass , // 销售分类ID
            items.Unit = item.Unit, // 计算单位ID
            items.Num = item.Num, //数量
            items.Price = item.Price//买货单价
          $scope.details.push(items);
          $scope.detailsmore.push(item);
          $scope.IDList.push(item.ID)
        } else if (!item.checked && item.Status == 0) {
          $scope.isAllUpdate = false;
        }

      })

      /*  走卖货时：收货人是之前的卖货人，退货人录供货人
       走供货时：收货人是之前的供货人，退货人录买货人 走卖货时，卖货人要操作这个单的下单，发货，审核验货，退货，取消订单，供商人要操作这个单的签收，验货;
       走供货时，供货人要操作这个单的下单，发货，审核验货，退货，取消订单，买货人要操作这个单的签收，验货;
       卖货人是中小型回收商，供货人是中大型回收商（可以理解为黄牛或中间商一样的角色），买家以拆解企业为主*/
      $scope.datas = {
        FromUser: localStorage.getItem("usertoken"),//卖货人
        ToUser: $scope.yanhuolist[0].AddUser,//收货人
        RelateNo: $scope.yanhuolist[0].OrderNo,//关联单号 取的验货单列表里的OrderNo字段，而不是No字段
        Details: $scope.details
      }

    }

    //复用修改订单状态的函数集合
    $scope.funcreuse = function (status) {
      //查单(卖货订单)修改卖货验货明细产品状态
      $scope.paramsdetails = {
        IDList: $scope.IDList.join(','),//编号，多个用,隔开
        Status: status,//订单状态0-待确认1-已退货2-暂存3-已成交
        YhUser: localStorage.getItem("usertoken"),//会员账号 验货人
      }

      //这个明细不是默认值后下次就不能修改状态了 如一条明细是退货了，就不能改成成交了
      SearchOrderService.updateStatusSaleDetails($scope.paramsdetails).success(function (data) {
        console.log(data);
      }).then(function () {

        if ($scope.isAllUpdate) {//明细都执行完了再改主表状态 要查看明细的那个状态是不是默认状态，只有全部不是默认状态时，才会执行9.4，9.2的接口 因为可能是我今天只审核了一条明细，第二天再审核一条明细
          //查单(卖货订单)修改卖货验货状态
          $scope.yanhuoparams = {
            No: $scope.yanhuolist[0].No,//订单号
            Status: 2,//订单状态0-验货中1-待审核/验货完成2-已审核
            YhUser: localStorage.getItem("usertoken"),//会员账号 验货人
          }

          SearchOrderService.updateSaleOrderYanhuoStatus($scope.yanhuoparams).success(function (data) {
            console.log(data);
          })

          //查单(卖货订单)修改卖货/供货订单状态
          $scope.supplyparams = {
            No: $scope.yanhuolist[0].No,//订单号
            Status: 5,//状态值(-1取消订单 0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款)
            User: $scope.yanhuolist[0].AddUser,//下单人账号
            OrderType: 1,//1代表卖货单2代表供货单

          }
          SearchOrderService.updateSaleOrderStatus($scope.supplyparams).success(function (data) {
            console.log(data);
          })
        }
      })
    }
    //确认交易
    $scope.examinegoodsordersubmit = function () {
      //查单(卖货订单)提交卖货交易信息
      $scope.datareuse();
      if ($scope.IDList.length == 0) {//没有满足条件详细数据
        CommonService.platformPrompt('订单都已经修改状态');
        return;
      }
      SearchOrderService.addSaleTrade($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', '')
      }).then(function () {
        $scope.funcreuse(3)
      })
    }


    //审核验货单退货
    $scope.salesreturn = function () {
      //查单(卖货订单)提交退货信息
      $scope.datareuse();
      $scope.datas.ordertype = 1;//退货类别 1卖货验货 2供货验货
      if ($scope.IDList.length == 0) {//没有满足条件详细数据
        CommonService.platformPrompt('订单都已经修改状态');
        return;
      }
      SearchOrderService.addReturn($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', '')
      }).then(function () {
        $scope.funcreuse(1)
      })
    }
  })

  // 查单供货计划审核验货单列表
  .controller('SupplyExamineOrderCtrl', function ($scope, $rootScope, CommonService, SearchOrderService) {

    $scope.params = {
      currentPage: 1,//当前页码
      pageSize: 5,//编码 ,等于空时取所有
      ID: '',//编码 ,等于空时取所有
      No: '',//订单号，模糊匹配
      OrderNo: $rootScope.orderId,//卖货单号
      AddUser: '',//添加人
      Status: '',//1-待审核/验货完成2-已审核
      YhUser: ''//验货人
    }
    //查单(供货订单)获取供货验货单列表
    SearchOrderService.getSupplyPlanYanhuoList($scope.params).success(function (data) {
      $scope.yanhuolist = data.Values.data_list;
      $scope.yanhuolistDetails = [];
      angular.forEach($scope.yanhuolist, function (item) {
        angular.forEach(item.Details, function (items) {
          items.checked = false;
          $scope.yanhuolistDetails.push(items)
        })
      })

    })
    //查询供货验货扣款记录分页列
    $scope.supplyquejianList = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getPageBQueJian = function () {
      $scope.page++;
      $scope.quejianparams = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//编码 ,等于空时取所有
        ID: '',//编码 ,等于空时取所有
        No: '',//订单号，模糊匹配
        User: ''//添加人的值
      }

      DeliverService.getPageBQueJian($scope.quejianparams).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.supplyquejianList.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getPageBQueJian();
    //检查是否复选框选中
    $scope.checkChecded = function () {
      $scope.ischecked = false;
      angular.forEach($scope.yanhuolistDetails, function (item) {
        if (item.checked) {
          $scope.ischecked = true;
        }
      })
    }
    //数据组织复用方法
    $scope.datareuse = function () {
      $scope.details = [];
      $scope.detailsmore = [];//更多字段的信息
      $scope.IDList = [];//已选明细编号数组：ID
      $scope.isAllUpdate = true;
      angular.forEach($scope.yanhuolistDetails, function (item) {
        var items = {};//提交供货交易信息明细json数据
        if (item.checked && item.Status == 0) {  //选择选中的  明细不是默认值后下次就不能修改状态了 如一条明细是退货了，就不能改成成交了
          items.ProdID = item.ProdID, // 产品编号
            items.ProdName = item.ProdName , // 产品名称
            items.SaleClass = item.SaleClass , // 销售分类ID
            items.Unit = item.Unit, // 计算单位ID
            items.Num = item.Num, //数量
            items.Price = item.Price//买货单价
          $scope.details.push(items);
          $scope.detailsmore.push(item);
          $scope.IDList.push(item.ID);
        } else if (!item.checked && item.Status == 0) {
          $scope.isAllUpdate = false;
        }

      })

      /*  走卖货时：收货人是之前的卖货人，退货人录供货人
       走供货时：收货人是之前的供货人，退货人录买货人 走卖货时，卖货人要操作这个单的下单，发货，审核验货，退货，取消订单，供商人要操作这个单的签收，验货;
       走供货时，供货人要操作这个单的下单，发货，审核验货，退货，取消订单，买货人要操作这个单的签收，验货;
       卖货人是中小型回收商，供货人是中大型回收商（可以理解为黄牛或中间商一样的角色），买家以拆解企业为主*/
      $scope.datas = {
        FromUser: localStorage.getItem("usertoken"),//卖货人
        ToUser: $scope.yanhuolist[0].AddUser,//收货人
        RelateNo: $scope.yanhuolist[0].OrderNo,//关联单号 取的验货单列表里的OrderNo字段，而不是No字段
        Details: $scope.details
      }

    }

    //复用修改订单状态的函数集合
    $scope.funcreuse = function (status) {
      //查单(供货订单)修改供货验货明细产品状态
      $scope.paramsdetails = {
        IDList: $scope.IDList.join(','),//编号，多个用,隔开
        Status: status,//订单状态0-待确认1-已退货2-暂存3-已成交
        YhUser: localStorage.getItem("usertoken"),//会员账号 验货人
      }

      //这个明细不是默认值后下次就不能修改状态了 如一条明细是退货了，就不能改成成交了
      SearchOrderService.updateSupplyYanhuoDetailsStatus($scope.paramsdetails).success(function (data) {
        console.log(data);
      }).then(function () {

        if ($scope.isAllUpdate) {//明细都执行完了再改主表状态 要查看明细的那个状态是不是默认状态，只有全部不是默认状态时，才会执行9.4，9.2的接口 因为可能是我今天只审核了一条明细，第二天再审核一条明细
          //查单(供货订单)修改供货验货状态
          $scope.yanhuoparams = {
            No: $scope.yanhuolist[0].No,//订单号
            Status: 2,//订单状态0-验货中1-待审核/验货完成2-已审核
            YhUser: localStorage.getItem("usertoken"),//会员账号 验货人
          }

          SearchOrderService.updateSupplyYanhuoStatus($scope.yanhuoparams).success(function (data) {
            console.log(data);
          })

          //查单(供货订单)修改供货计划状态
          $scope.supplyparams = {
            No: $scope.yanhuolist[0].No,//订单号
            Status: 5,//状态值(-1取消订单 0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款)
            User: $scope.yanhuolist[0].AddUser,//下单人账号
            OrderType: 2,//1代表卖货单2代表供货单

          }
          SearchOrderService.updateSupplyPlanStatus($scope.supplyparams).success(function (data) {
            console.log(data);
          })
        }
      })
    }
    //确认交易
    $scope.examinegoodsordersubmit = function () {
      //查单(供货订单)提交供货交易信息
      $scope.datareuse();
      if ($scope.IDList.length == 0) {//没有满足条件详细数据
        CommonService.platformPrompt('订单都已经修改状态');
        return;
      }
      SearchOrderService.addSupTrade($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', '')
      }).then(function () {
        $scope.funcreuse(3)
      })
    }


    //审核验货单退货
    $scope.salesreturn = function () {
      //查单(卖货订单)提交退货信息
      $scope.datareuse();
      $scope.datas.ordertype = 2;//退货类别 1卖货验货 2供货验货
      if ($scope.IDList.length == 0) {//没有满足条件详细数据
        CommonService.platformPrompt('订单都已经修改状态');
        return;
      }
      SearchOrderService.addReturn($scope.datas).success(function (data) {
        CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', '')
      }).then(function () {
        $scope.funcreuse(1)
      })
    }
  })
  //查单收货单详情
  .controller('DeiverOrderDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    CommonService.ionicPopover($scope, 'my-payorder.html');
    $rootScope.collectGoodDetails = JSON.parse($stateParams.item);
    //订单号
    $rootScope.orderId = $rootScope.collectGoodDetails.No;
    //订单类型
    $rootScope.OrdeType = $rootScope.collectGoodDetails.OrdeType;//订单类型 1卖货单2供货单
    //评价订单类型
    $rootScope.orderType = 2;//订单类型1-卖货单2-买货单3-供货单
    //被评价人的ID
    $rootScope.evaluateFromUser = $rootScope.collectGoodDetails.FromUser;
    //订单状态
    $rootScope.orderStatus = $rootScope.collectGoodDetails.Status;

  })
  //发货详情页面
  .controller('DeiverDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService, SearchOrderService) {
    //查单 获取发货信息列表及详情
    $scope.deiverList = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getPageFaHuo = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.deiverList = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//条数
        ID: '',//编码 ,等于空时取所有
        No: $rootScope.orderId,//订单号，模糊匹配
        OrderType: $rootScope.OrdeType,//类型 1卖货单2供货单
        AddUser: ''//添加人
      }
      SearchOrderService.getPageFaHuo($scope.params).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.deiverList.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }

    $scope.getPageFaHuo();
    $scope.bigImage = false;    //初始默认大图是隐藏的
    $scope.hideBigImage = function () {
      $scope.bigImage = false;
    };
    //点击图片放大
    $scope.shouBigImage = function (imageName) {  //传递一个参数（图片的URl）
      $scope.Url = imageName;                   //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
      $scope.bigImage = true;                   //显示大图
    };
  })
  //签收详情页面
  .controller('SigninDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService, SearchOrderService) {
    //查单 获取签收信息列表及详情
    $scope.signList = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getPageSign = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.signList = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//条数
        ID: '',//编码 ,等于空时取所有
        No: $rootScope.orderId,//订单号，模糊匹配
        OrderType: $rootScope.OrdeType,//类型 1卖货单2供货单
        AddUser: ''//添加人
      }
      SearchOrderService.getPageSign($scope.params).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.signList.push(item);
        })

        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }

    $scope.getPageSign();
    $scope.bigImage = false;    //初始默认大图是隐藏的
    $scope.hideBigImage = function () {
      $scope.bigImage = false;
    };
    //点击图片放大
    $scope.shouBigImage = function (imageName) {  //传递一个参数（图片的URl）
      $scope.Url = imageName;                   //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
      $scope.bigImage = true;                   //显示大图
    };
  })
  //添加评论页面
  .controller('EvaluateCtrl', function ($scope, $rootScope, $stateParams, CommonService, SearchOrderService, AccountService) {
    $scope.evaluateinfo = {};//评论信息
    $scope.evaluateinfo.star = [];//评分数组
    $scope.evaluatestar = function (index, stars) {
      $scope.evaluateinfo.star[index] = stars;
    };
    //获取用户信息
    AccountService.getUserInfo($rootScope.evaluateFromUser).success(function (data) {
      $scope.evaluateuserinfo = data.Values;
    })

    //查单 获取评论属性
    $scope.params = {
      id: '',//编码 ,等于空时取所有
      Group: 1,//所属分组，等于空时取所有
      IsValid: 1,//是否有效 (1:有效0:无效)
      IsShow: 1//是否显示 1:显示0:不显示
    }
    SearchOrderService.getEvaluate($scope.params).success(function (data) {
      $scope.evaluatelist = data.Values;
    })
    //提交评论
    $scope.submitevalute = function () {
      $scope.EIIDList = [];//评价属性ID数组
      $scope.EINameList = [];//评价名称数组
      angular.forEach($scope.evaluatelist, function (item, index) {
        $scope.EIIDList.push(item.ID);
        $scope.EINameList.push(item.Name)
      })
      //查单 添加评价
      $scope.datas = {
        OrderId: $rootScope.orderId,//订单号
        OrderType: $rootScope.orderType,//订单类型1-卖货单2-买货单3-供货单
        EIID: $scope.EIIDList.join(','),//评价属性ID（多个用逗号隔开）
        EIName: $scope.EINameList.join(','),//评价名称（多个用逗号隔开）
        Score: $scope.evaluateinfo.star.join(','),//评价分值（多个用逗号隔开）
        Memo: $scope.evaluateinfo.Memo//备注说明
      }

      SearchOrderService.addEvaluate($scope.datas).success(function (data) {
        CommonService.platformPrompt('恭喜您！评价成功！');
      }).then(function () {
        //查单(卖货订单)修改卖货/供货订单状态
        $scope.params = {
          No: $rootScope.orderId,//订单号
          Status: 10,//状态值
          User: $rootScope.evaluateFromUser,//下单人账号
          OrderType: $rootScope.orderType == 1 ? 1 : 2,//1代表卖货单2代表供货单
        }
        if ($rootScope.orderType == 1) {
          //查单(卖货订单)修改卖货/供货订单状态
          SearchOrderService.updateSaleOrderStatus($scope.params).success(function (data) {
            console.log(data);
          })
        } else if ($rootScope.orderType == 3) {
          //查单(供货订单)修改供货计划状态
          SearchOrderService.updateSupplyPlanStatus($scope.params).success(function (data) {
            console.log(data);
          })
        }
      })

    }
  })
  //通知消息列表
  .controller('NewsCtrl', function ($scope, $rootScope, $state, CommonService, NewsService) {
    $scope.newsList = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.newslist = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.newsList = [];
      }
      $scope.page++;
      $scope.params = {
        page: $scope.page,//页码
        size: 5,//条数
        userid: localStorage.getItem("usertoken")//用户id
      }
      NewsService.getNewsList($scope.params).success(function (data) {
        if (data.Values == null) {
          CommonService.platformPrompt('暂无消息', '');
          return
        }
        angular.forEach(data.Values.data_list, function (item) {
          $scope.newsList.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }

    $scope.newslist();
    $scope.updateNewsLook = function (look, id) { //设置已读未读
      $scope.lookparams = {
        look: look,//页码
        ids: id
      }

      NewsService.updateNewsLook($scope.lookparams).success(function (data) {
        $scope.newslist(0);
      })
    }
  })
  //发货列表
  .controller('DeliverListCtrl', function ($scope, $state, $rootScope, CommonService, DeliverService) {
    //是否登录
    if (!CommonService.isLogin()) {
      return;
    }
    $scope.deliverlist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getSaleSupply = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.deliverlist = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: '',//订单号，模糊匹配
        User: '',//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
        FromUser: localStorage.getItem("usertoken"),//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
        Status: 2,//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
        ordertype: '',//类型 1卖货单2供货单
        Type: '' //0-物流配送1-送货上门2-上门回收
      };
      DeliverService.getSaleSupply($scope.params).success(function (data) {
        if (data.Values == null) {
          CommonService.platformPrompt('暂无订单信息', '');
          return
        }
        angular.forEach(data.Values.data_list, function (item) {
          $scope.deliverlist.push(item);
        })
        $scope.total = data.Values.page_count;
        //订单状态(卖货单)
        $rootScope.sellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
        //订单状态(供货单)
        $rootScope.supplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getSaleSupply();
  })
  //发货详情
  .controller('DeliverDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.deliverDetails = JSON.parse($stateParams.item);
    CommonService.ionicPopover($scope, 'my-order.html');
    //订单号
    $rootScope.orderId = $rootScope.deliverDetails.No;
    //订单类型
    $rootScope.OrdeType = $rootScope.deliverDetails.OrdeType;//订单类型 1卖货单2供货单
    //评价订单类型
    $rootScope.orderType = $rootScope.deliverDetails.OrdeType == 1 ? 1 : 3;//订单类型1-卖货单2-买货单3-供货单
    //被评价人的ID
    $rootScope.evaluateFromUser = $rootScope.deliverDetails.FromUser

  })
  //添加发货清单
  .controller('AddDeliverListCtrl', function ($scope, $rootScope, $stateParams, CommonService, MainService, DeliverService) {

    CommonService.searchModal($scope, 'templates/delivergoods/delivergoodsmodel.html');
    $scope.adddeliverinfo = {};//扣款信息
    $scope.adddeliverinfo.isAdd = [];
    $scope.adddeliverinfo.isMinus = [];
    $scope.adddeliverinfo.num = [];//填写数量
    $scope.adddeliverinfo.selectnum = 0;//选中数量
    //获取产品类别列表
    $scope.getGoodTypeList = function () {

      //发货 签收 验货  获取产品类别
      $scope.params = {
        IDList: '',//产品类别ID，多个用,隔开
        Name: '',//产品类别名称
        PIDList: '',//产品ID，多个用,隔开
        Node: '',//供货验货订单号
        SYNode: '',//卖货验货订单号
        SNode: $rootScope.deliverDetails.No,//发货单号
        BNode: ''//买货单号
      }
      DeliverService.getGoodTypeList($scope.params).success(function (data) {
        $scope.goodTypeList = data.Values;
        $scope.goodTypeList.push({'GID': 'other', 'GName': '其它品类'});
      }).then(function () {
        $scope.params.SNode = '';//全部数据
        DeliverService.getGoodTypeList($scope.params).success(function (data) {
          $rootScope.goodTypeListAll = data.Values;
        })
      })
    }
    $scope.getGoodTypeList();

    //发货的时候，就要取非统货IsTH:0的数据，再根据下单里面之前的GrpIDList值获取到   (卖货单，买货单，供货单，供货计划单IsTH:1)
    $scope.adddeliverList = [];
    $scope.currentPage = 0;
    $scope.total = 1;
    $scope.addDeliverProduct = function (GrpIDList) {

      if (GrpIDList == 'other') {//是否是其他类别
        $scope.isotherproduct = true;
      } else {
        $scope.isotherproduct = false;
      }

      if (arguments.length != 0) {
        $scope.currentPage = 0;
        $scope.adddeliverList = [];
      }
      $scope.currentPage++;
      $scope.restProdsParams = {
        currentPage: $scope.currentPage,
        pageSize: 10
      }

      $scope.ProdsParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: !$scope.isotherproduct ? (GrpIDList || '') : '',//产品类别ID，多个用，隔开
        IsTH: 0,//是否为统货 0否1是
        NoGrpIDList: $scope.isotherproduct ? (GrpIDList || '') : ''//其他类别
      }
      MainService.getProdsList($scope.restProdsParams, $scope.ProdsParams).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.adddeliverList.push(item);
        })

        angular.forEach($scope.adddeliverList, function (item, index) {
          $scope.adddeliverinfo.isAdd[index] = true;
          $scope.adddeliverinfo.isMinus[index] = false;
          angular.forEach($rootScope.selectproductandnum, function (items) {
            if (items.PID == item.PID) {
              $scope.adddeliverinfo.isAdd[index] = false;
              $scope.adddeliverinfo.isMinus[index] = true;
              $scope.adddeliverinfo.num[index] = items.num;
            } else {
              $scope.adddeliverinfo.num[index] = '';
            }
          })
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }


    //选择列表的产品类别
    $scope.selectGoodType = function (goodtypeid) {
      //发货的时候，就要取非统货IsTH:0的数据，再根据下单里面之前的GrpIDList值获取到   (卖货单，买货单，供货单，供货计划单IsTH:1)
      $scope.addDeliverProduct(goodtypeid);
    }
    //选中的产品以及发货的数量
    $scope.selectproduct = [];
    //添加缺件
    $scope.addQueJian = function (index, item) {
      $scope.adddeliverinfo.isAdd[index] = false;
      $scope.adddeliverinfo.isMinus[index] = true;
      $scope.adddeliverinfo.selectnum++;
      $scope.selectproduct.push(item);
    }
    //取消添加的缺件
    $scope.minusQueJian = function (index, item) {
      $scope.adddeliverinfo.isAdd[index] = true;
      $scope.adddeliverinfo.isMinus[index] = false;
      $scope.adddeliverinfo.selectnum--;
      $scope.selectproduct.splice($scope.selectproduct.indexOf(item), 1);
    }
    //添加产品
    $scope.addproduct = function (GID) {
      $scope.openModal();
      $scope.selectGID = GID;
      $scope.addDeliverProduct(GID);
    }
    //选好了方法
    $scope.selectaffirm = function () {
      $scope.selectedproduct();  //增加数量信息 重新组装数组
      //增加没有的商品类别
      $scope.selectproductandnumother = [];
      //已有有的商品类别
      $scope.hasselectproductandnum = [];
      angular.forEach($rootScope.selectproductandnum, function (item) {
        angular.forEach($scope.goodTypeList, function (items) {
          if (items.GID == item.GrpID) {
            $scope.hasselectproductandnum.push(item);
          }
        })
      })
      //求两个集合的差集
      if ($rootScope.selectproductandnum.length > $scope.hasselectproductandnum.length) {
        $scope.selectproductandnumother = CommonService.arrayMinus($rootScope.selectproductandnum, $scope.hasselectproductandnum);
      }
      $scope.closeModal();//关闭modal
    }
    //增加数量信息 重新组装数组
    $scope.selectedproduct = function () {
      $rootScope.selectproductandnum = [];//增加数量信息
      angular.forEach($scope.selectproduct, function (item) {
        item.num = $scope.adddeliverinfo.num[item.PID];
        $rootScope.selectproductandnum.push(item)
      })
    }

    //关闭modle清空数据
    $scope.closeModalClear = function () {
      $scope.closeModal();
      $rootScope.selectproductandnum = [];//清空数据
      $scope.selectproductandnumother = [];//清空数据
      $scope.selectproduct = [];
      $scope.adddeliverinfo.selectnum = 0;
    }
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
      if ($scope.addrliststatus.length == 0) {
        CommonService.platformPrompt('无法获取到收货人地址默认地址', '');
        return;
      }
    })


    //提交发货
    $scope.delivergoodssubmit = function () {
      CommonService.ionicLoadingShow();
      //提交发货详细数据
      $scope.details = [];
      var ordeType = $rootScope.deliverDetails.OrdeType;
      angular.forEach($rootScope.selectproductandnum, function (item) {
        var items = {};
        items.ProdID = item.PID;
        items.ProdName = item.PName;
        items.Unit = item.PUID;
        items.Num = item.num;
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
        items.SaleClass = item.PUSaleType;
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
        CommonService.showConfirm('', '<p>恭喜您！您的发货信息提交成功！</p><p>我们会尽快处理您的订单,请耐心等待</p>', '查看订单', '关闭', 'searchorder', 'deliverlist');
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }
  })
  //接单供货计划订单列表以及详情
  .controller('SupplyGoodCtrl', function ($scope, $state, $rootScope, CommonService, SupplyService) {
    //是否登录
    if (!CommonService.isLogin()) {
      return
    } else {
      //接单供货模块要先判断一下，此会员是不是供货商，非供货商没有权限供货的 根据这个接口判断grade级别是不是5（5代表供货商）
      if (JSON.parse(localStorage.getItem("user")).grade != 5) {
        CommonService.showConfirm('', '<p>非供货商没有权限供货</p><p>点击‘确定’去申请成为供货商</p>', '确定', '关闭', 'applyprovider', '');
      }
    }

    $scope.supplylist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.supplygoodList = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.supplylist = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: '',//订单号，模糊匹配
        User: '',//供货人账号 供货这里user可以为空 订单那里不能为空
        Type: '',//交易方式 0-物流配送1-送货上门2-上门回收
        Status: 4,//0-未审核1-审核未通过2-审核通过3-已支付定金4-已收到定金5-备货中 6-备货完成7-已结款8-已返定金9-已成交10-已评价
        Expiration: 1,//非过期时间 是否取非过期时间 1是 0否
        SurplusNum: 0 //表示剩余供货量大于0，如果剩余供货量0，就不需要供货了
      }
      //接单供货计划订单列表以及详情
      SupplyService.getToPage($scope.params).success(function (data) {
        if (data.Values == null) {
          CommonService.platformPrompt('暂无订单信息', '');
          return
        }
        angular.forEach(data.Values.data_list, function (item) {
          $scope.supplylist.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.supplygoodList();

    //获取当前经纬度
    CommonService.getLocation();
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
  .controller('ReleaseProcureCtrl', function ($scope, $rootScope, CommonService, MainService) {
    //是否登录
    if (!CommonService.isLogin()) {
      return;
    }
    //获取行情报价分页列表
    $rootScope.buyprodsList = [];
    $scope.currentPage = 0;
    $scope.total = 1;
    $scope.releaseProcure = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.currentPage = 0;
        $rootScope.buyprodsList = [];
      }
      $scope.currentPage++;
      $scope.restProdsParams = {
        currentPage: $scope.currentPage,
        pageSize: 10
      }
      $scope.ProdsParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: '',//产品类别ID，多个用，隔开
        IsTH: 1,//是否为统货 0否1是
        NoGrpIDList: ''//其他类别
      }
      MainService.getProdsList($scope.restProdsParams, $scope.ProdsParams).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          item.checked = false;
          $rootScope.buyprodsList.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.releaseProcure();


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
  //买货发布买货单数量
  .controller('ProcureDetailsNumCtrl', function ($scope, $state, $rootScope, CommonService) {
      $scope.buyDetails = [];
      $rootScope.itembuynum = [];//买货数量
      angular.forEach($rootScope.buyprodsList, function (item) {
        if (item.checked == true) {
          $scope.buyDetails.push(item);
        }
      })
      //验证数量
      $scope.checknumber = function (type, num) {
        if (type == 1 && num) {
          if (!CommonService.regularVerification(/^[1-9]\d*$/, num)) {
            CommonService.platformPrompt("数量单位只能输入正整数", 'close');
            return;
          }
        }
      }
    }
  )

  //买货发布买货单报价
  .controller('ProcureDetailsCtrl', function ($scope, $state, $rootScope, CommonService, BuyService, MainService) {

    $scope.buyDetails = [];
    angular.forEach($rootScope.buyprodsList, function (item) {
      if (item.checked == true && $rootScope.itembuynum[item.GrpID]) {//只显示在上一步录入的数量的统货类别
        $scope.buyDetails.push(item);
      }
    })


    $scope.isNotTHCurrentprods = [];
    //买货统货类下的非统货
    $scope.getProdsListIsNotTH = function (GrpIDList, index) {
      $scope.restIsNotTHParams = {
        currentPage: 1,
        pageSize: 1000
      }
      $scope.isNotTHParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: GrpIDList || '',//产品类别ID，多个用，隔开
        IsTH: 0,//是否为统货 0否1是
        NoGrpIDList: ''//其他类别
      }
      MainService.getProdsList($scope.restIsNotTHParams, $scope.isNotTHParams).success(function (data) {
        //产品类别下的非统货
        $scope.isNotTHCurrentprods[index] = data.Values.data_list;
      }).then(function () {
        $rootScope.itembuyprice = new Array();//买货非统货价格
        //先声明一维数组
        angular.forEach($scope.buyDetails, function (item, index) {
          $rootScope.itembuyprice[item.GrpID] = new Array(); //一维长度为
          angular.forEach($scope.isNotTHCurrentprods[index], function (items, indexs) {
            $rootScope.itembuyprice[item.GrpID][indexs] = []; //二维长度为
          })
        })
      })

    }

    angular.forEach($scope.buyDetails, function (item, index) {
      $scope.getProdsListIsNotTH(item.GrpID, index);
    })


    $rootScope.buygoodssubmit = function () {//提交买货订单

      //是否登录
      if (!CommonService.isLogin()) {
        return;
      }

      $scope.Details = [];//收货明细数据数组
      angular.forEach($scope.buyDetails, function (buyDetailsitem, indexs) {
        angular.forEach($scope.isNotTHCurrentprods[indexs], function (item, index) {
          if ($rootScope.itembuyprice[item.GrpID][index].length != 0) {
            var items = {};//收货明细json数据
            items.ProdID = item.PID;//产品编号
            items.ProdName = item.PName;//产品名称
            items.Unit = item.PUID;//计算单位ID
            items.Num = $rootScope.itembuynum[item.GrpID];//输入数量
            items.Price = $rootScope.itembuyprice[item.GrpID][index];//买货价格
            items.SaleClass = item.PUSaleType;//销售分类ID
            $scope.Details.push(items)
          }

        })

      })
      //提交买货订单数据
      $scope.buyDatas = {
        FromUser: localStorage.getItem('usertoken'),//下单人
        TradeType: 0,//交易方式 0-物流配送1-送货上门2-上门回收
        AddrID: $rootScope.addrlistFirst.id,//收货地址ID
        Cycle: $rootScope.buyCycle.day || 0,//供货周期（天） 0-无限期：Cycle
        Details: $scope.Details//收货明细
      }
      BuyService.addBuyOrderDetails($scope.buyDatas).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！您的买货单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'searchorder')
      })


    }

  })
  //收货地址选择提交买货单
  .controller('ReleaseProcureOrderCtrl', function ($scope, $state, $rootScope, CommonService, AccountService) {
    CommonService.ionicLoadingShow();
    $rootScope.buyCycle = {}; //供货周期（天） 0-无限期：Cycle
    $scope.params = {
      page: 1,
      size: 10,
      userid: localStorage.getItem("usertoken")
    }
    //获取用户常用地址
    AccountService.getAddrlist($scope.params).success(function (data) {
      $rootScope.addrlist = data.Values.data_list;
      $rootScope.addrlistFirst = data.Values.data_list[0];
      if ($scope.addrlist.length == 0) {
        CommonService.platformPrompt('请先添加一个默认地址', 'adddealaddress');
        $state.go('adddealaddress');
        return;
      }
    }).finally(function () {
      CommonService.ionicLoadingHide()
    })


  })
  .controller('BuyGoodCtrl', function ($scope, $rootScope, CommonService) {
    CommonService.searchModal($scope, 'templates/search.html');

  })
  .controller('SellGoodCtrl', function ($scope, $rootScope, $state, CommonService) {
    $scope.supplierList = $rootScope.supplierList;
    $scope.selectSupplier = function (item) {
      $rootScope.supplierListFirst = item;
      $state.go("selldetails");
    }
    CommonService.searchModal($scope, 'templates/search.html');

  })
  //卖货下单
  .controller('SellDetailsCtrl', function ($scope, $rootScope, $state, CommonService, SellService, AccountService) {
      CommonService.ionicLoadingShow();

      $scope.sellDetails = [];
      angular.forEach($rootScope.sellprodsList, function (item) {
        if (item.checked == true) {
          $scope.sellDetails.push(item);
        }
      })

      //根据经纬度获取最近N个供货商
      $rootScope.supplierList = [];
      $rootScope.pagesupplierList = 0;
      $rootScope.totalsupplierList = 1;
      $rootScope.getListLongAndLatSupplier = function () {
        if (arguments != [] && arguments[0] == 0) {
          $rootScope.pagesupplierList = 0;
          $rootScope.supplierList = [];
        }
        $rootScope.pagesupplierList++;

        $scope.supplierListParams = {
          currentPage: $rootScope.pagesupplierList,
          pageSize: 5,
          Longitude: localStorage.getItem("longitude") || 114.0557100,//当前经度
          Latitude: localStorage.getItem("latitude") || 22.5224500,//当前纬度
          buff: 1000  //取最远多少距离KG的距离
        }

        SellService.getListLongAndLat($scope.supplierListParams).success(function (data) {
          if (data.Values == null) {
            CommonService.platformPrompt('暂无附近供货商信息', '');
            return;
          }
          angular.forEach(data.Values.data_list, function (item) {
            $rootScope.supplierList.push(item);
          })

          $rootScope.supplierListFirst = $rootScope.supplierList[0];
          $rootScope.totalsupplierList = data.Values.page_count;

        }).finally(function () {
          CommonService.ionicLoadingHide();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');

        })
      }
      $rootScope.getListLongAndLatSupplier();
      //验证数量
      $scope.checknumber = function (type, num) {
        if (type == 1) {
          if (!CommonService.regularVerification(/^[1-9]\d*$/, num)) {
            CommonService.platformPrompt("数量单位只能输入正整数", 'close');
            return;
          }
        }
      }

      $scope.itemnum = [];//卖货数量
      $scope.sellgoodssubmit = function () {//提交卖货订单
        //是否登录
        if (!CommonService.isLogin()) {
          return;
        }
        //是否有供货商信息
        if (!$rootScope.supplierListFirst) {
          CommonService.platformPrompt('没有匹配的供货商信息', 'selldetails');
          return;
        }
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
          if ($scope.addrliststatus.length == 0) {
            CommonService.ionicLoadingHide();
            CommonService.platformPrompt('请先添加一个默认地址', 'adddealaddress')
            $state.go('adddealaddress');
            return;
          }
        }).then(function () {
          //查询用户银行信息
          AccountService.getUserBanklist($scope.params).success(function (data) {
            $scope.userbankliststatus = [];
            angular.forEach(data.Values.data_list, function (item) {
              if (item.isdefault == 1) {
                $scope.userbankliststatus.push(item);
              }
            })
            if ($scope.userbankliststatus.length == 0) {
              CommonService.ionicLoadingHide();
              CommonService.platformPrompt('请先添加一个默认银行账户', 'addbankaccount')
              $state.go('addbankaccount');
              return;
            }
          }).then(function () {
            //提交卖货订单数据
            $scope.sellDatas = {
              FromUser: localStorage.getItem('usertoken'),//供货商账号
              ToUser: $rootScope.supplierListFirst.LogID,//回收商账号
              TradeType: 0,//交易方式 0-物流配送1-送货上门2-上门回收
              FromAddr: $scope.addrliststatus[0].id,//发货地址ID
              ToAddr: $rootScope.supplierListFirst.AddrID,//收货地址ID
              Account: $scope.userbankliststatus[0].id,//收款账号ID
              Details: $scope.Details//收货明细
            }
            SellService.addOrderDetails($scope.sellDatas).success(function (data) {
              CommonService.showConfirm('', '<p>恭喜您！您的卖货单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'searchorder', '')
            }).finally(function () {
              CommonService.ionicLoadingHide();
            })
          })
        })

      }

    }
  )
  //查单卖货详情
  .controller('SellOrderDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.deliverDetails = JSON.parse($stateParams.item);
    console.log($rootScope.deliverDetails);
    CommonService.ionicPopover($scope, 'my-order.html');
    //订单号
    $rootScope.orderId = $rootScope.deliverDetails.No;
    //订单类型
    $rootScope.OrdeType = $rootScope.deliverDetails.OrdeType;//订单类型 1卖货单2供货单
    //评价订单类型
    $rootScope.orderType = 1;//订单类型1-卖货单2-买货单3-供货单
    //被评价人的ID
    $rootScope.evaluateFromUser = $rootScope.deliverDetails.FromUser;
    //订单状态
    $rootScope.orderStatus = $rootScope.deliverDetails.Status;
  })
  //我要卖货
  .controller('SellProcureCtrl', function ($scope, $rootScope, CommonService, MainService) {
    //是否登录
    if (!CommonService.isLogin()) {
      return;
    }
    //获取行情报价分页列表
    $rootScope.sellprodsList = [];
    $scope.currentPage = 0;
    $scope.total = 1;
    $scope.sellProcure = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.currentPage = 0;
        $rootScope.sellprodsList = [];
      }
      $scope.currentPage++;
      $scope.restProdsParams = {
        currentPage: $scope.currentPage,
        pageSize: 10
      }
      $scope.ProdsParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: '',//产品类别ID，多个用，隔开
        IsTH: 1,//是否为统货 0否1是
        NoGrpIDList: ''//其他类别
      }
      MainService.getProdsList($scope.restProdsParams, $scope.ProdsParams).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          item.checked = false;
          $rootScope.sellprodsList.push(item);
        })

        $scope.total = data.Values.page_count;

      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.sellProcure();


    //检查是否复选框选中
    $scope.checkChecded = function () {
      $scope.ischecked = false;
      angular.forEach($scope.sellprodsList, function (item) {
        if (item.checked) {
          $scope.ischecked = true;
        }
      })
    }
    //获取当前经纬度
    CommonService.getLocation();
  })
  //验货列表
  .controller('CheckGoodCtrl', function ($scope, $state, $rootScope, CommonService, DeliverService) {
    //是否登录
    if (!CommonService.isLogin()) {
      return;
    }
    $scope.deliverlist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getSaleSupply = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.deliverlist = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: '',//订单号，模糊匹配
        User: localStorage.getItem("usertoken"),//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
        FromUser: '',//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
        Status: 4,//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
        ordertype: '',//类型 1卖货单2供货单
        Type: '' //0-物流配送1-送货上门2-上门回收
      };
      DeliverService.getSaleSupply($scope.params).success(function (data) {
        if (data.Values == null) {
          CommonService.platformPrompt('暂无订单信息', '');
          return;
        }
        angular.forEach(data.Values.data_list, function (item) {
          $scope.deliverlist.push(item);
        })
        $scope.total = data.Values.page_count;
        //订单状态(卖货单)
        $rootScope.sellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
        //订单状态(供货单)
        $rootScope.supplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getSaleSupply();

  })
  //验货列表详情
  .controller('CheckDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService) {
    $rootScope.checkDetails = JSON.parse($stateParams.item);

  })
  //添加扣款项
  .controller('AddCutPaymentCtrl', function ($scope, $rootScope, $stateParams, CommonService, DeliverService) {
    $scope.Imgs = [];//图片信息数组
    $scope.cutpaymentinfo = {};//扣款信息
    $scope.cutpaymentinfo.isAdd = [];
    $scope.cutpaymentinfo.isMinus = [];
    $scope.cutpaymentinfo.num = [];//填写数量
    $scope.cutpaymentinfo.money = [];//填写金额
    $scope.cutpaymentinfo.selectnum = 0;//选中数量
    CommonService.searchModal($scope, 'templates/checkgood/cutpaymentmodel.html')
    //获取产品类别列表
    $scope.getGoodTypeList = function () {
      //发货 签收 验货  获取产品类别
      $scope.params = {
        IDList: '',//产品类别ID，多个用,隔开
        Name: '',//产品类别名称
        PIDList: '',//产品ID，多个用,隔开
        Node: '',//供货验货订单号
        SYNode: '',//卖货验货订单号
        SNode: $rootScope.checkDetails.No,//发货单号
        BNode: ''//买货单号
      }
      DeliverService.getGoodTypeList($scope.params).success(function (data) {
        $scope.goodTypeList = data.Values;
        $scope.goodTypeList.push({'GID': 'other', 'GName': '其它品类'});
      }).then(function () {
        $scope.params.SNode = '';//全部数据
        DeliverService.getGoodTypeList($scope.params).success(function (data) {
          $scope.goodTypeListAll = data.Values;
        })
      })
    }
    $scope.getGoodTypeList();
    //选择扣款项列表的产品类别 查询缺件信息
    $scope.queJianList = [];
    $scope.currentPage = 0;
    $scope.total = 1;
    $scope.getQueJianList = function (goodtypeid) {
      if (arguments.length != 0) {
        $scope.currentPage = 0;
        $scope.queJianList = [];
      }
      $scope.currentPage++;
      //发货 签收 验货  查询缺件信息分页列
      $scope.paramsquejian = {
        currentPage: $scope.currentPage,//当前页码
        pageSize: 10,//每页条数
        ID: '',//编码 ,等于空时取所有
        Type: '',//所属类型0-产品类别1-产品2-销售分类
        TypeValue: goodtypeid || '',//类型所对应的值（产品类别ID）
        Name: ''//缺件属性名
      }
      DeliverService.getQueJianList($scope.paramsquejian).success(function (data) {

        angular.forEach(data.Values.data_list, function (item) {
          $scope.queJianList.push(item);
        })
        angular.forEach($scope.queJianList, function (item, index) {
          $scope.cutpaymentinfo.isAdd[index] = true;
          $scope.cutpaymentinfo.isMinus[index] = false;
          angular.forEach($rootScope.addcutpayment, function (items) {
            if (items.ID == item.ID) {
              $scope.cutpaymentinfo.isAdd[index] = false;
              $scope.cutpaymentinfo.isMinus[index] = true;
              $scope.cutpaymentinfo.num[index] = items.num;
              $scope.cutpaymentinfo.money[index] = items.money;
            } else {
              $scope.cutpaymentinfo.num[index] = '';
              $scope.cutpaymentinfo.money[index] = '';
            }
          })
        })
        $scope.total = data.Values.page_count;

      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    //选择列表的产品类别
    $scope.selectGoodType = function (goodtypeid) {
      //发货的时候，就要取非统货IsTH:0的数据，再根据下单里面之前的GrpIDList值获取到   (卖货单，买货单，供货单，供货计划单IsTH:1)
      $scope.getQueJianList(goodtypeid);
    }
    //选中的产品以及发货的数量和价格
    $scope.selectproduct = [];
    //添加缺件
    $scope.addQueJian = function (index, item) {
      $scope.cutpaymentinfo.isAdd[index] = false;
      $scope.cutpaymentinfo.isMinus[index] = true;
      $scope.cutpaymentinfo.selectnum++;
      $scope.selectproduct.push(item);
    }
    //取消添加的缺件
    $scope.minusQueJian = function (index, item) {
      $scope.cutpaymentinfo.isAdd[index] = true;
      $scope.cutpaymentinfo.isMinus[index] = false;
      $scope.cutpaymentinfo.selectnum--;
      $scope.selectproduct.splice($scope.selectproduct.indexOf(item), 1);
    }
    //添加扣款项
    $scope.addcutpaymentbtn = function (GID) {
      $scope.openModal();
      $scope.selectGID = GID;
      $scope.getQueJianList(GID);
    }
    //选好了方法
    $scope.selectaffirm = function () {
      $scope.selectedproduct();  //增加数量信息 重新组装数组
      $scope.closeModal();//关闭modal
    }
    //增加数量信息 重新组装数组
    $scope.selectedproduct = function () {
      $rootScope.addcutpayment = [];//增加数量信息
      $scope.cutpaymentinfo.totalmoney = 0;//扣款总金额
      angular.forEach($scope.selectproduct, function (item) {
        item.num = $scope.cutpaymentinfo.num[item.ID];
        item.money = $scope.cutpaymentinfo.money[item.ID];
        $rootScope.addcutpayment.push(item)
        $scope.cutpaymentinfo.totalmoney += item.money;
      })
    }

    //关闭modle清空数据
    $scope.closeModalClear = function () {
      $scope.closeModal();
      $rootScope.addcutpayment = [];//清空数据
      $scope.selectproduct = [];
      $scope.cutpaymentinfo.selectnum = 0;
      $scope.cutpaymentinfo.totalmoney = 0;//扣款总金额
    }
    //上传照片
    $scope.uploadActionSheet = function () {
      CommonService.uploadActionSheet($scope, 'Receipt');
    }
    //添加扣款项 提交  提交供货单
    $scope.submitCutPayMent = function () {
      CommonService.ionicLoadingShow();
      //提交验货详细数据
      $scope.addYanhuodetails = [];
      var ordeType = $rootScope.checkDetails.OrdeType;
      angular.forEach($rootScope.selectproductandnum, function (item) {
        var items = {};
        items.ProdID = item.PID;
        items.ProdName = item.PName;
        items.Unit = item.PUID;
        items.Num = item.num;
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
        items.SaleClass = item.PUSaleType;
        items.Status = 0;//服务器端默认已处理（卖货单）0-待确认1-已退货2-暂存3-已成交 （供货单）4-待确认5-已退货6-暂存7-已成交
        $scope.addYanhuodetails.push(items);
      })

      //提交验货数据
      $scope.addYanhuodatas = {
        AddUser: localStorage.getItem("usertoken"),//添加人账号 AddUser
        OrderType: ordeType,//类型 1卖货单2供货单
        OrderNo: $rootScope.checkDetails.No,//卖货单/供货单订单号
        Imgs: [{  //上传图片集合
          PicAddr: $scope.Imgs.PicAddr,
          PicDes: "拍照图库照片！"
        }],
        Details: $scope.addYanhuodetails //验货明细

      }

      DeliverService.addYanhuo($scope.addYanhuodatas).success(function (data) {
        console.log(data);
      }).then(function () {
        //提交卖货/供货验货扣款记录
        $scope.details = [];
        angular.forEach($rootScope.addcutpayment, function (item, index) {
          var items = {};
          items.User = localStorage.getItem("usertoken");//操作人
          items.QJID = item.ID;//缺件属性表编号
          items.QJName = item.Name;//缺件属性表名称
          items.QJTypeValue = item.TypeValue;//缺件属性类型所对应的值
          items.Num = item.num;//数量/重量
          items.Price = item.money;//扣款金额
          $scope.details.push(items);
        })
        $scope.datas = {
          OrderType: $rootScope.checkDetails.OrdeType,//订单类型1-卖货单2-供货出库单
          Node: $rootScope.checkDetails.No,//订单号
          Debit: $scope.cutpaymentinfo.totalmoney,//扣款总金额
          Details: $scope.details//卖货/供货验货扣款记录
        }

        DeliverService.addQJ($scope.datas).success(function (data) {
          console.log(data);
          CommonService.showAlert('', '<p>恭喜您！操作成功！</p><p>我们会尽快处理您的订单</p>', 'checkgood')
        })
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }
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
      CommonService.ionicLoadingShow();
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
        AddUser: localStorage.getItem("usertoken"),//添加人账号 AddUser
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
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }
  })
  //添加验货清单
  .controller('AddProductCtrl', function ($scope, $rootScope, $stateParams, CommonService, MainService, DeliverService) {
    CommonService.searchModal($scope, 'templates/checkgood/checkgoodsmodel.html');
    $scope.adddeliverinfo = {};//扣款信息
    $scope.adddeliverinfo.isAdd = [];
    $scope.adddeliverinfo.isMinus = [];
    $scope.adddeliverinfo.num = [];//填写数量
    $scope.adddeliverinfo.selectnum = 0;//选中数量
    //获取产品类别列表
    $scope.getGoodTypeList = function () {
      //发货 签收 验货  获取产品类别
      $scope.params = {
        IDList: '',//产品类别ID，多个用,隔开
        Name: '',//产品类别名称
        PIDList: '',//产品ID，多个用,隔开
        Node: '',//供货验货订单号
        SYNode: '',//卖货验货订单号
        SNode: $rootScope.checkDetails.No ? $rootScope.checkDetails.No : '',//发货单号
        BNode: $rootScope.orderId ? $rootScope.orderId : ''//买货单号
      }
      DeliverService.getGoodTypeList($scope.params).success(function (data) {
        $scope.goodTypeList = data.Values;
        $scope.goodTypeList.push({'GID': 'other', 'GName': '其它品类'});
      }).then(function () {
        $scope.params.SNode = '';//全部数据
        DeliverService.getGoodTypeList($scope.params).success(function (data) {
          $scope.goodTypeListAll = data.Values;
        })
      })
    }
    $scope.getGoodTypeList();

    //发货的时候，就要取非统货IsTH:0的数据，再根据下单里面之前的GrpIDList值获取到   (卖货单，买货单，供货单，供货计划单IsTH:1)
    $scope.adddeliverList = [];
    $scope.currentPage = 0;
    $scope.total = 1;
    $scope.addDeliverProduct = function (GrpIDList) {

      if (GrpIDList == 'other') {//是否是其他类别
        $scope.isotherproduct = true;
      } else {
        $scope.isotherproduct = false;
      }

      if (arguments.length != 0) {
        $scope.currentPage = 0;
        $scope.adddeliverList = [];
      }
      $scope.currentPage++;
      $scope.restProdsParams = {
        currentPage: $scope.currentPage,
        pageSize: 10
      }

      $scope.ProdsParams = {
        IDList: '',
        prodname: '',//产品类别名
        GrpIDList: !$scope.isotherproduct ? (GrpIDList || '') : '',//产品类别ID，多个用，隔开
        IsTH: 0,//是否为统货 0否1是
        NoGrpIDList: $scope.isotherproduct ? (GrpIDList || '') : ''//其他类别
      }
      MainService.getProdsList($scope.restProdsParams, $scope.ProdsParams).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.adddeliverList.push(item);
        })

        angular.forEach($scope.adddeliverList, function (item, index) {
          $scope.adddeliverinfo.isAdd[index] = true;
          $scope.adddeliverinfo.isMinus[index] = false;
          angular.forEach($rootScope.selectproductandnum, function (items) {

            if (items.PID == item.PID) {
              $scope.adddeliverinfo.isAdd[index] = false;
              $scope.adddeliverinfo.isMinus[index] = true;
              $scope.adddeliverinfo.num[index] = items.num;
            } else {
              $scope.adddeliverinfo.num[index] = '';
            }
          })
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }


    //选择列表的产品类别
    $scope.selectGoodType = function (goodtypeid) {
      //发货的时候，就要取非统货IsTH:0的数据，再根据下单里面之前的GrpIDList值获取到   (卖货单，买货单，供货单，供货计划单IsTH:1)
      $scope.addDeliverProduct(goodtypeid);
    }
    //选中的产品以及发货的数量
    $scope.selectproduct = [];
    //添加缺件
    $scope.addQueJian = function (index, item) {
      $scope.adddeliverinfo.isAdd[index] = false;
      $scope.adddeliverinfo.isMinus[index] = true;
      $scope.adddeliverinfo.selectnum++;
      $scope.selectproduct.push(item);
    }
    //取消添加的缺件
    $scope.minusQueJian = function (index, item) {
      $scope.adddeliverinfo.isAdd[index] = true;
      $scope.adddeliverinfo.isMinus[index] = false;
      $scope.adddeliverinfo.selectnum--;
      $scope.selectproduct.splice($scope.selectproduct.indexOf(item), 1);
    }
    //添加产品
    $scope.addproduct = function (GID) {
      $scope.openModal();
      $scope.selectGID = GID;
      $scope.addDeliverProduct(GID);
    }
    //选好了方法
    $scope.selectaffirm = function () {
      $scope.selectedproduct();  //增加数量信息 重新组装数组
      //增加没有的商品类别
      $scope.selectproductandnumother = [];
      //已有有的商品类别
      $scope.hasselectproductandnum = [];
      angular.forEach($rootScope.selectproductandnum, function (item) {
        angular.forEach($scope.goodTypeList, function (items) {
          if (items.GID == item.GrpID) {
            $scope.hasselectproductandnum.push(item);
          }
        })
      })
      //求两个集合的差集
      if ($rootScope.selectproductandnum.length > $scope.hasselectproductandnum.length) {
        $scope.selectproductandnumother = CommonService.arrayMinus($rootScope.selectproductandnum, $scope.hasselectproductandnum);
      }


      $scope.closeModal();//关闭modal
    }
    //增加数量信息 重新组装数组
    $scope.selectedproduct = function () {
      $rootScope.selectproductandnum = [];//增加数量信息
      angular.forEach($scope.selectproduct, function (item) {
        item.num = $scope.adddeliverinfo.num[item.PID];
        $rootScope.selectproductandnum.push(item)
      })

    }

    //关闭modle清空数据
    $scope.closeModalClear = function () {
      $scope.closeModal();
      $rootScope.selectproductandnum = [];//清空数据
      $scope.selectproductandnumother = [];//清空数据
      $scope.selectproduct = [];
      $scope.adddeliverinfo.selectnum = 0;
    }
  })
  //接单供货计划详情
  .controller('SupplyDetailsCtrl', function ($scope, $rootScope, CommonService, $stateParams, SupplyService) {
    $scope.supplyDetails = JSON.parse($stateParams.item);

    $scope.params = {
      longt: localStorage.getItem("longitude") || 114.0557100,//当前经度
      lat: localStorage.getItem("latitude") || 22.5224500,//当前纬度
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
  .controller('ReleaseSupplyCtrl', function ($scope, $state, $rootScope, CommonService, AccountService, SupplyService) {
    $scope.params = {
      page: 1,
      size: 10,
      userid: localStorage.getItem("usertoken")
    }
    //获取用户常用地址
    AccountService.getAddrlist($scope.params).success(function (data) {
      $scope.addrlist = data.Values.data_list;
      if ($scope.addrlist.length == 0) {
        CommonService.platformPrompt('请先添加一个默认地址', 'adddealaddress');
        $state.go('adddealaddress');
        return;
      }
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
        items.ProdID = item.ProdID; // 产品编号
        items.ProdName = item.ProdName; // 产品名称
        items.SaleClass = item.SaleClass; // 销售分类ID
        items.Unit = item.Unit;// 计算单位ID
        items.Num = $rootScope.supplyinfo[index].num; //数量
        items.Price = item.Price;//买货单价
        items.SupCount = $rootScope.supplyinfo[index].SupCount;//供货次数
        $scope.details.push(items);

      })
      //提交供货计划
      $scope.datas = {
        BONo: $rootScope.supplyDetails.No,//买货(买货)单号（待供货接口获取（BuyOrder/GetToPage））
        ToUser: $rootScope.supplyDetails.FromUser,//买货单(买货)账号（待供货接口获取）
        SupCycle: $rootScope.supplyDetails.SurplusCycle,//剩余供货周期（待供货接口获取）
        FromUser: localStorage.getItem("usertoken"),//供货人账号
        SupCount: 0,//供货次数
        SupNum: $rootScope.supplyinfo.SupNum,//平均供货周期
        Details: $scope.details// 供货计划明细（BuyOrder/GetToPage））
      };

      SupplyService.addSupplyPlan($scope.datas).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！您的订单提交成功！</p><p>我们会尽快审核您的订单</p>', '查看订单', '关闭', 'searchorder')
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
    $scope.addrlist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getAddrlist = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.addrlist = [];
      }
      $scope.page++;
      $scope.params = {
        page: $scope.page,
        size: 5,
        userid: localStorage.getItem("usertoken")
      }
      //获取用户常用地址
      AccountService.getAddrlist($scope.params).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.addrlist.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getAddrlist();

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
    //修改地址信息
    $scope.updateaddress = function (item) {
      $rootScope.addressitem = item;
      $state.go('adddealaddress');
    }

  })
  //添加地址
  .controller('AddDealAddressCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {
    CommonService.ionicLoadingShow();
    $scope.addrinfo = {};
    $scope.addrinfoother = {};
    $scope.buttonText = '添加';
    if ($rootScope.addressitem && $rootScope.addressitem.length != 0) {//是否是修改信息
      $scope.addressiteminfo = $rootScope.addressitem;
      $scope.addrinfo.username = $scope.addressiteminfo.username;
      $scope.addrinfo.mobile = $scope.addressiteminfo.mobile;
      $scope.addrinfo.addr = $scope.addressiteminfo.addr;
      $scope.addrinfoother.isstatus = $scope.addressiteminfo.status == 1 ? true : false;
      $rootScope.addressitem = [];
      $scope.buttonText = '修改';
    }


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
      $scope.addrinfo.id = $scope.addressiteminfo ? $scope.addressiteminfo.id : 0;//传入id 则是修改地址
      $scope.addrinfo.userid = localStorage.getItem("usertoken");//用户id
      $scope.addrinfo.tel = $scope.addrinfo.mobile;//固定电话
      $scope.addrinfo.addrcode = $scope.addrareacountyone.code,	//地区编码
        $scope.addrinfo.areaname = $scope.addrareacountyone.mergername, // 地区全称
        $scope.addrinfo.status = $scope.addrinfoother.isstatus ? 1 : 0,	//是否默认0-否，1-是
        $scope.addrinfo.postcode = $scope.addrareacountyone.zipcode,	//邮政编码
        $scope.addrinfo.lat = $scope.addrareacountyone.lat, 	//纬度
        $scope.addrinfo.lon = $scope.addrareacountyone.lng, 	//经度
        $scope.addrinfo.addrtype = 0	//地址类型0-	交易地址（默认）1-	家庭住址2-公司地址
      $scope.addrinfo.addr = $scope.addrareacountyone.mergername + $scope.addrinfo.addr;

      AccountService.setAddr($scope.addrinfo).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！</p><p>地址信息' + $scope.buttonText + '成功！</p>', '查看', '关闭', 'dealaddress', '');
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }

  })

  //签收列表
  .controller('SignListCtrl', function ($scope, $state, $rootScope, CommonService, DeliverService) {
    //是否登录
    if (!CommonService.isLogin()) {
      return;
    }
    $scope.deliverlist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getSaleSupply = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.deliverlist = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: '',//订单号，模糊匹配
        User: localStorage.getItem("usertoken"),//卖货人（卖货单）/供货人（供货单）发货，卖货订单时，User不能为空，以User为主导走流程
        FromUser: '',//供货人（卖货单）/买货人（供货单）签收，验货，收货订单时，以FromUser为主导走流程
        Status: 3,//订单状态(卖货单)-1取消订单0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款（供货单）-1取消订单0-未审核1-审核未通过2-审核通过/待发货3-已发货/待收货4-已收货/待付到付款5-已付到付款/待验货6-已验货/待审验货单7-已审核验货单/待结款8-已结款/待评价9-已评价
        ordertype: '',//类型 1卖货单2供货单
        Type: '' //0-物流配送1-送货上门2-上门回收
      };
      DeliverService.getSaleSupply($scope.params).success(function (data) {
        if (data.Values == null) {
          CommonService.platformPrompt('暂无订单信息', '');
          return
        }
        angular.forEach(data.Values.data_list, function (item) {
          $scope.deliverlist.push(item);
        })
        $scope.total = data.Values.page_count;
        //订单状态(卖货单)
        $rootScope.sellStatus = ['取消订单', '未审核', '审核未通过', '审核通过', '已发货', '已签收', '已验货', '已确认', '已交易', '已结款'];
        //订单状态(供货单)
        $rootScope.supplyStatus = ['取消订单', '未审核', '审核未通过', '审核通过/待发货', '已发货/待收货', '已收货/待付到付款', '已付到付款/待验货', '已验货/待审验货单', '已审核验货单/待结款', '已结款/待评价', '已评价'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }

    $scope.getSaleSupply();
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
      CommonService.ionicLoadingShow();
      var ordeType = $rootScope.signDetails.OrdeType;
      //提交签收数据
      $scope.datas = {
        User: localStorage.getItem('usertoken'),//订单所对应的会员账号
        OrderType: ordeType,//类型 1卖货单2供货单
        OrderNo: $rootScope.signDetails.No,//卖货单/供货单订单号
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
      }).finally(function () {
        CommonService.ionicLoadingHide();
      })

    }


  })
  //我的账号
  .controller('AccountCtrl', function ($scope, $rootScope, $state, BooLv, CommonService, AccountService, MainService) {
    //是否登录
    if (!CommonService.isLogin(true)) {
      return;
    }
    $scope.userid = localStorage.getItem("usertoken");
    AccountService.getUserInfo($scope.userid).success(function (data) {
      $rootScope.userinfo = data.Values;
    })
    //分享
    $scope.shareActionSheet = function () {
      MainService.getHelpDetails({ID: 13}).success(function (data) {
        $scope.helpdata = data.Values;
        //分享
        umeng.share($scope.helpdata.Title, $scope.helpdata.Abstract, '', BooLv.moblileApi + '/#/help/' + 13);
      })
    }
  })
  //账号信息
  .controller('AccountInfoCtrl', function ($scope, $rootScope, $state, CommonService) {
    $scope.isprovider = JSON.parse(localStorage.getItem("user")).grade == 5 ? true : false
  })
  //申请成为供货商
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
        username: $scope.addrinfo.username,	//姓名
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
    $scope.applylist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getApplyPayment = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.applylist = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: '',//单号
        RelateNo: 0,//关联单号
        User: localStorage.getItem("usertoken")//申请人
      }
      ApplyAdvanceService.getApplyPayment($scope.params).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.applylist.push(item);
        })
        $scope.total = data.Values.page_count;
        $scope.applystatus = ['关闭/取消', '未审核', '审核未通过', '审核通过', '款已到账', '款已还完', '已完成'];
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }

    $scope.getApplyPayment();

  })
  //获取还款记录列表
  .controller('DavanceDetailsCtrl', function ($scope, $rootScope, $stateParams, CommonService, ApplyAdvanceService) {
    $rootScope.applaydetails = JSON.parse($stateParams.item);
    $scope.repayPrincipalTotal = 0;//已还本金总金额
    //当前时间与申请时间差
    $scope.diffCycle = Math.floor((new Date().getTime() - new Date($rootScope.applaydetails.EffectDate || $rootScope.applaydetails.AddTime).getTime()) / (24 * 3600 * 1000));
    $scope.repaymentstatus = ['关闭/取消', '未审核', '审核未通过', '审核通过', '款已到账', '款已还完', '已完成'];

    $scope.repaylist = [];
    $scope.page = 0;
    $scope.total = 1;
    //获取还款记录列表
    $scope.getRepayment = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.repaylist = [];
      }
      $scope.page++;
      $scope.params = {
        currentPage: $scope.page,//当前页码
        pageSize: 5,//每页条数
        ID: '',//编码 ,等于空时取所有
        No: '',//单号
        RelateNo: $rootScope.applaydetails.No,//关联单号
        User: localStorage.getItem("usertoken")//申请人
      }
      ApplyAdvanceService.getRepayment($scope.params).success(function (data) {
        if (data.Values == null) {
          return;
        }
        angular.forEach(data.Values.data_list, function (item) {
          item.repayPrincipal = item.Money / ($rootScope.applaydetails.FuWu / 100 * $rootScope.applaydetails.Cycle + 1)
          $scope.repaylist.push(item);
          $scope.repayPrincipalTotal += item.repayPrincipal;
        })

        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    }
    $scope.getRepayment();
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
        RelateNo: $rootScope.applaydetails.No,//关联单号
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
    //是否登录
    if (!CommonService.isLogin()) {
      return;
    }
    console.log($rootScope.userbankliststatus);
    //收款账户信息
    $scope.applyinfo = {}
    //查询用户银行信息

      $scope.params = {
        page: 1,
        size: 5,
        userid: localStorage.getItem("usertoken")
      }
      AccountService.getUserBanklist($scope.params).success(function (data) {
        $rootScope.userbankliststatus = [];
        angular.forEach(data.Values.data_list, function (item) {
          if (item.isdefault == 1) {
            $rootScope.userbankliststatus.push(item);
          }
        })
      })
   

    $scope.applyadvancesubmit = function () {
      if ($rootScope.userbankliststatus.length == 0) {
        CommonService.platformPrompt('请先添加一个默认银行账户', 'addbankaccount')
        $state.go('addbankaccount');
        return;
      }
      $scope.datas = {
        RelateNo: 0,//关联单号
        User: localStorage.getItem("usertoken"),//申请人
        BankID: $rootScope.userbankliststatus[0].id,//银行ID
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
    if ($rootScope.userbankliststatus) {
        $scope.selectAccount = function (item) {
        $rootScope.userbankliststatus = [];
        $rootScope.userbankliststatus.push(item);
        $state.go("applyadvance");
      }
    }
    $scope.userbanklist = [];
    $scope.page = 0;
    $scope.total = 1;
    $scope.getUserBanklist = function () {
      if (arguments != [] && arguments[0] == 0) {
        $scope.page = 0;
        $scope.userbanklist = [];
      }
      $scope.page++;
      $scope.params = {
        page: $scope.page,//页码
        size: 5,//条数
        userid: localStorage.getItem("usertoken")//用户id
      }
      AccountService.getUserBanklist($scope.params).success(function (data) {
        angular.forEach(data.Values.data_list, function (item) {
          $scope.userbanklist.push(item);
        })
        $scope.total = data.Values.page_count;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
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
        $scope.getUserBanklist(0);//刷新
      })
    }

    //修改收款银行账号
    $scope.updatebank = function (item) {
      $rootScope.bankitem = item;
      $state.go('addbankaccount');
    }
  })
  //增加收款银行账号
  .controller('AddBankAccountCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {

    //增加收款银行账号信息
    $scope.bankinfo = {};
    $scope.buttonText = '添加';
    if ($rootScope.bankitem && $rootScope.bankitem.length != 0) { //修改银行信息
      $scope.bankiteminfo = $rootScope.bankitem;
      $scope.bankinfo.bankname = $scope.bankiteminfo.bankname;
      $scope.bankinfo.accountno = $scope.bankiteminfo.accountno;
      $scope.bankinfo.accountname = $scope.bankiteminfo.accountname;
      $scope.bankinfo.branchname = $scope.bankiteminfo.branchname;
      $scope.bankinfo.isdefault = $scope.bankiteminfo.isdefault == 1 ? true : false;
      $rootScope.bankitem = [];//清空数据
      $scope.buttonText = '修改';
    }
    //查询银行名称
    AccountService.getBankName({name: ''}).success(function (data) {
      $scope.bankName = data.Values;
    })
    $scope.addUserBank = function () {
      $scope.datas = {
        id: $scope.bankiteminfo ? $scope.bankiteminfo.id : 0, 	// id
        bankname: $scope.bankinfo.bankname,	//银行名称
        userid: localStorage.getItem("usertoken"),	//用户id
        branchname: $scope.bankinfo.branchname,	//支行名称
        accountno: $scope.bankinfo.accountno,	//银行帐号
        accountname: $scope.bankinfo.accountname,	//开户人名称
        isdefault: $scope.bankinfo.isdefault ? 1 : 0, 	//是否默认0-	否（默认值）1-	是
        remark: ""	//备注
      }
      AccountService.addUserBank($scope.datas).success(function (data) {
        CommonService.showConfirm('', '<p>恭喜您！</p><p>账户信息' + $scope.buttonText + '成功！</p>', '查看', '关闭', 'collectionaccount', '')
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
  //帮助信息共用模板
  .controller('HelpCtrl', function ($scope, $rootScope, $stateParams, $state, BooLv, CommonService, MainService) {
    CommonService.ionicLoadingShow();
    var id = $stateParams.ID;
    if (id == 11) {
      $scope.title = '登录注册协议';
    }
    if (id == 12) {
      $scope.title = '提升额度';
    }
    if (id == 13) {
      $scope.title = '关于我们';
    }
    if (id == 14) {
      $scope.title = '信用分解读';
    }
    //获取帮助中心详情
    $scope.params = {
      ID: id
    }
    MainService.getHelpDetails($scope.params).success(function (data) {
      $scope.helpdata = data.Values;
    }).finally(function () {
      CommonService.ionicLoadingHide();
    })
    //分享
    $scope.shareActionSheet = function () {
      umeng.share($scope.helpdata.Title, $scope.helpdata.Abstract, '', BooLv.moblileApi + '/#/help/' + id);
    }
  })
  .controller('SettingCtrl', function ($scope, $rootScope, $state, CommonService) {

  })
  //解绑手机
  .controller('CancelMobileCtrl', function ($scope, $rootScope, $state, CommonService, AccountService) {
    $scope.user = {};//提前定义用户对象
    $scope.paracont = "获取验证码"; //初始发送按钮中的文字
    $scope.paraclass = false; //控制验证码的disable
    $scope.checkphone = function (mobilephone) {//检查手机号
      AccountService.checkMobilePhone($scope, mobilephone);
    }
    $scope.sendCode = function () {
      event.preventDefault();
      if ($scope.user.username != JSON.parse(localStorage.getItem("user")).mobile) {
        CommonService.platformPrompt("输入手机号与原手机号不一致", 'cancelmobile');
        return;
      }
      if ($scope.paraclass) { //按钮可用
        //60s倒计时
        AccountService.countDown($scope);
        AccountService.sendCode($scope.user.username).success(function (data) {
          $scope.user.passwordcode = data.Values;
        }).error(function () {
          CommonService.platformPrompt("验证码获取失败!", 'cancelmobile');
        })
      }
    }
    $scope.cancelMobileSubmit = function () {
      if ($scope.user.passwordcode != $scope.user.password) {
        CommonService.platformPrompt("输入验证码不正确", 'cancelmobile');
        return;
      }
      $state.go("bindingmobile", {'oldphone': $scope.user.username});//绑定页面
    }

  })

  //绑定手机
  .controller('BindingMobileCtrl', function ($scope, $rootScope, $state, $stateParams, CommonService, AccountService) {
    $scope.oldphone = $stateParams.oldphone;
    $scope.user = {};//提前定义用户对象
    $scope.paracont = "获取验证码"; //初始发送按钮中的文字
    $scope.paraclass = false; //控制验证码的disable
    $scope.checkphone = function (mobilephone) {//检查手机号
      AccountService.checkMobilePhone($scope, mobilephone);
    }
    $scope.sendCode = function () {
      event.preventDefault();
      if ($scope.paraclass) { //按钮可用
        //60s倒计时
        AccountService.countDown($scope);
        AccountService.sendCode($scope.user.username).success(function (data) {
          $scope.user.passwordcode = data.Values;
        }).error(function () {
          CommonService.platformPrompt("验证码获取失败!", 'bindingmobile');
        })
      }
      $scope.bindingMobileSubmit = function () {
        CommonService.ionicLoadingShow();
        if ($scope.user.passwordcode != $scope.user.password) {
          CommonService.platformPrompt("输入验证码不正确", 'bindingmobile');
          return;
        }
        //修改手机号码
        $scope.datas = {
          userid: localStorage.getItem("usertoken"),		//用户id
          old_mobile: $scope.oldphone,		//旧用户手机号码
          new_mobile: $scope.user.username,	//新用户号码
          new_code: $scope.user.password	//短信验证码
        }
        AccountService.modifyMobile($scope.datas).success(function (data) {
          CommonService.platformPrompt('修改手机号成功', 'tab.account');
        }).finally(function () {
          CommonService.ionicLoadingHide();
        })
      }
    }
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
  .controller('MyPopover', function ($scope, $rootScope, $state, CommonService, SearchOrderService) {

    //支付定金
    $scope.paymentsubmit = function () {
      $rootScope.procureorderdetailssubmit();
    }
    //关闭订单修改状态
    $scope.closeordersubmit = function () {

      $scope.ordersubmit = function () {

        $scope.closeordersparams = {
          No: $rootScope.orderId,//订单号
          Status: -1,//状态值(-1取消订单 0-未审核1-审核未通过2-审核通过 3-已发货4-已签收5-已验货6-已确认7-已交易8-已结款)
          User: $rootScope.evaluateFromUser,//下单人账号
          OrderType: $rootScope.orderType == 1 ? 1 : 2,//1代表卖货单2代表供货单
        }
        if ($rootScope.orderType == 1) {
          //查单(卖货订单)修改卖货/供货订单状态
          SearchOrderService.updateSaleOrderStatus($scope.closeordersparams).success(function (data) {

            CommonService.platformPrompt('取消订单成功');
          })
        } else if ($rootScope.orderType == 3) {
          //查单(供货订单)修改供货计划状态
          SearchOrderService.updateSupplyPlanStatus($scope.closeordersparams).success(function (data) {

            CommonService.platformPrompt('取消订单成功');
          })
        }


      }
      CommonService.showConfirm('', '<p>温馨提示:您是否确认关闭此订单吗？</p><p>是请点击"确认"，否则请点击"取消"</p>', '确定', '取消', '', '', $scope.ordersubmit)
    }
    // 支付到付款
    $rootScope.paytopaymentsubmit = function () {
      //支付到付款按钮，付款后，调用修改状态的接口
      $scope.paytopayments = function () {
        //提交结算信息  到付款输入金额，其他3个余款，定金，订单金额是不是为0
        /*      这个是根据单号来分析的，结算在买货，卖货，供货里都有结算功能
         是卖货时，审核验货单后（6）或者已交易（7）后就是结款（8）
         是买货时，审核通过（2）后就是已支付定金（3），及备货完成（6)后就是已结款(7)
         供货时，审核验货单（7）后就是结款（8）*/
        $scope.datas = {
          OrderNo: $rootScope.collectGoodDetails.No,//订单号
          OrderType: $rootScope.orderType,//1-卖货单2-买货单3-供货单
          FromUser: $rootScope.collectGoodDetails.FromUser,//付款方
          ToUser: $rootScope.collectGoodDetails.ToUser,//收款方
          Amount: 0,//订单金额
          Yushou: 0,//到付款
          AmountFu: 0,//余款
          Earnest: 0,//定金
          Status: 6 //订单所对应的结算状态值
        }
        SearchOrderService.addStatement($scope.datas).success(function (data) {

        }).then(function () {
          //查单(买货订单)修改买货订单状态
          $scope.params = {
            No: $rootScope.collectGoodDetails.No,//订单号
            User: $rootScope.collectGoodDetails.FromUser,//下单人账号
            Status: 5//状态值(-1取消订单 0-未审核1-审核未通过2-审核通过3-已支付定金4-已收到定金5-备货中 6-备货完成7-已结款8-已返定金9-已成交10-已评价)
          }
          SearchOrderService.updateBuyOrderStatus($scope.params).success(function (data) {
            CommonService.platformPrompt('付款支付成功');
          })
        })

      }
      CommonService.showConfirm('', '<p>温馨提示:此订单的到付款为</p><p>50000元，支付请点击"确认"，否则</p><p>点击"取消"(到付款=预计总金额)</p>', '确定', '取消', '', '', $scope.paytopayments)

    }
    //结算 支付尾款
    $rootScope.payfinalpaymentsubmit = function () {
      //结算活支付尾款按钮，结算活支付尾款后，调用修改状态的接口
      $scope.payfinalpayment = function () {
        //提交结算信息  定金参数输入金额，其他3个为0
        /*      这个是根据单号来分析的，结算在买货，卖货，供货里都有结算功能
         是卖货时，审核验货单后（6）或者已交易（7）后就是结款（8）
         是买货时，审核通过（2）后就是已支付定金（3），及备货完成（6)后就是已结款(7)
         供货时，审核验货单（7）后就是结款（8）*/
        $scope.datas = {
          OrderNo: $rootScope.collectGoodDetails.No,//订单号
          OrderType: $rootScope.orderType,//1-卖货单2-买货单3-供货单
          FromUser: $rootScope.collectGoodDetails.FromUser,//付款方
          ToUser: $rootScope.collectGoodDetails.ToUser,//收款方
          Amount: 0,//订单金额
          Yushou: 0,//到付款
          AmountFu: 0,//余款
          Earnest: 0,//定金
          Status: 6 //订单所对应的结算状态值
        }
        SearchOrderService.addStatement($scope.datas).success(function (data) {

        }).then(function () {
          //查单(买货订单)修改买货订单状态
          $scope.params = {
            No: $rootScope.collectGoodDetails.No,//订单号
            User: $rootScope.collectGoodDetails.FromUser,//下单人账号
            Status: 8//状态值(-1取消订单 0-未审核1-审核未通过2-审核通过3-已支付定金4-已收到定金5-备货中 6-备货完成7-已结款8-已返定金9-已成交10-已评价)
          }
          SearchOrderService.updateBuyOrderStatus($scope.params).success(function (data) {
            CommonService.platformPrompt('付款支付成功');

          })
        })
      }
      CommonService.showConfirm('', '<p>温馨提示:此订单的尾款为</p><p>30000元，支付请点击"确认"，否则</p><p>点击"取消"(尾款=订单总金额-到付款)</p>', '确定', '取消', '', '', $scope.payfinalpayment)
    }


  })
