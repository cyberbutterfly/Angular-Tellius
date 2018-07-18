import angular from 'angular';
import {
  TreeRegresssionController,
}
from './tree-regression.controller';
import template from './tree-regression.jade';

const module = angular.module(
  'Tellius.viewModels.ml.selection.models.treeRegression', []);

module.component('treeRegressionModel', {
  bindings: {
    targetVariable: '<',
  },
  controller: TreeRegresssionController,
  template: template(),
});

export default module;
