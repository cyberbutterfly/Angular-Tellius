import angular from 'angular';
import {
  EvaluateAPI,
}
from './evaluate.service';

const module = angular.module('Tellius.api.evaluate', []);
module.service('EvaluateAPI', EvaluateAPI);

export default module;
