'use strict';

angular.module('ifd').controller('LoginController', function ($rootScope, $scope, $state, $timeout, $http,$ionicLoading,
                                         localStorageService, Base64,HOST,$localStorage) {
  $scope.user = {};

  $scope.errors = {};
  $scope.data={"username":localStorageService.get("username"),"password":localStorageService.get("password")};
  $scope.rememberMe = true;
  //   $timeout(function (){angular.element('[ng-model="username"]').focus();});
  //   $timeout(function (){angular.element('[ng-model="username"]').focus();});
  $scope.show = function() {
    $ionicLoading.show({
      template: '登录中...'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };
  $scope.login = function () {
    $scope.show();
    var data = "username=" + $scope.data.username + "&password="
      + $scope.data.password + "&grant_type=password&scope=read%20write&" +
      "client_secret=mySecretOAuthSecret&client_id=IFDapp";
    $http.post(HOST+'oauth/token', data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization,   Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods": "GET, PUT, POST",
        "Authorization": "Basic " + Base64.encode("IFDapp" + ':' + "mySecretOAuthSecret")
      }
      //    res.header("Access-Control-Allow-Origin", "*");
      //res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization,   Content-Type, X-Requested-With");
      //res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    }).success(function (response) {
      //alert(angular.toJson(response));
      $scope.hide();
      var expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
      response.expires_at = expiredAt.getTime();
      localStorageService.set('token', response);
      localStorageService.set("username",$scope.data.username );
      localStorageService.set("password",$scope.data.password );
      $localStorage.response = response;
      $localStorage.username = $scope.data.username;
      $localStorage.password = $scope.data.password;

      $state.go('tab.equip');
    }).error(function(data, status, headers, config){
      $scope.hide();
      alert("登录出错"+data+"  "+status);
    });
  };
});
