import angular from 'angular';
import VizpadDataService from './vizpad-data.service';

const module = angular.module('Tellius.services.VizpadData', []);

module.service('VizpadDataService', VizpadDataService);

export default module;
