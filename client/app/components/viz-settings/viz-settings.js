import angular from 'angular';
import uiRouter from 'angular-ui-router';
//import highcharts from 'highcharts';

import Ctrl from './viz-settings.controller';
import template from './viz-settings.jade';

const VizSettingsModule = angular.module('Tellius.viewModels.vizSettings', [
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
VizSettingsModule.directive('vizSettings', () => new Component);

export default VizSettingsModule;
