import angular from 'angular';
import { MLAPI } from './ml.service';


const module = angular.module('Tellius.api.ML', []);
module.service('MLAPI', MLAPI);

export default module;
