import angular from 'angular';
import MeasuresController from './measures.controller';
import template from './measures.jade';

const module = angular.module('Tellius.viewModels.ml.charts.measures', []);
module.component('measuresChart', {
  bindings: {
    measuresData: '<',
  },
  template: template(),
  controller: MeasuresController,
});

export default module;
