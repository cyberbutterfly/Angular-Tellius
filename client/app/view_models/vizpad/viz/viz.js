import angular from 'angular';
import uiRouter from 'angular-ui-router';
import $ from 'jquery';

import Ctrl from './viz.controller';
import template from './viz.jade';

const VMModule = angular.module('Tellius.viewModels.viz', [
  uiRouter,
]);

VMModule
  .config(/*@ngInject*/ ($stateProvider) => {
    $stateProvider
      .state('app.vizpad.viz', {
        url: '/viz/:vizId',
        template: `<viz-view-model></viz-view-model>`,
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
 * @name vizViewModel
 * @public
 */
VMModule.directive('vizViewModel', () => new Component);

export default VMModule;
