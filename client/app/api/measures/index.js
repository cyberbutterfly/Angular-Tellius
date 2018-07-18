import angular from 'angular';
import MeasuresModel from './service';

const module = angular.module('Tellius.api.measures', []);
module.service('MeasuresModel', MeasuresModel);

export default module;
