import angular from 'angular';
import authorization from './authorization';

const module = angular.module('Tellius.interceptors', [
  authorization.name,
]);

export default module;
