import angular from 'angular';
import ApiWrapper from './wrapper.provider';

const apiModule = angular.module('Tellius.api.wrapper', []);

apiModule.provider('ApiWrapper', ApiWrapper);

export default apiModule;
