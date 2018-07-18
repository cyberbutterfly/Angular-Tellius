import angular from 'angular';
import Ctrl from './draw-graph.controller';
import template from './draw-graph.jade';

const Module = angular.module('Tellius.components.DrawGraph', [])

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      highchartsObj: '=',
      viz: '=',
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
Module.directive('drawGraph', () => new Component);

export default Module;
