'use strict';

angular.module('ifd')
  .factory('MessageService', function ($resource, DateUtils, HOST, User) {
    // MessageResource.java
    return $resource(HOST + 'api/messages/:id', {access_token: User.token()}, {
      'query': { method: 'GET', isArray: true},
      'get': {
        method: 'GET',
        transformResponse: function (data) {
          data = angular.fromJson(data);
          data.createDate = DateUtils.convertLocaleDateFromServer(data.createDate);
          return data;
        }
      },
      'getUserList': {
        method: 'GET',
        url: HOST + 'api/users/user/:login',
        isArray: true
      },
      'getMsgListByTarget': {
        method: 'GET',
        url: HOST + 'api/messages/user',
        isArray: true
      },
    });
  });

