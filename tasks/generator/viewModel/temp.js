import angular from 'angular';
import uiRouter from 'angular-ui-router';

import Ctrl from './<%= name %>.controller';
import template from './<%= name %>.jade';

const VMModule = angular.module('Tellius.viewModels.<%= name %>', [
  uiRouter,
]);

VMModule
  .config(($stateProvider) => {
    $stateProvider
      .state('<%= name %>', {
        url: '/<%= name %>',
        template: `<<%= name %>-view-model></<%= name %>-view-model>`,
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
 * @name <%= name %>ViewModel
 * @public
 */
VMModule.directive('<%= name %>ViewModel', () => new Component);

export default VMModule;
