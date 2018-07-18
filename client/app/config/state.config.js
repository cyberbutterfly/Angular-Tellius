import angular from 'angular';
import uiRouter from 'angular-ui-router';

const module = angular.module('Tellius.config.state', [
  uiRouter,
]);

module.config( /*@ngInject*/ $urlRouterProvider => {
  $urlRouterProvider.otherwise('/dashboard');
});

module.run( /*@ngInject*/ ($rootScope, $state, $stateParams) => {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});

export default module;
