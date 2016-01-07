'use strict';

angular.module('ifd.directives', [])
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'AE',
      link: function(scope, element, attributes) {
        $rootScope.hideTabs = 'tabs-item-hide';
        scope.$on('$destroy', function() {
          $rootScope.hideTabs = '';
        });
      }
    };
  });
