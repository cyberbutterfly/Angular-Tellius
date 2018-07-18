import angular from 'angular';
import JobsModel from './jobs.model';

const module = angular.module('Tellius.api.jobs', []);
module.service('JobsModel', JobsModel);

export default module;
