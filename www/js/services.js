angular.module('starter.services', [])
  .service('CommonService', function ($ionicPopup, $ionicPopover, $state, $ionicModal, $cordovaCamera, $ionicPlatform, $ionicActionSheet, $ionicHistory, $cordovaToast, $cordovaBarcodeScanner, $ionicViewSwitcher, $ionicLoading, AccountService) {
    return {
      platformPrompt: function (msg, stateurl) {
        if ($ionicPlatform.is('android') || $ionicPlatform.is('ios')) {
          $cordovaToast.showLongCenter(msg);
        } else {
          this.showAlert("博绿网", msg, stateurl);
        }
      },
      showAlert: function (title, template, stateurl) {
        // 一个提示对话框
        var alertPopup = $ionicPopup.alert({
          cssClass: "show-alert",
          title: title,
          template: template,
          okText: '确定',
          okType: 'button-calm'
        });
        alertPopup.then(function (res) {
          if (stateurl == null || stateurl == '') {
            $ionicHistory.goBack();
          } else {
            $state.go(stateurl);
          }

        });
      },
      showConfirm: function (title, template, okText, cancelText, stateurl, closeurl, confirmfunction) {
        var confirmPopup = $ionicPopup.confirm({
          cssClass: "show-confirm",
          title: '<strong>' + title + '</strong>',
          template: template,
          okText: okText,
          cancelText: cancelText,
          okType: 'button-calm',
          cancelType: 'button-assertive'
        });

        confirmPopup.then(function (res) {
          if (res) {
            if (stateurl != '') {
              $state.go(stateurl);
              $ionicViewSwitcher.nextDirection("forward");//前进画效果
            } else {
              confirmfunction();
            }
          } else {
            $state.go((closeurl == null || closeurl == '') ? 'tab.main' : closeurl)
            $ionicViewSwitcher.nextDirection("back");//后退动画效果
          }
        });
      },

      searchModal: function ($scope,templateurl) {
        //点击搜索跳转搜索modal
        $ionicModal.fromTemplateUrl(templateurl, {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // 当隐藏的模型时执行动作
        $scope.$on('modal.hide', function() {
          // 执行动作
        });
        // 当移动模型时执行动作
        $scope.$on('modal.removed', function() {
          // 执行动作
        });
      }
      ,
      ionicPopover: function ($scope, templateUrl) {
        $ionicPopover.fromTemplateUrl('templates/popover/' + templateUrl, {
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
        //Cleanup the popover when we're done with it! 清除浮动框
        $scope.$on('$destroy', function () {
          $scope.popover.remove();
        });
        $scope.$on('$ionicView.leave', function () {
          $scope.popover.hide();
        });
        // 在隐藏浮动框后执行
        $scope.$on('popover.hidden', function () {
          // Execute action
        });
        // 移除浮动框后执行
        $scope.$on('popover.removed', function () {
          // Execute action
        });
      },

      ionicLoadingShow: function (content) {
        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles" class="spinner-calm"></ion-spinner>',
          animation: 'fade-in',
          showBackdrop: false

        });
      },
      ionicLoadingHide: function () {
        $ionicLoading.hide();
      },
      //调用摄像头和相册
      takePicture: function ($scope, type, filenames) {
        //$cordovaCamera.cleanup();
        var options = {
          quality: 100,//相片质量0-100
          destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
          sourceType: type == 0 ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA,//从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
          allowEdit: false,                                        //在选择之前允许修改截图
          encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
          targetWidth: 500,                                        //照片宽度
          targetHeight: 500,                                       //照片高度
          mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
          cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
          saveToPhotoAlbum: true                                   //保存进手机相册
        };

        $cordovaCamera.getPicture(options).then(function (imageUrl) {
          AccountService.addFilenames($scope, {filenames: filenames}, imageUrl);

        }, function (err) {
          // An error occured. Show a message to the user

        });
      },
      //扫一扫
      barcodeScanner: function ($scope) {
        /*      先检测设备是否就绪，通过cordova内置的原生事件deviceready来检测*/
        document.addEventListener("deviceready", function () {
          $cordovaBarcodeScanner
            .scan()
            .then(function (barcodeData) {
              // Success! Barcode data is here 扫描数据：barcodeData.text
              var reg = new RegExp("^((http)||(https)){1}://[\s]{0,}");//二维码信息是否有http链接
              if (reg.test(barcodeData.text)) {
                //通过默认浏览器打开
                window.open(barcodeData.text, '_system', 'location=yes');
              } else {
                if ($scope.deliverinfo) {
                  $scope.deliverinfo.ExpNo = barcodeData.text;//发货
                }
                if ($scope.signinfo) {
                  $scope.signinfo.ExpNo = barcodeData.text;//验收
                }

                $cordovaToast.showShortCenter('扫一扫信息', barcodeData.text);
              }
            }, function (error) {
              $cordovaToast.showShortCenter('扫描失败,请重新扫描');
            });


          // NOTE: encoding not functioning yet 编不能正常工作
          $cordovaBarcodeScanner
            .encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com")
            .then(function (success) {
              // Success!
            }, function (error) {
              // An error occurred
            });
        }, false);
      }
      ,
      shareActionSheet: function () {
        $ionicActionSheet.show({
          cssClass: 'action-s',
          titleText: '<p>分享</p>',
          buttons: [
            {text: ' <p>收藏</p>'},
            {text: '<p>微信朋友圈</p>'},
            {text: '<p>QQ好友</p>'},
            {text: '<p>QQ空间</p>'},
            {text: '<p>更多</p>'}
          ],
          cancelText: '<p>关闭</p>',
          cancel: function () {
            return true;
          },
          buttonClicked: function (index) {
            switch (index) {
              case 0:
                break;
              case 1:
                break;
              default:
                break;
            }
            return true;
          }
        });
      },
      uploadActionSheet: function ($scope, filename) {
        CommonService = this;
        $ionicActionSheet.show({
          cssClass: 'action-s',
          titleText: '<p>上传照片</p>',
          buttons: [
            {text: '<p>图库</p>'},
            {text: ' <p>拍照</p>'},
          ],
          cancelText: '<p>取消</p>',
          cancel: function () {
            return true;
          },
          buttonClicked: function (index) {
            switch (index) {
              case 0:
                CommonService.takePicture($scope, 0, filename)
                break;
              case 1:
                CommonService.takePicture($scope, 1, filename)
                break;
              default:
                break;
            }
            return true;
          }
        });
      },
      getLocation: function () { //获取当前经纬度
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (p) {
              localStorage.setItem("latitude", p.coords.latitude);
              localStorage.setItem("longitude", p.coords.longitude);
            },
            function (e) {
              var msg = e.code + "\n" + e.message;
            }
          );
        }
      },
      isLogin: function () {//判断是否登录
        if (!localStorage.getItem("usertoken")) {
          $state.go('login')
          return ;
         }
      },
      getStateName:function(){    //得到上一个路由名称方法
        var stateName = "";
        if($ionicHistory.backView() && $ionicHistory.backView().stateName!="tab.account"){
          stateName =  $ionicHistory.backView().stateName;
        }
        if(stateName){
          $ionicHistory.goBack();
        }else{
          $state.go("tab.main",{} ,{reload:true});
        }
      },
      stateReload: function (stateurl) {//路由跳转刷新
        $state.go(stateurl,{} ,{reload:true});
      }
    }
  })
  .service('MainService', function ($q, $http, BooLv) { //主页服务定义
    return {
      //登录并且授权
      authLogin: function () {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Auth/Login",
          data: {
            "AppID": "1209889123",
            "AppKey": "fdsjyt34fwefyu6776yhthhj78643ffghg"
          }
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      //获取广告图
      getAdMsg: function () {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/AdMsg/GetAdMsg",
          /*       headers: {
           'Authorization':localStorage.getItem('token')
           },*/
          params: {
            type: 1
          }
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      //获取行情报价
      getProds: function () {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Prod/GetProds",
          params: {GrpIDList: '1,5'}
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      //获取行情报价分页列表
      getProdsList: function (restparams,params) {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Prod/GetPageProds/"+restparams.currentPage+'/'+restparams.pageSize,
          params:params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      //获取交易公告
      getListNews: function (listNewsParams) {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/News/GetListNews",
          params: listNewsParams
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      //获取新闻详情
      getNews: function (Id) {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/News/GetNews",
          params: {
            id: Id
          }
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      //获取帮助中心列表
      getHelpList: function (params) {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Help/GetListPage",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      //获取帮助中心详情
      getHelpDetails: function (params) {
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Help/GetHelp",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  }).service('AccountService', function ($q, $http, BooLv, $cordovaFileTransfer, $state,$cordovaToast) {
  return {
    sendCode: function (phonenum) {
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/send_code/" + phonenum,

      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    login: function (user) { //登录
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/login",
        data: {
          mobile: user.username,
          code: user.password
        }
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    modifySex: function (params) { //修改性别
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/modify_sex/" + params.userid + '/' + params.sex
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    modifyFigure: function (params) { //修改头像
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/modify_figure/" + params.userid,
        params: {figure: params.figure} //头像地址，调用上传图片接口获得地址
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        $state.go('tab.account');
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    modifyNickname: function (params) { //修改用户昵称
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/modify_nickname/" + params.userid,
        params: {nickname: params.nickname}
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    modifyMobile: function (datas) { //修改手机号码
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/modify_mobile",
        data: datas
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    getAddrlist: function (params) {//获取用户常用地址
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'GET',
        url: BooLv.api + "/user/get_addrlist/" + params.page + "/" + params.size + "/" + params.userid,
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    setAddr: function (datas) {//增加修改用户常用地址
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/set_addr",
        data: datas
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    deleteAddr: function (params) {//删除常用地址
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/del_addr/" + params.id + "/" + params.userid
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    getArea: function (code) {//查询地区列表
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'GET',
        url: BooLv.api + "/user/get_area/" + code,
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    getUserInfo: function (userid) {//获取用户信息
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'GET',
        url: BooLv.api + "/user/get/" + userid,
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    applySupply: function (datas) {//申请供货商
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/apply_supply",
        data: datas,
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    getUserBanklist: function (params) {//查询用户银行信息
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'GET',
        url: BooLv.api + "/user/get_userbanklist/" + params.page + '/' + params.size + '/' + params.userid,
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    addUserBank: function (datas) {//添加、修改用户银行信息
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/user/add_userbank",
        data: datas,
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    delUserBank: function (params) {//删除银行信息
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'DELETE',
        url: BooLv.api + "/user/del_userbank/" + params.id + '/' + params.userid,
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    getBankName: function (params) {//查询银行名称
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'GET',
        url: BooLv.api + "/BankName/GetBankName",
        params: {
          Name: params.name
        }
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    getExpresses: function (params) {//查询物流快递
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise;
      promise = $http({
        method: 'GET',
        url: BooLv.api + "/Expresses/GetExpresses",
        params: {
          code: params.code,
          name: params.name
        }
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    addFilenames: function ($scope, params, imageUrl) {//上传附件
      AccountService = this;
      //图片上传upImage（图片路径）
      //http://ngcordova.com/docs/plugins/fileTransfer/  资料地址

      var url = BooLv.api + "/UploadImg/Add/" + params.filenames;//Filenames:上传附件根目录文件夹名称发货，签收，验货统一用Receipt这个名称  会员头像用User这个名称
      var options = {
        fileKey: "file",//相当于form表单项的name属性
        fileName: imageUrl.substr(imageUrl.lastIndexOf('/') + 1),
        mimeType: "image/jpeg"
      };
      $cordovaFileTransfer.upload(url, imageUrl, options)
        .then(function (result) {
          if (params.filenames == 'User') {
            var figurparams = {
              userid: localStorage.getItem("usertoken"),
              figure: JSON.parse(result.response).Des
            }
            AccountService.modifyFigure(figurparams);
          }
          if (params.filenames == 'Receipt') {
            $scope.Imgs.PicAddr = JSON.parse(result.response).Des;
          }
          $cordovaToast.showLongCenter("上传成功");
          console.log("success=" + result.response);
        }, function (err) {
          console.log("err=" + err.response);
        }, function (progress) {
          // constant progress updates
        });
    }
  }
})
  .service('SellService', function ($q, $http, BooLv) {//卖货服务
    return {
      getListLongAndLat: function (params) { //根据经纬度获取最近N个供应商
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SupplyUser/GetListLongAndLat",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addOrderDetails: function (datas) { //提交卖货订单
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/SaleOrder/AddOrder_Details",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })
  .service('BuyService', function ($q, $http, BooLv) {//买货服务
    return {
      addBuyOrderDetails: function (datas) { //提交买货订单
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/BuyOrder/AddBuyOrder_Details",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })

  .service('SupplyService', function ($q, $http, BooLv) {//接单供货计划服务
    return {
      getToPage: function (params) { //接单供货计划订单列表以及详情
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/BuyOrder/GetToPage",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getRange: function (params) { //根据经纬度查询到与该会员的距离
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SupplyUser/GetRange",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addSupplyPlan: function (datas) { //提交供货计划
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/SupplyPlan/AddOrder_Details",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getExpressesPrice: function () { //得到物流单价/吨/千米
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Expresses/GetPrice"
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addExpressesCost: function (datas) { //根据距离及产品明细数量得到参考物流费用
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Expresses/Addcost",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })
  .service('DeliverService', function ($q, $http, BooLv) {//发货 签收 验货 服务
    return {
      getSaleSupply: function (params) { //发货 签收 验货  获取待发货单（卖货/供货接口）列表分页列接口）
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SaleOrder/GetSaleSupply",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addFaHuo: function (datas) { //提交发货信息
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/FaHuo/AddFaHuo",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addSign: function (datas) { //提交签收信息
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Sign/AddSign",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addYanhuo: function (datas) { //验货信息
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Yanhuo/AddYanhuo",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getGoodTypeList: function (params) { //发货 签收 验货  获取产品类别
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/QueJian/GetGroup",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getQueJianList: function (params) { //发货 签收 验货  查询缺件信息分页列
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/QueJian/GetListQueJian",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addQJ: function (datas) { //提交卖货/供货验货扣款记录
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/QueJian/AddQJ",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getPageSQueJian: function (params) { //发货 签收 验货 查询卖货验货扣款记录分页列
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/QueJian/GetPageSQueJian",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
      ,
      getPageBQueJian: function (params) { //发货 签收 验货 查询供货验货扣款记录分页列
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/QueJian/GetPageBQueJian",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })
  .service('ApplyAdvanceService', function ($q, $http, BooLv) {//申请预收款服务
    return {
      applyPayment: function (datas) { //申请预收款
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Payment/ApplyPayment",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getApplyPayment: function (params) { //获取申请预收款列表
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Payment/GetToPage",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addRepayment: function (datas) { //提交还款记录
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Payment/Repayment",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getRepayment: function (params) { //获取还款记录列表
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Payment/GetPageRepayment",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })
  .service('SearchOrderService', function ($q, $http, BooLv) {//查单接口服务
    return {
      getSaleOrderList: function (params) { //查单(卖货订单)获取卖货单列表
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SaleOrder/GetToPage",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateSaleOrderStatus: function (params) { //查单(卖货订单)修改卖货/供货订单状态
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SaleOrder/Update_Status",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getYanhuoList: function (params) { //查单(卖货订单)获取卖货验货单列表
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Yanhuo/GetPageSale",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateSaleOrderYanhuoStatus: function (params) { //查单(卖货订单)修改卖货验货状态
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Yanhuo/Update_StatusSale",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateStatusSaleDetails: function (params) { //查单(卖货订单)修改卖货验货明细产品状态
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Yanhuo/Update_StatusSaleDetails",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addReturn: function (datas) { //查单(卖货订单)提交退货信息
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Yanhuo/AddReturn",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addSaleTrade: function (datas) { //查单(卖货订单)提交卖货交易信息
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Yanhuo/AddSaleTrade",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateBuyOrderStatus: function (params) { //查单(买货订单)修改买货订单状态
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/BuyOrder/Update_Status",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getSupplyPlanList: function (params) { //查单(供货订单)获取供货计划单列表
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SupplyPlan/GetToPage",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateSupplyPlanStatus: function (params) { //查单(供货订单)修改供货计划状态
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SupplyPlan/Update_Status",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addSearchOrderSupplyPlan: function (datas) { //查单(供货订单)提交供货单
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/SupplyPlan/AddSOD",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getSupplyPlan: function (params) { //查单(供货订单)获取供货单列表
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/SupplyPlan/GetPageSupply",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getSupplyPlanYanhuoList: function (params) { //查单(供货订单)获取供货验货单列表
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Yanhuo/GetPageBuy",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateSupplyYanhuoStatus: function (params) { //查单(供货订单)修改供货验货状态
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Yanhuo/Update_StatusBuy",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateSupplyYanhuoDetailsStatus: function (params) { //查单(供货订单)修改供货验货明细产品状态
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Yanhuo/Update_StatusBuyDetails",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addSupTrade: function (datas) { //查单(供货订单)提交供货交易信息
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Yanhuo/AddSupTrade",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getEvaluate: function (params) { //查单 获取评论属性
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Evaluate/GetEvaluate",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addEvaluate: function (datas) { //查单 添加评价
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Evaluate/Add",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      addStatement: function (datas) { //查单 提交结算信息
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/Statement/Add",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getPageFaHuo: function (params) { //查单 获取发货信息列表及详情
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/FaHuo/GetPageFaHuo",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getPageSign: function (params) { //查单 获取签收信息列表及详情
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/Sign/GetPageSign",
          params: params
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })
  .service('NewsService', function ($q, $http, BooLv) {//通知消息服务
    return {
      setDeviceInfo: function (datas) { //提交设备信息到服务器
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/push/set",
          data: datas
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      getNewsList: function (params) { //获取通知数据
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'GET',
          url: BooLv.api + "/push/get/" + params.page + '/' + params.size + '/' + params.userid,
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      },
      updateNewsLook: function (params) { //新闻设置已读未读
        var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
        var promise = deferred.promise;
        promise = $http({
          method: 'POST',
          url: BooLv.api + "/push/look/" + params.look,
          params: {ids: params.ids}
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  })
  .factory('authInterceptor', function ($rootScope) {//设置请求头信息的地方是$httpProvider.interceptors。也就是为请求或响应注册一个拦截器。使用这种方式首先需要定义一个服务
    return {
      request: function (config) {
        config.headers = config.headers || {};
        var token = localStorage.getItem('token');
        if (token) {
          config.headers.authorization = token;
        }
        return config;
      },
      responseError: function (response) {
        // ...
      }
    };
  })
  .service('EncodingService', function () {
    return {
      md5: function (str) {
        var hexcase = 0;

        function hex_md5(a) {
          if (a == "") return a;
          return rstr2hex(rstr_md5(str2rstr_utf8(a)))
        }

        function hex_hmac_md5(a, b) {
          return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
        }

        function md5_vm_test() {
          return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
        }

        function rstr_md5(a) {
          return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
        }

        function rstr_hmac_md5(c, f) {
          var e = rstr2binl(c);
          if (e.length > 16) {
            e = binl_md5(e, c.length * 8)
          }
          var a = Array(16),
            d = Array(16);
          for (var b = 0; b < 16; b++) {
            a[b] = e[b] ^ 909522486;
            d[b] = e[b] ^ 1549556828
          }
          var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
          return binl2rstr(binl_md5(d.concat(g), 512 + 128))
        }

        function rstr2hex(c) {
          try {
            hexcase
          } catch (g) {
            hexcase = 0
          }
          var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
          var b = "";
          var a;
          for (var d = 0; d < c.length; d++) {
            a = c.charCodeAt(d);
            b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
          }
          return b
        }

        function str2rstr_utf8(c) {
          var b = "";
          var d = -1;
          var a, e;
          while (++d < c.length) {
            a = c.charCodeAt(d);
            e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
            if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
              a = 65536 + ((a & 1023) << 10) + (e & 1023);
              d++
            }
            if (a <= 127) {
              b += String.fromCharCode(a)
            } else {
              if (a <= 2047) {
                b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
              } else {
                if (a <= 65535) {
                  b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                } else {
                  if (a <= 2097151) {
                    b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                  }
                }
              }
            }
          }
          return b
        }

        function rstr2binl(b) {
          var a = Array(b.length >> 2);
          for (var c = 0; c < a.length; c++) {
            a[c] = 0
          }
          for (var c = 0; c < b.length * 8; c += 8) {
            a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
          }
          return a
        }

        function binl2rstr(b) {
          var a = "";
          for (var c = 0; c < b.length * 32; c += 8) {
            a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
          }
          return a
        }

        function binl_md5(p, k) {
          p[k >> 5] |= 128 << ((k) % 32);
          p[(((k + 64) >>> 9) << 4) + 14] = k;
          var o = 1732584193;
          var n = -271733879;
          var m = -1732584194;
          var l = 271733878;
          for (var g = 0; g < p.length; g += 16) {
            var j = o;
            var h = n;
            var f = m;
            var e = l;
            o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
            l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
            m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
            n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
            o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
            l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
            m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
            n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
            o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
            l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
            m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
            n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
            o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
            l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
            m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
            n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
            o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
            l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
            m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
            n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
            o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
            l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
            m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
            n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
            o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
            l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
            m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
            n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
            o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
            l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
            m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
            n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
            o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
            l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
            m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
            n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
            o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
            l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
            m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
            n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
            o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
            l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
            m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
            n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
            o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
            l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
            m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
            n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
            o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
            l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
            m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
            n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
            o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
            l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
            m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
            n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
            o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
            l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
            m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
            n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
            o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
            l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
            m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
            n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
            o = safe_add(o, j);
            n = safe_add(n, h);
            m = safe_add(m, f);
            l = safe_add(l, e)
          }
          return Array(o, n, m, l)
        }

        function md5_cmn(h, e, d, c, g, f) {
          return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
        }

        function md5_ff(g, f, k, j, e, i, h) {
          return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
        }

        function md5_gg(g, f, k, j, e, i, h) {
          return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
        }

        function md5_hh(g, f, k, j, e, i, h) {
          return md5_cmn(f ^ k ^ j, g, f, e, i, h)
        }

        function md5_ii(g, f, k, j, e, i, h) {
          return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
        }

        function safe_add(a, d) {
          var c = (a & 65535) + (d & 65535);
          var b = (a >> 16) + (d >> 16) + (c >> 16);
          return (b << 16) | (c & 65535)
        }

        function bit_rol(a, b) {
          return (a << b) | (a >>> (32 - b))
        };

        return hex_md5(str)
      },
      encodingUTF8: function (str) {
        function Str2Hex(s) {
          var c = "";
          var n;
          var ss = "0123456789ABCDEF";
          var digS = "";
          for (var i = 0; i < s.length; i++) {
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += Dec2Dig(eval(n));

          }

          return digS;
        }

        function Dec2Dig(n1) {
          var s = "";
          var n2 = 0;
          for (var i = 0; i < 4; i++) {
            n2 = Math.pow(2, 3 - i);
            if (n1 >= n2) {
              s += '1';
              n1 = n1 - n2;
            }
            else
              s += '0';

          }
          return s;

        }

        function Dig2Dec(s) {
          var retV = 0;
          if (s.length == 4) {
            for (var i = 0; i < 4; i++) {
              retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
          }
          return -1;
        }

        function Hex2Utf8(s) {
          var retS = "";
          var tempS = "";
          var ss = "";
          if (s.length == 16) {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10, 16);
            var sss = "0123456789ABCDEF";
            for (var i = 0; i < 3; i++) {
              retS += "%";
              ss = tempS.substring(i * 8, (eval(i) + 1) * 8);


              retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
              retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
            }
            return retS;
          }
          return "";
        }

        var s = escape(str);
        var sa = s.split("%");
        var retV = "";
        if (sa[0] != "") {
          retV = sa[0];
        }
        for (var i = 1; i < sa.length; i++) {
          if (sa[i].substring(0, 1) == "u") {
            retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));

          }
          else retV += "%" + sa[i];
        }

        return retV;

      }
    }
  })

