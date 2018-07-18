import angular from 'angular';
import TREE_REGRESSION from './tree-regression/tree-regression';
import RIDGE_REGRESSION from './ridgeregression/ridgeregression';
import LINEAR_REGRESSION from './linearregression/linearregression';
import {
  RegressionModelsController,
}
from './regression-models.controller';
import template from './regression-models.jade';

const module = angular.module(
  'Tellius.viewModels.ml.selection.models.regression', [
    TREE_REGRESSION.name,
    RIDGE_REGRESSION.name,
    LINEAR_REGRESSION.name,
  ]);

module.component('regressionModels', {
  bindings: {
    targetVariable: '<',
    selectedModels: '<',
  },
  controller: RegressionModelsController,
  template: template(),
});

export default module;
