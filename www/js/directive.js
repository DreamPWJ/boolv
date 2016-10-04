angular.module('starter.directive', [])
  .directive('hideTabs', function ($rootScope) {
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
  .directive('hideShow', function () {
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
  }).directive('scrollTop', function ($ionicScrollDelegate) {//返回顶部指令
  return {
    restrict: 'AE',
    link: function (scope, element, attrs) {
      scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop(500);
      };
    }
  }
})
/**
 * 提示框tooltip
 */
  .directive('toolTip', [function () {

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
  }]).directive('checkForm', function ($rootScope, CommonService) {//验证表单类型 提示
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $rootScope.commonService = CommonService;
      $rootScope.verify = true;
      scope.checkForm = function (value, content, type, comparevalue) {
        if (type == 'phone') {//验证手机号
        }
        if (type == 'maxvaule') {//最大不能超过comparevalue值
          if (value > comparevalue) {
            $rootScope.commonService.toolTip(content, '')
            $rootScope.verify = false;
          } else {
            $rootScope.verify = true;
          }
        }
        if (type =='positivenumber') {//正数验证
          if (/^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value)) {
            $rootScope.verify = true;
          } else {
            $rootScope.commonService.toolTip(content, '')
            $rootScope.verify = false;
          }
        }
      };
    }
  }
});
