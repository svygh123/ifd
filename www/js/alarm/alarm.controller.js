'use strict';

angular.module('ifd')
        .controller('AlarmController', AlarmController); // 预警

// 预警
function AlarmController($scope, AlarmService) {

  $scope.config = {
    errormsg: false,
    infinite: true,
    per_page: 10,
    page: 0,
    fileAlarms: []
  };

  $scope.loadAll = function(callback) {
    AlarmService.query(
      {page: $scope.config.page, per_page: $scope.config.per_page},
      function(result, headers) {
        $scope.config.fileAlarms  =  $scope.config.fileAlarms.concat(result);
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
      fileAlarms: []
    };

    $scope.loadAll(function() {
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

}
