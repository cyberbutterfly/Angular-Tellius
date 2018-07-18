import angular from 'angular';
import DrillService from './drill.service';

const module = angular.module('Tellius.services.Drill', [
]);

module.service('DrillService', DrillService);

export default module;
