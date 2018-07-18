import angular from 'angular';
import UserService from './user.service';
import apiWrapper from '../../api/wrapper/wrapper';

const module = angular.module('Tellius.services.User', [
		apiWrapper.name,
	])
	.config( /*@ngInject*/ $authProvider => {
		$authProvider.loginUrl = '/login';
	});

module.service('UserService', UserService);

export default module;
