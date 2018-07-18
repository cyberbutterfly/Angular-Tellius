import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import Ctrl from './viz-list.controller';
import template from './viz-list.jade';

const VMModule = angular.module('Tellius.viewModels.vizList', [
  uiRouter,
]);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
    	vizPadObj : '=',
      select : '&',
    };
    this.template         = template;
    this.controller       = Ctrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

VMModule.directive('vizList', () => new Component);

export default VMModule;
