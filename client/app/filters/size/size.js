import angular from 'angular';
import SizeFilter from './size.filter';
import SizeFilterConfig from './size.provider';

const module = angular.module('Tellius.filters.size', []);
module.filter('size', SizeFilter);
module.provider('SizeFilterConfig', SizeFilterConfig);

export default module;
