import angular from 'angular';
import {
  topDirective,
}
from './top.directive';

const module = angular.module('Tellius.directives.top', []);

module.directive('top', topDirective);

export default module;
