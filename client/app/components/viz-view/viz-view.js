import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import Ctrl from './viz-view.controller';
import template from './viz-view.jade';

const VMModule = angular.module('Tellius.viewModels.vizView', [
  uiRouter,
]);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
    	datasetId : '=',
    };
    this.template         = template;
    this.controller       = Ctrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

VMModule.directive('vizView', () => new Component);

export default VMModule;
