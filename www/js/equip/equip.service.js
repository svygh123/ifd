'use strict';

angular.module('ifd')
  .factory('EquipService', function ($resource, DateUtils,HOST) {
    return $resource(HOST + 'api/equips/:id', {}, {
      'query': { method: 'GET', isArray: true}
    });
  });

