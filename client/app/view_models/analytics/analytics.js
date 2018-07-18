import angular from 'angular';
import uiRouter from 'angular-ui-router';
import list from './list/list';
import State from './analytics.state';
import template from './analytics.jade';

const module = angular.module('Tellius.viewModels.analytics', [
  uiRouter,
  list.name,
]);
module.config(State);
module.component('analyticsViewModel', {
  template: template(),
});

export default module;
