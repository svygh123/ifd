'use strict';

angular.module('ifd')
        .controller('EquipController', EquipController); // 设备
angular.module('ifd')
        .controller('MapController', MapController); // 设备地图
angular.module('ifd')
        .controller('FireControlController', FireControlController); // 消防设备

// 设备
function EquipController($scope) {
  $scope.cityName = "南京市";
  var myCity = new BMap.LocalCity();
  myCity.get(function(result){
    $scope.cityName = result.name;
  });
}
// 设备地图
function MapController($scope) {
  $scope.map = new BMap.Map("allmap");    // 创建Map实例
  $scope. map.centerAndZoom(new BMap.Point(118.7404, 32.036), 16);  // 初始化地图,设置中心点坐标和地图级别
  $scope. map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
  $scope.map.setCurrentCity($scope.cityName);          // 设置地图显示的城市 此项是必须设置的
  $scope. map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
  $scope.map.addControl(new BMap.NavigationControl());
  $scope.currentPoint={};

  //地图
  var positionSucess = function(position){
    $scope.currentPoint.longitude = position.coords.longitude;
    $scope.currentPoint.latitude = position.coords.latitude;
    //alert("经度："+ position.coords.longitude + "  维度："+position.coords.latitude);
    var pt = new BMap.Point(position.coords.longitude, position.coords.latitude);
    var marker = new BMap.Marker(pt);
    $scope.map.addOverlay(marker);
    $scope.map.panTo(pt);
    //var addComp = position.addressComponents;
    //console.log(position);
    //var str = JSON.stringify(position);
    //alert(str);
  };

  var errorPosition = function(error){
  };
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(positionSucess,errorPosition,{
      enableHighAccuracy: false,
      timeout: 60*1000,
      maximumAge: 1000*60*10
    });
  }else{
    alert("不能实现定位");
  }

  $scope.$on('$destroy',function(){

  });
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
