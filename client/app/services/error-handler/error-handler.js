import angular from 'angular';
import ErrorHandlerService from './error-handler.service';

const module = angular.module('Tellius.services.ErrorHandler', []);

module.service('ErrorHandlerService', ErrorHandlerService);

export default module;
