import angular from 'angular';
import DatasetStorageService from './dataset-storage.service';

const module = angular.module('Tellius.services.DatasetStorage', []);

module.service('DatasetStorageService', DatasetStorageService);

export default module;
