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
  .controller('MainCtrl', function ($scope, $state, $rootScope, $ionicModal, $stateParams, $http, BooLv, $ionicLoading) {


  })
  .controller('WorklistCtrl', function ($scope, BooLv, $http, $rootScope, commonService) {


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
  

