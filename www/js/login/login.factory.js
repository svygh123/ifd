'use strict';

angular.module('ifd')

.factory('FileAccessory', function ($resource, DateUtils, HOST) {
  return $resource(HOST + 'api/fileAccessorys/:id', {}, {
    'query': { method: 'GET', isArray: true},
    'get': {
      method: 'GET',
      transformResponse: function (data) {
        data = angular.fromJson(data);
        data.createDatetime = DateUtils.convertDateTimeFromServer(data.createDatetime);
        return data;
      }
    },
    'update': { method:'PUT' },
    'getListByBIdAndBType': {
      method: 'GET',
      url: HOST + 'api/fileAccessorys/:bussinessId/:bussinessType',
      isArray: true
    }
  });
});
