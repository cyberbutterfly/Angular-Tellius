import angular from 'angular';
import DatasetAPI from './dataset.service';
// import DatasetAPIMock from './dataset.mock';


const module = angular.module('Tellius.api.dataset', []);

module.service('DatasetAPI', DatasetAPI);
// module.service('DatasetAPIMock', DatasetAPIMock);

export default module;
