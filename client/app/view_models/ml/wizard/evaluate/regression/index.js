import angular from 'angular';
import controller from './regression';
import template from './regression.jade';

const module = angular.module('Tellius.viewModels.ml.evaluate.regression', []);
module.component('evaluateRegression', {
  bindings: {
    measuresData: '<',
  },
  controller,
  template: template(),
});

export default module;
