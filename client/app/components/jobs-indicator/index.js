import angular from 'angular';
import controller from './jobs-indicator';
import template from './jobs-indicator.jade';
import './jobs-indicator.scss';

const module = angular.module('Tellius.components.jobsIndicator', []);

module.component('jobsIndicator', {
  controller,
  template: template(),
});

export default module;
