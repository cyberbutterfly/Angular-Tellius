import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import Ctrl from './viz-library.controller';
import template from './viz-library.jade';

const VMModule = angular.module('Tellius.viewModels.vizLibrary', [
  uiRouter,
]);

VMModule
  .config(/*@ngInject*/($stateProvider) => {
    $stateProvider
      .state('app.vizpad.vizlibrary', {
        url: '/viz-library',
        template: `<viz-library></viz-library>`,
        parent: "app.vizpad",
      });
  });


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

VMModule.directive('vizLibrary', () => new Component);

export default VMModule;
