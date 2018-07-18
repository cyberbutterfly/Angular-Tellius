import angular from 'angular';
import { ArrayUtils } from './array-utils.service';

const module = angular.module('Tellius.helpers.arrayUtils', []);

module.service('ArrayUtils', ArrayUtils);

export default module;
