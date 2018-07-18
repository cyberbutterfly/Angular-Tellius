import angular from 'angular';
import uiRouter from 'angular-ui-router';

import Ctrl from './chartview.controller';
import template from './chartview.jade';
import './chartview.styl';

const VMModule = angular.module('Tellius.viewModels.chartview', [
  uiRouter,
]);

VMModule
  .config( /*@ngInject*/($stateProvider) => {
    $stateProvider
      .state('app.vizpad.chartview', {
        url: '/view/:vizpadId',
        template: `<chartview-view-model></chartview-view-model>`,
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
 * @name chartviewViewModel
 * @public
 */
VMModule.directive('chartviewViewModel', () => new Component);

export default VMModule;
