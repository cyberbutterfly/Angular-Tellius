import angular from 'angular';
import {
  KMeansModelController,
}
from './kmeans.controller';
import template from './kmeans.jade';

const module = angular.module('Tellius.viewModels.ml.clustering-models.kmeans', []);
module.component('kmeansModel', {
  bindings: {
    targetVariable: '<',
  },
  controller: KMeansModelController,
  template: template(),
});

export default module;
