import angular from 'angular';
import Exclude from './exclude/exclude';
import SizeFilter from './size/size';
import SelectedFilter from './selected/selected';

const module = angular.module('Tellius.filters', [
  Exclude.name,
  SizeFilter.name,
  SelectedFilter.name,
]);

export default module;
