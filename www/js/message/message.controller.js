'use strict';

angular.module('ifd')
        .controller('MessageController', MessageController); // 消息

// 消息
function MessageController($scope, MessageService) {

  $scope.config = {
    errormsg: false,
    infinite: true,
    per_page: 10,
    page: 0,
    messages: []
  };

  $scope.loadAll = function(callback) {
    MessageService.query(
      {page: $scope.config.page, per_page: $scope.config.per_page},
      function(result, headers) {
        debugger;
        $scope.config.messages  =  $scope.config.messages.concat(result);
        $scope.config.page = $scope.config.page + 1;
        $scope.config.infinite = $scope.config.page < headers('pages');
        callback && callback();
      },function(error) {
        alert(error);
      });
  };

  $scope.infinite = function() {
    $scope.loadAll(function() {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.refresh = function() {
    $scope.config = {
      errormsg: false,
      infinite: true,
      per_page: 10,
      page: 0,
      messages: []
    };

    $scope.loadAll(function() {
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

}
