'use strict';

angular.module('ifd')
  .factory('AlarmService', function ($resource, DateUtils, HOST, User) {
    // FireAlarmResource.java
    return $resource(HOST + 'api/fireAlarms/:id', {access_token: User.token()}, {
      'query': { method: 'GET', isArray: true},
      'get': {
        method: 'GET',
        transformResponse: function (data) {
          data = angular.fromJson(data);
          data.createDate = DateUtils.convertLocaleDateFromServer(data.createDate);
          return data;
        }
      }
    });
  });

