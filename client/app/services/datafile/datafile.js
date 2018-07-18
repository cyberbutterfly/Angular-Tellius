import angular from 'angular';
import DatafileService from './datafile.service';
import apiWrapper from '../../api/wrapper/wrapper';

const module = angular.module('Tellius.services.Datafile', [
	apiWrapper.name,
]);

module.service('DatafileService', DatafileService);

export default module;
