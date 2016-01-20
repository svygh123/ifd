// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ifd' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ifd.services' is found in services.js
// 'ifd.controllers' is found in controllers.js
angular.module('ifd', ['ionic', 'ifd.directives', 'LocalStorageModule', 'ngStorage', 'ngResource', 'ngCordova', 'chart.js'])
  //.constant('HOST', 'http://127.0.0.1:8080/')
  //.constant('HOST', 'http://221.226.119.246:8081/')
  .constant('HOST', 'http://cocosamurai.f3322.net:81/ifd/')

.run(function($ionicPlatform, $location, $rootScope, $ionicHistory, $cordovaKeyboard, localStorageService, User) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出
      //对主页面进行拦截

      if ($location.path() == '/tab/equip'
        || $location.path() == '/tab/alarm'
        || $location.path() == '/tab/msg'
        || $location.path() == '/tab/me'
        || $location.path() == '/login'   ) {
        if ($rootScope.backButtonPressedOnceToExit) {
          User.logout();
          /* $http.post(HOST+'api/logout').then(function() {
           localStorageService.remove("token");
           localStorageService.remove("User");
           });
           ionic.Platform.exitApp();*/
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          window.plugins.toast.showShortTop('再按一次退出系统');
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      } else if ($ionicHistory.backView()) {
        if ($cordovaKeyboard.isVisible()) {
          $cordovaKeyboard.close();
        } else {
          $ionicHistory.goBack();
        }
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        window.plugins.toast.showShortTop('再按一次退出系统');
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);

    //启动极光推送服务
    //window.plugins.jPushPlugin.init();
    //调试模式
    //window.plugins.jPushPlugin.setDebugMode(true);

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  // 设置tabs始终在底部显示(android默认在顶部显示)
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  //$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  //$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

   .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      cache: true,
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

  // Each tab has its own nav history stack:

  ////////////////////////////////////////equip////////////////////////////////////////////////////////////////////

  // 设备地图
  .state('tab.equip', {
    url: '/equip',
    cache: true,
    views: {
      'tab-equip': {
        templateUrl: 'templates/tab-equip.html',
        controller: 'EquipController'
      }
    }
  })

  // 设备列表
  .state('tab.fire-control', {
    url: '/equip/fire-control',
    views: {
      'tab-equip': {
        templateUrl: 'templates/equip/fire-control.html',
        controller: 'FireControlController'
      }
    }
  })
  .state('tab.fire-control-list', { // 设备详细功能:设备详细, 监控数据, 状态信息
    url: '/equip/{id}',
    views: {
      'tab-equip': {
        templateUrl: 'templates/equip/fire-control/fire-control-list.html',
        controller: 'FireControlListController'
      }
    }
  })
  .state('tab.fire-control-detail', { // ->> 设备详细
    url: '/equip/{id}',
    views: {
      'tab-equip': {
        templateUrl: 'templates/equip/fire-control/fire-control-detail.html',
        controller: 'FireControlDetailController'
      }
    }
  })
  .state('tab.fire-control-monitor', { // ->> 监控数据
    url: '/equip/{id}',
    views: {
      'tab-equip': {
        templateUrl: 'templates/equip/fire-control/fire-control-monitor.html',
        controller: 'FireControlMonitorController'
      }
    }
  })
  .state('tab.fire-control-status', { // ->> 状态数据
    url: '/equip/{id}',
    views: {
      'tab-equip': {
        templateUrl: 'templates/equip/fire-control/fire-control-status.html',
        controller: 'FireControlStatusController'
      }
    }
  })

  ////////////////////////////////////alarm////////////////////////////////////////////////////////////////////////

  // 预警
  .state('tab.alarm', {
    url: '/alarm',
    views: {
      'tab-alarm': {
        templateUrl: 'templates/tab-alarm.html',
        controller: 'AlarmController'
      }
    }
  })

  /////////////////////////////////////message///////////////////////////////////////////////////////////////////////

  //消息
  .state('tab.message', {
    url: '/msg',
    views: {
      'tab-message': {
        templateUrl: 'templates/tab-message.html',
        controller: 'MessageController'
      }
    }
  })
  .state('tab.users', { // 发消息-选择对象
    url: '/users',
    views: {
      'tab-message': {
        templateUrl: 'templates/message/tab-users.html',
        controller: 'UserListController'
      }
    }
  })
  .state('tab.send', { // 发消息-选择对象
    url: '/send/{id}',
    params: {
      userId: ':userId',
      targetId: ':targetId',
      targetName: ':targetName'
    },
    views: {
      'tab-message': {
        templateUrl: 'templates/message/tab-send.html',
        controller: 'SendMsgController'
      }
    }
  })

  /////////////////////////////////////me///////////////////////////////////////////////////////////////////////

  // 我
  .state('tab.me', {
    url: '/me',
    cache: true,
    views: {
      'tab-me': {
        templateUrl: 'templates/tab-me.html',
        controller: 'MeController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
