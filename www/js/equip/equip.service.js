'use strict';

angular.module('ifd')
  .factory('EquipService', function ($resource, DateUtils, HOST, User) {
    // EquipResource.java
    return $resource(HOST + 'api/equips/:id', {access_token: User.token()}, {
      'query': { method: 'GET', isArray: true},
      'get': {
        method: 'GET',
        transformResponse: function (data) {
          data = angular.fromJson(data);
          data.createDate = DateUtils.convertLocaleDateFromServer(data.createDate);
          return data;
        }
      },
      'getEquipMonitorDatas': {
        method: 'GET',
        url: HOST + 'api/equipMonitorDatas/cache/:id'
      }
    });
  })
  .factory('EquipStatusService', function ($resource, DateUtils, HOST, User) {
    // EquipStateDataResource.java
    return $resource(HOST + 'api/equipStateDatas/:id', {access_token: User.token()}, {
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

