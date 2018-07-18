import angular from 'angular';
import uiRouter from 'angular-ui-router';
//import highcharts from 'highcharts';

import Ctrl from './viz-legend.controller';
import template from './viz-legend.jade';

const VizLegendModule = angular.module('Tellius.viewModels.vizLegend', [
  uiRouter,
]);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      active: '=',
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
VizLegendModule.directive('vizLegend', () => new Component);

export default VizLegendModule;
