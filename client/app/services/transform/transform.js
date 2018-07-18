import angular from 'angular';
import TransformService from './transform.service';
import apiWrapper from '../../api/wrapper/wrapper';

const module = angular.module('Tellius.services.Transform', [
	apiWrapper.name,
]);

module.service('TransformService', TransformService);

export default module;
