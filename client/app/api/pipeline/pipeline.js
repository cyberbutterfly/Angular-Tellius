import angular from 'angular';
import PipelineAPI from './pipeline.service';
import PipelineAPIMock from './pipeline.mock';


const module = angular.module('Tellius.api.pipeline', []);

module.service('PipelineAPI', PipelineAPI);
module.service('PipelineAPIMock', PipelineAPIMock);

export default module;
