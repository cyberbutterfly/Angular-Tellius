import angular from 'angular';
import {
  LinearRegressionModelController,
}
from './linearregression.controller';
import template from './linearregression.jade';

const module = angular.module(
  'Tellius.viewModels.ml.selection.linearregression', []);
module.component('linearRegressionModel', {
  bindings: {
    targetVariable: '<',
  },
  controller: LinearRegressionModelController,
  template: template(),
});

export default module;
