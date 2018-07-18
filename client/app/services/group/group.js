import angular from 'angular';
import GroupService from './group.service';
import apiWrapper from '../../api/wrapper/wrapper';

const module = angular.module('Tellius.services.Group', [
		apiWrapper.name,
	]);

module.service('GroupService', GroupService);

export default module;
