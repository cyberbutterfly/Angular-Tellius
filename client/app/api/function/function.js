import angular from 'angular';
import { FunctionAPI } from './function.service';

export default angular
  .module('Tellius.api.function', [])
  .service('FunctionAPI', FunctionAPI);

