angular.module('starter.directive', [])
  .directive('hideTabs',function($rootScope){
    return {
      restrict:'AE',
      link:function($scope){
        $rootScope.hideTabs = 'tabs-item-hide';
        //监听$destory事件,这个事件会在页面发生跳转的时候触发
        $scope.$on('$destroy',function(){
          $rootScope.hideTabs = ' ';
        })
      }
    }
  })
