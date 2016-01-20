'use strict';

angular.module('ifd')
        .controller('EquipController', EquipController) // 设备
        .controller('FireControlController', FireControlController) // 设备列表
        .controller('FireControlListController', FireControlListController)        // 设备功能列表(detail,monitor,status)
        .controller('FireControlDetailController', FireControlDetailController)    // 设备详细
        .controller('FireControlMonitorController', FireControlMonitorController)  // 监控数据
        .controller('FireControlStatusController', FireControlStatusController);   // 状态信息

// 设备
function EquipController($scope, $http, HOST, localStorageService, EquipService) {
  var map = new BMap.Map("allmap"); // 创建Map实例
  map.centerAndZoom(new BMap.Point(116.404, 39.915), 5);
  map.enableScrollWheelZoom(true);   // 开启鼠标滚轮缩放
  map.addControl(new BMap.NavigationControl()); // 添加默认缩放平移

  // 加载设备信息,并在地图上标出
  $scope.config = {
    errormsg: false,
    infinite: true,
    per_page: 100,
    page: 0,
    equips: []
  };

  EquipService.query(
    {page: $scope.config.page, per_page: $scope.config.per_page},
  function(result, headers) {
    angular.forEach(result, function(item) {
      if (item.longitude && item.latitude) {
        var pt = new BMap.Point(item.longitude, item.latitude);
        var marker = new BMap.Marker(pt);

        var status = item.faultMsg?item.faultMsg:'故障';
        var label = new BMap.Label('【'+ status + '】' + item.equipName + '<br>【地址】' + item.address, {offset: new BMap.Size(20, -10)});
        marker.setLabel(label);

        map.addOverlay(marker);
        map.panTo(pt);
      }
      console.log('[' + item.longitude + ',' + item.latitude + ']' + item.equipName);
    });
  },function(error) {
    alert(error);
    console.log(error);
  });

  $scope.accessToken = function() {
    var token = localStorageService.get('token');
    return token.access_token;
  };

  $scope.getUserName = function() {
    return localStorageService.get("username");
  };

  $http.get(HOST + 'api/users/' + $scope.getUserName() + '?access_token=' + $scope.accessToken(),{})
  .success(function(data) {
    localStorageService.set("User", data);
  }).error(function(data, status){
    alert(status)
  });


}

// 设备列表
function FireControlController($scope, EquipService) {
  $scope.config = {
    errormsg: false,
    infinite: true,
    per_page: 10,
    page: 0,
    equips: []
  };

  $scope.loadAll = function(callback) {
    EquipService.query(
    {page: $scope.config.page, per_page: $scope.config.per_page},
    function(result, headers) {
      var map = new BMap.Map("container");
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          angular.forEach(result, function(item) {
            if (item.longitude && item.latitude) {
              var point2 = new BMap.Point(item.longitude,item.latitude);
              var distance = parseInt(map.getDistance(r.point,point2));
              if (distance < 1000) {
                item.distance = parseInt(distance) + 'm';
              } else {
                distance = (distance/1000).toFixed(1);
                item.distance = parseInt(distance) + 'km';
              }
            } else {
              item.distance = '0m';
            }
          });
          $scope.config.equips  =  $scope.config.equips.concat(result);
          $scope.config.page = $scope.config.page + 1;
          $scope.config.infinite = $scope.config.page < headers('pages');
          callback && callback();
        } else {
          alert('failed' + this.getStatus());
        }
      },{enableHighAccuracy: true});
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
      equips: []
    };

    $scope.loadAll(function() {
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

}

// 设备功能列表(设备详细, 监控数据, 状态信息)
function FireControlListController($scope, $stateParams) {
  $scope.id = $stateParams.id;
}

// 设备详细
function FireControlDetailController($scope, $stateParams, EquipService) {
  EquipService.get({id: $stateParams.id}, function(result) {
    $scope.equip = result;
  });
}

// 监控数据
function FireControlMonitorController($scope, $stateParams, $timeout, EquipService) {
  $scope.labels = ["管(1)", "管(2)", "管(3)", "管(4)"];
  $scope.series = ['颗粒浓度(%)'];
  var timer;

  $scope.getEquipMonitorDatas = function() {
    EquipService.getEquipMonitorDatas({id: $stateParams.id}, function(result) {
      // debugger;
      // result.EquipMonitorData : ifd// result.EquipTemperature  : 温度 // result.EquipAirflow : 空气
      $scope.equip = result.EquipMonitorData;
      $scope.data = [
        [
          $scope.equip.fireValue1,
          $scope.equip.fireValue2,
          $scope.equip.fireValue3,
          $scope.equip.fireValue4
        ]
      ];
    });
    timer = $timeout(function () {
      $scope.getEquipMonitorDatas();
    }, 10000);
  };

  $scope.getEquipMonitorDatas();

  $scope.$on('$destroy', function() {
    $timeout.cancel(timer);
  });

}

// 状态信息
function FireControlStatusController($scope, $stateParams, EquipStatusService) {
  $scope.config = {
    errormsg: false,
    infinite: true,
    per_page: 10,
    page: 0,
    equip: $stateParams.id,
    equipStateDatas: []
  };

  $scope.loadAll = function(callback) {
    EquipStatusService.query(
      {page: $scope.config.page, per_page: $scope.config.per_page, equip: $stateParams.id},
      function(result, headers) {
        //createDatatime: "2016-01-13 16:51:22"
        //destinationNum: 255
        //equip: null
        //faultCode: 0
        //faultMsg: "正常"
        //id: 1982135
        //originatingNum: 1
        //runState: null
        $scope.config.equipStateDatas  =  $scope.config.equipStateDatas.concat(result);
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
      equip: $stateParams.id,
      equipStateDatas: []
    };

    $scope.loadAll(function() {
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

}
