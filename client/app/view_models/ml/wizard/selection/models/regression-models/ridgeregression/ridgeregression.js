import angular from 'angular';
import {
  RidgeRegressionController,
}
from './ridgeregression.controller';
import template from './ridgeregression.jade';

const module = angular.module(
  'Tellius.viewModels.ml.selection.models.ridgeregression', []);
module.component('ridgeRegressionModel', {
  bindings: {
    targetVariable: '<',
  },
  controller: RidgeRegressionController,
  template: template(),
});

export default module;
