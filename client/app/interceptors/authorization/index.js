import angular from 'angular';
import Config from './config';
import Service from './service';

const module = angular.module('Tellius.interceptors.authorization', []);

module.config(Config);
module.service('AuthorizationInterceptor', Service);

export default module;
