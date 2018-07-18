import angular from 'angular';
import KMeansModel from './kmeans/kmeans';
import {
  ClusteringModelsController,
}
from './clustering-models.controller';
import template from './clustering-models.jade';

const module = angular.module('Tellius.viewModels.ml.models.clusteringModels', [
  KMeansModel.name,
]);
module.component('clusteringModels', {
  bindings: {
    targetVariable: '<',
    selectedModels: '<',
  },
  controller: ClusteringModelsController,
  template: template(),
});

export default module;
