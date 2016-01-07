'use strict';

angular.module('ifd')
        .controller('EquipController', EquipController); // 设备
angular.module('ifd')
        .controller('MapController', MapController); // 设备地图
angular.module('ifd')
        .controller('FireControlController', FireControlController); // 消防设备

// 设备
function EquipController($scope) {

}
// 设备地图
function MapController($scope) {

}
// 消防设备
function FireControlController($scope, EquipService, User) {
  $scope.size = 10;
  $scope.config ={errormsg:false,infinite:true,size:10,page:0,access_token:User.token(),equips:[]};

  $scope.loadAll = function(callback) {
    EquipService.query({page: $scope.config.page, size: $scope.config.size,type:'station',access_token:User.token()}, function(result, headers) {
      $scope.config.equips  =  $scope.config.equips.concat(result);
      $scope.config.page = $scope.config.page + 1;
      $scope.config.infinite = $scope.config.page <   headers('pages');
      callback && callback();
    },function(error){
      callback && callback();
    });
  };

  $scope.refresh = function(){
    $scope.config = {errormsg:false,infinite:true,size:10,page:0,equips:[]};
    $scope.loadAll(function(){
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.infinite = function(){
    $scope.loadAll(function(){$scope.$broadcast('scroll.infiniteScrollComplete');});
  };
}
