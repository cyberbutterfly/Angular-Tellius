import angular from 'angular';
import ClassificationModels from './classification-models/classification-models';
import RegressionModels from './regression-models/regression-models';
import ClusteringModels from './clustering-models/clustering-models';

const module = angular.module('Tellius.viewModels.ml.selection.models', [
  ClassificationModels.name,
  RegressionModels.name,
  ClusteringModels.name,
]);

export default module;
