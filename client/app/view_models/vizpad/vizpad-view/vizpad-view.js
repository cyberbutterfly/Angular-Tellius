import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import Ctrl from './vizpad-view.controller';
import template from './vizpad-view.jade';
import './vizpad.styl';

const VMModule = angular.module('Tellius.viewModels.vizpadView', [
  uiRouter,
]);

VMModule
  .config(/*@ngInject*/ ($stateProvider) => {
    $stateProvider
      .state('app.vizpad.list', {
        url: '/list',
        template: `<vizpad-list-view-model></vizpad-list-view-model>`,
        parent: "app.vizpad",
      });
  });

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {};
    this.template         = template;
    this.controller       = Ctrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

/**
 * @ngdoc directive
 * @name vizpadViewModel
 * @public
 */
VMModule.directive('vizpadListViewModel', () => new Component);

export default VMModule;
