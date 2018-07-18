import angular from 'angular';
import {
  tooltipDirective,
}
from './tooltip.directive';

const module = angular.module('Tellius.directives.tooltip', []);

module.directive('tooltip', tooltipDirective);

export default module;
