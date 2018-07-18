import angular from 'angular';
import State from './error.state';
import template from './error.jade';

const module = angular.module('Tellius.viewModels.error', []);

module.config(State);
module.component('errorComponent', {
  bindings: {
    error: '<',
  },
  template: template(),
});

export default module;
