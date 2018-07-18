import angular from 'angular';
import ArrayUtils from './array-utils/array-utils';
import datasetResolve from './dataset-resolve';

const module = angular.module('Tellius.helpers', [
  ArrayUtils.name,
  datasetResolve.name,
]);

export default module;
