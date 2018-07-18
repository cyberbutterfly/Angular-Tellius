import angular from 'angular';
import controller from './jobs-list';
import template from './jobs-list.jade';

const module = angular.module('Tellius.components.jobsList', []);

module.component('jobsList', {
  bindings: {
    activeList: '=',
  },
  controller,
  template: template(),
});

export default module;
