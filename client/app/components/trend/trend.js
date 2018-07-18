import angular from 'angular';

import Ctrl from './trend.controller';
import template from './trend.jade';

const TrendModule = angular.module('Tellius.viewModels.Trend', [
])

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      selectedColumn: '=',
      selectedValue: '=',
      vizpad: '=',
      viz: '=',
    },
    this.template         = template;
    this.controller       = Ctrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}


/**
 * @ngdoc directive
 * @name loginViewModel
 * @public
 */
TrendModule.directive('trend', () => new Component);

export default TrendModule;
