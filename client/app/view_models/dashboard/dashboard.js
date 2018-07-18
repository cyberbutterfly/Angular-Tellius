import angular from 'angular';
import uiRouter from 'angular-ui-router';

import template from './dashboard.jade';

const module = angular.module('Tellius.viewModels.dashboard', [
  uiRouter,
]);

module.config( /*@ngInject*/ $stateProvider => {
  $stateProvider
    .state('app.dashboard', {
      url: 'dashboard',
      template: `<dashboard-view-model></dashboard-view-model>`,
    });
});
module.component('dashboardViewModel', {
  template: template(),
});

export default module;
