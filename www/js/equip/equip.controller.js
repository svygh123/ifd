'use strict';

angular.module('ifd')
        .controller('EquipController', EquipController) // 设备
        .controller('EquipDetailController', EquipDetailController) // 详细信息(设备详细, 监控数据, 状态信息)
        .controller('MapMarkController', MapMarkController); // 详细信息 ->> 地图标注

// 设备
function EquipController($scope, $http, HOST, localStorageService, $timeout, EquipService) {
  $scope.buttons = [
    {icon: 'planet', text: '地图'},
    {icon: 'navicon-round', text: '列表'}
  ];
  $scope.activeButton = 0;
  $scope.setActiveButton = function(index) {
    $scope.activeButton = index;
    if ($scope.activeButton == 0) { // 设备
      document.getElementById("allmap").style.display="";
      document.getElementById("eqList").style.display="none";
    } else { // 列表
      document.getElementById("allmap").style.display="none";
      document.getElementById("eqList").style.display="";
    }
  };

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
    $scope.config.equips  =  $scope.config.equips.concat(result);
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

// 详细信息(设备详细, 监控数据, 状态信息)
function EquipDetailController($scope, $ionicHistory, $stateParams, $timeout, EquipService, EquipStatusService) {
  $scope.buttons = [
    {text: '设备详细'},
    {text: '监控数据'},
    {text: '状态信息'}
  ];
  $scope.activeButton = 0;
  $scope.setActiveButton = function(index) {
    $scope.activeButton = index;
    if ($scope.activeButton == 0) { // 设备详细
      document.getElementById("detail").style.display="";
      document.getElementById("monitor").style.display="none";
      document.getElementById("status").style.display="none";
    } else if ($scope.activeButton == 1) { // 监控数据
      document.getElementById("detail").style.display="none";
      document.getElementById("monitor").style.display="";
      document.getElementById("status").style.display="none";
    } else { // 状态信息
      document.getElementById("detail").style.display="none";
      document.getElementById("monitor").style.display="none";
      document.getElementById("status").style.display="";
    }
  };

  $scope.id = $stateParams.id;

  // 设备详细
  EquipService.get({id: $stateParams.id}, function(result) {
    $scope.equipDetail = result;
  });

  // 监控数据
  $scope.labels = ["管(1)", "管(2)", "管(3)", "管(4)"];
  $scope.series = ['颗粒浓度(%)'];
  var timer;

  $scope.getEquipMonitorDatas = function() {
    EquipService.getEquipMonitorDatas({id: $stateParams.id}, function(result) {
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

  // 状态信息
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

// 设备详细 ->> 地图标注
function MapMarkController($scope, $stateParams, EquipService) {
  $scope.equip = {longitude:null,latitude:null};
  var tmpMarker = {};
  var isEmptyObject = function(obj) {
    for (var name in obj) {
      return false;
    }
    return true;
  };

  EquipService.get({id: $stateParams.id}, function(result) {
    $scope.equip = result;

    var map = new BMap.Map("markmap"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
    map.enableScrollWheelZoom(true);   // 开启鼠标滚轮缩放
    map.addControl(new BMap.NavigationControl()); // 添加默认缩放平移

    var item = $scope.equip;

    if (item.longitude && item.latitude) {
      var pt = new BMap.Point(item.longitude, item.latitude);
      var marker = new BMap.Marker(pt);

      var status = item.faultMsg?item.faultMsg:'故障';
      var label = new BMap.Label('【'+ status + '】' + item.equipName + '<br>【地址】' + item.address, {offset: new BMap.Size(20, -10)});
      marker.setLabel(label);

      tmpMarker = marker;

      map.addOverlay(marker);
      map.panTo(pt);
    }

    var addMarker = function(e) {
      if (!isEmptyObject(tmpMarker)) {
        tmpMarker.remove(); // 移除旧位置
      }
      $scope.equip.longitude = e.point.lng;
      $scope.equip.latitude  = e.point.lat;

      var pt = new BMap.Point($scope.equip.longitude, $scope.equip.latitude);
      var marker = new BMap.Marker(pt);

      var label = new BMap.Label('【新位置】', {offset: new BMap.Size(20, -10)});
      marker.setLabel(label);

      tmpMarker = marker;

      map.addOverlay(marker);
      map.panTo(pt);
    };

    map.addEventListener("click", addMarker);

    // get-end>
  });

  $scope.save = function() {
    EquipService.update($scope.equip, function(result) {
      alert('更新地图标注成功');
    }, function(err) {
      alert('操作失败,错误码:' + err.status + ",错误描述:" + err.statusText);
      console.error(err);
    });
  };

}
