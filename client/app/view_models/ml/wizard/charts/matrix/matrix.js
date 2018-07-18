import angular from 'angular';
import template from './matrix.jade';
import {
  MatrixController,
} from './controller';

const module = angular.module('Tellius.viewModels.ml.charts.matrix', []);
module.component('matrixChart', {
  bindings: {
    matrixData: '<',
  },
  controller: MatrixController,
  template: template(),
});

export default module;
