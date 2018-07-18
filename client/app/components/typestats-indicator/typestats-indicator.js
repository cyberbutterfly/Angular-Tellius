import angular from 'angular';
import template from './typestats-indicator.jade';

const module = angular.module('Tellius.components.typestatsIndicator', []);

module.component('typestatsIndicator', {
  bindings: {
    typestatsData: '<',
  },
  template: template(),
});

export default module;
