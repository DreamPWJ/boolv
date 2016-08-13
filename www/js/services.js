angular.module('starter.services', [])
  .service('CommonService', function ($ionicPopup, $ionicPopover, $state, $ionicModal, $cordovaCamera, $ionicActionSheet, $ionicHistory, $cordovaToast, $cordovaBarcodeScanner, $ionicViewSwitcher, $ionicLoading) {
    return {
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
      showConfirm: function (title, template, okText, cancelText, stateurl, closeurl) {
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
            $state.go(stateurl);
            $ionicViewSwitcher.nextDirection("forward");//前进画效果
          } else {
            $state.go((closeurl == null || closeurl == '') ? 'tab.main' : closeurl)
            $ionicViewSwitcher.nextDirection("back");//后退动画效果
          }
        });
      },

      searchModal: function ($scope) {
        //点击搜索跳转搜索modal
        $ionicModal.fromTemplateUrl('templates/search.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal;
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
          template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>',
          animation: 'fade-in',
          showBackdrop: false

        });
      },
      ionicLoadingHide: function () {
        $ionicLoading.hide();
      },
      //拍照
      takePicture: function () {
        //$cordovaCamera.cleanup();
        var options = {
          quality: 100,
          width: 500,
          height: 500
        };

        $cordovaCamera.getPicture(options).then(function (imageUrl) {

        }, function (err) {
          // An error occured. Show a message to the user

        });

      }
      ,
      //扫一扫
      barcodeScanner: function () {
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
          params: {
            type: 1
          }
        }).success(function (data) {
          deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
        }).error(function (err) {
          deferred.reject(err);// 声明执行失败，即服务器返回错误
        });
        return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
      }
    }
  }).service('AccountService', function ($q, $http, BooLv) {
  return {
    sendCode: function () {
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'POST',
        url: BooLv.api + "",

      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    },
    login: function (user) {
      var deferred = $q.defer();// 声明延后执行，表示要去监控后面的执行
      var promise = deferred.promise
      promise = $http({
        method: 'POST',
        url: BooLv.api + "/User/Login",
        data: {
          PhoneNum: user.username,
          VerCode: user.password
        }
      }).success(function (data) {
        deferred.resolve(data);// 声明执行成功，即http请求数据成功，可以返回数据了
      }).error(function (err) {
        deferred.reject(err);// 声明执行失败，即服务器返回错误
      });
      return promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
    }
  }
})


