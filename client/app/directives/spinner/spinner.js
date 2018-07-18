import angular from 'angular';

const module = angular.module('Tellius.directive.spinner', []);

module.directive('loading', /*@ngInject*/ ($http, $rootScope) => {
  return {
    restrict: 'A',
    link: (scope, element) => {
      $rootScope.$on('LOADING_SHOW', () => {
        element.removeClass('ng-hide');
      });

      $rootScope.$on('LOADING_HIDE', () => {
        element.removeClass('ng-hide');
      });

      scope.isLoading = () => {
        return $http.pendingRequests.filter(i => i.spinner === true)
          .length > 0;
      };

      const listener = scope.$watch(scope.isLoading, value => {
        if (value) {
          element.removeClass('ng-hide');
        } else {
          element.addClass('ng-hide');
        }
      });

      scope.$on('$destroy', () => {
        listener();
      });
    },
  };
});

export default module;
