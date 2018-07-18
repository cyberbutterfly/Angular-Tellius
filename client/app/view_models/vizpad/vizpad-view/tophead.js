import angular from 'angular';
import uiRouter from 'angular-ui-router';

import controller from './vizpad.controller';
import template from './tophead.jade';
import './vizpad.styl';

const TopheadModule = angular.module('Tellius.viewModels.vizpad.tophead', [
  uiRouter,
]);

class TopheadComponent {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.template = template;
    this.controller = controller;
    this.controllerAs = 'vm';
    this.bindToController = true;
  }
}
/**
 * @ngdoc directive
 * @name topheadModel
 * @public
 */
TopheadModule.directive('topheadModel', () => new TopheadComponent);



export default TopheadModule;
