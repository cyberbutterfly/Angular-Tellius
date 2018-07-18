import angular from 'angular';
import template from './classification.jade';

const module = angular.module('Tellius.viewModels.ml.evaluate.classification', []);
module.component('evaluateClassification', {
  bindings: {
    measuresData: '<',
  },
  template: template(),
});

export default module;
