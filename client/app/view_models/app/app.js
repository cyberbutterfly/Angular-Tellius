import angular from 'angular';
import uiRouter from 'angular-ui-router';
import State from './app.state';
import template from './app.jade';

const module = angular.module('Tellius.viewModels.app', [
  uiRouter,
]);

module.config(State);
module.component('layoutApp', {
  bindings: {
    datasets: '<',
  },
  template: template(),
});

export default module;
