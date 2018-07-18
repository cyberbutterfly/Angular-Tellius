import angular from 'angular';
import uiRouter from 'angular-ui-router';
import AnalyticsListController from './list.controller';
import State from './list.state';
import template from './list.jade';
import './list.scss';

const module = angular.module('Tellius.viewModels.analytics.list', [
  uiRouter,
]);
module.config(State);
module.component('analyticsListViewModel', {
  controller: AnalyticsListController,
  bindings: {
    models: '<',
  },
  template: template(),
});

export default module;
