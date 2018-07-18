import angular from 'angular';
import JobsStorage from './jobs-storage';

const module = angular.module('Tellius.services.JobsStorage', []);
module.service('JobsStorage', JobsStorage);

export default module;
