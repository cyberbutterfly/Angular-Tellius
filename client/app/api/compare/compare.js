import angular from 'angular';
import {
  CompareAPI,
}
from './compare.service';

const module = angular.module('Tellius.api.compare', []);
module.service('CompareAPI', CompareAPI);

export default module;
