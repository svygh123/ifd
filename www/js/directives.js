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
  })
  .directive('showImage', function(User) {
    return {
      restrict: 'E',
      replace: true,
      template: "<img>",
      scope: {
        url: '='
      },

      link: function (scope, $element, attrs) {
        User.getAvatar(scope.url,function(path){
          $element[0].src = path;
        });
      }
    }
  });
