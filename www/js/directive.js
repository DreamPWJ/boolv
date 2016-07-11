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
        scope.showme1 = false;
        scope.showme2 = false;
        scope.showme3 = false;
        scope.toggle = function (arg) {//每次点击调用此方法都让scope.showme值反转1次
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
