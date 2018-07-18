import angular from 'angular';

import Ctrl from './drill.controller';
import template from './drill.jade';

const DrillModule = angular.module('Tellius.viewModels.Drill', [
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
DrillModule.directive('drill', () => new Component);

export default DrillModule;
