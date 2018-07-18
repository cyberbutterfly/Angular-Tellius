import angular from 'angular';
import DatasetResolve from './dataset-resolve';

const module = angular.module('Tellius.helpers.datasetResolve', []);

module.service('datasetResolve', DatasetResolve);

export default module;
