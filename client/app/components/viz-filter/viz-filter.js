import angular from 'angular';
import uiRouter from 'angular-ui-router';
//import highcharts from 'highcharts';

import Ctrl from './viz-filter.controller';
import template from './viz-filter.jade';

const VizFilterModule = angular.module('Tellius.viewModels.vizFilter', [
  uiRouter,
]);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      active: '=',
      filters: '=',
      viz: '='
    };
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
VizFilterModule.directive('vizFilter', () => new Component);

export default VizFilterModule;
