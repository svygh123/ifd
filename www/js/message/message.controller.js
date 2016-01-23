'use strict';

angular.module('ifd')
        .controller('MessageController', MessageController)    // 消息
        .controller('UserListController', UserListController)  // 发消息-选择对象
        .controller('SendMsgController', SendMsgController);   // 发消息

// 消息
function MessageController($scope, RecentMessageService, User) {
  $scope.config = {
    messages: [],
    userId: User.user().login
  };

  RecentMessageService.getMsgListByUserId(
    { id: User.user().login },
  function(result, headers) {
    $scope.config.messages  =  $scope.config.messages.concat(result);
  },function(error) {
    alert(error);
  });

}

// 发消息-选择对象
function UserListController($scope, MessageService, User) {

  $scope.config = {
    errormsg: false,
    infinite: true,
    per_page: 10,
    page: 0,
    login: User.user().login,
    users: []
  };

  $scope.loadAll = function(callback) {
    MessageService.getUserList(
      {page: $scope.config.page, per_page: $scope.config.per_page, login: User.user().login},
      function(result, headers) {
        $scope.config.users  =  $scope.config.users.concat(result);
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
      login: User.user().login,
      users: []
    };

    $scope.loadAll(function() {
      $scope.$broadcast('scroll.resize');
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

}

// 发消息
function SendMsgController($scope, $stateParams, User, MessageService, $ionicScrollDelegate, $cordovaKeyboard) {
  $scope.params = {
    userName : $stateParams.targetName?$stateParams.targetName:$stateParams.targetId
  };
  $scope.config = {
    messages : []
  };

  // 聊天记录
  MessageService.getMsgListByTarget(
    { me: $stateParams.userId, targetId: $stateParams.targetId },
  function(result, headers) {
    $scope.config.messages  =  $scope.config.messages.concat(result);
  },function(error) {
    alert(error);
  });

  // 发送
  $scope.send = function() {
    var content = document.getElementById('content').value;

    if ( content != null && content != '') {
      $scope.message = {
        id: '',
        content: content,
        userId: User.user().login,
        targetId: $stateParams.targetId,
        type: 'chat',
        createTime: new Date().valueOf()
      };

      var msg = [
        '<div class="item item-avatar-right scroll-content">',
        '	<img src="img/ionic.png">',
        '	<pre class="msg-right">',content,
        '	</pre>',
        '</div>'
      ].join("");
      // 界面发送
      document.getElementById('pushContent').innerHTML += msg;
      // 发送后滚动到底部
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
      // 后台发送
      MessageService.save($scope.message, function(result) {
          console.log("save ok");
          document.getElementById('content').value = '';
        }, function(err) {
          console.log("occur error");
        }
      );
    }
  };
}
