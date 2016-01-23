'use strict';

angular.module('ifd.directives', [])
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'AE',
      link: function(scope, element, attributes) {
        scope.$on('$ionicView.enter', function() {
          $rootScope.hideTabs = 'tabs-item-hide';
        });

        scope.$on('$ionicView.beforeLeave', function() {
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
