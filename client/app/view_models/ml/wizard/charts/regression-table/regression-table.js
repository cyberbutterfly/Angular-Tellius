import angular from 'angular';
import template from './regression-table.jade';

const module = angular.module('Tellius.viewModels.ml.compare.regressionTable', []);

module.component('mlRegressionTableViewModel', {
  bindings: {
    compareData: '<',
  },
  template: template(),
});

export default module;
