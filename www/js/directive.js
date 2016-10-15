angular.module('starter.directive', [])
  .directive('hideTabs', function ($rootScope) {  //隐藏底部tabs指令
    return {
      restrict: 'AE',
      link: function ($scope) {
        $rootScope.hideTabs = 'tabs-item-hide';
        //监听$destory事件,这个事件会在页面发生跳转的时候触发
        $scope.$on('$destroy', function () {
          $rootScope.hideTabs = ' ';
        })
      }
    }
  })
  .directive('hideShow', function () {  //点击触发显示隐藏元素指令
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.showme = true;
        scope.showme1 = false;
        scope.showme2 = false;
        scope.showme3 = false;
        scope.toggle = function (arg) {//每次点击调用此方法都让scope.showme值反转1次
          if (arg == 0) {
            scope.showme = !scope.showme;
          }
          if (arg == 1) {
            scope.showme1 = !scope.showme1;
          }
          if (arg == 2) {
            scope.showme2 = !scope.showme2;
          }
          if (arg == 3) {
            scope.showme3 = !scope.showme3;
          }
        }
      }
    }
  })
  .directive('scrollTop', function ($ionicScrollDelegate) {//返回顶部指令
  return {
    restrict: 'AE',
    link: function (scope, element, attrs) {
      scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop(500);
      };
    }
  }
})
  .directive('toolTip', [function () { //提示框tooltip

    return {
      restrict: 'EA',
      templateUrl: 'templates/popover/tooltip.html',
      scope: {
        message: "=",
        type: "="
      },
      link: function (scope, element, attrs) {

        scope.hideAlert = function () {
          scope.message = null;
          scope.type = null;
        };

      }
    };
  }])
  .directive('checkForm', function ($rootScope, CommonService) {//验证表单类型 提示
    $rootScope.verifyarray=[];
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $rootScope.commonService = CommonService;
        $rootScope.verify = true;
        $rootScope.verifyarray[scope.$id]=true;
        scope.publicCheckForm=function (regular,value,content) { //验证公共部分封装
          if (regular) {
            $rootScope.verifyarray[scope.$id]=true;
            $rootScope.verify = true;
            angular.forEach($rootScope.verifyarray,function (item,index) {
              if(!item){
                $rootScope.verify = false;
              }
            })
          } else {
            if (value || value == 0) {
              $rootScope.commonService.toolTip(content, '')
            }
            $rootScope.verifyarray[scope.$id]=false;
            $rootScope.verify = false;
          }
        }
        scope.checkForm = function (value, content, type, maxvalue) {
          if (type == 'mobilephone') {//验证手机号
            if (/^1(3|4|5|7|8)\d{9}$/.test(value)) {
              $rootScope.verify = true;
            } else {
              if (value) {
                $rootScope.commonService.toolTip(content, '')
              }
              $rootScope.verify = false;
            }
          }
          if (type == 'maxvaule') {//最大不能超过maxvalue值
            scope.publicCheckForm(value>0&&value<=maxvalue,value,content);
          }
          if (type == 'positivenumber') {//正数验证(如 价格)
            scope.publicCheckForm(/^([1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(value),value,content)

          }
          if (type == 'positiveinteger') {//正整数
            scope.publicCheckForm(/^[1-9]\d*$/.test(value),value,content);

          }
        };
      }
    }
  });
