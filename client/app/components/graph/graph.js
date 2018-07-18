import angular from 'angular';
import uiRouter from 'angular-ui-router';
//import highcharts from 'highcharts';
import Ctrl from './graph.controller';
import template from './graph.jade';
import './graph.styl';

const GraphModule = angular.module('Tellius.viewModels.Graph', [
  uiRouter,
])

GraphModule
  .config( /*@ngInject*/($stateProvider) => {
    $stateProvider
      .state('app.dashboard.chart', {
        url: '/chart',
        template: `<graph></graph>`,
      });
  });

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      file: '=',
      viz: '=',
      vizpad: '=',
      data: '=',
      fromDirective: '='
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
GraphModule.directive('graph', () => new Component);

export default GraphModule;
