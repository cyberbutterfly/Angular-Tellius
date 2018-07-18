import angular from 'angular';
import uiRouter from 'angular-ui-router';
//import highcharts from 'highcharts';

import Ctrl from './viz-type.controller';
import template from './viz-type.jade';

const VizTypeModule = angular.module('Tellius.viewModels.vizType', [
  uiRouter,
]);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      active: '=',
      changeGraph: '=',
      viz: '=',
      createNew: '=',
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
VizTypeModule.directive('vizType', () => new Component);

export default VizTypeModule;
