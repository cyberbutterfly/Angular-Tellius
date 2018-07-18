import angular from 'angular';
import {
  ROCController,
}
from './ROC.controller';
import template from './ROC.jade';

const module = angular.module('Tellius.viewModels.ml.charts.ROC', []);
module.component('rocChart', {
  bindings: {
    rocData: '<',
  },
  controller: ROCController,
  template: template(),
});

export default module;
