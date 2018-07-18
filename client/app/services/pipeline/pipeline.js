import angular from 'angular';
import PipelineService from './pipeline.service';

const module = angular.module('Tellius.services.PipelineService', []);
module.service('PipelineService', PipelineService);

export default module;
