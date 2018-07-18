import angular from 'angular';
import Ctrl from './column-header.controller';
import template from './column-header.jade';

const module = angular.module('Tellius.viewModels.transform.columnHeader', []);

class Component {
  constructor() {
    this.restrict = 'AE';
    this.scope = {
      colDef: '=',
      selectedColumn: '=',
      toggleColumn: '&',
      isSelectedColumn: '&',
      selectedStatsColumn: '=',
      statsColumn: '&',
      isNumberType: '&',
    };
    this.template = template;
    this.controller = Ctrl;
    this.controllerAs = 'vm';
    this.bindToController = true;
  }
}

module.directive('columnHeader', () => new Component);

export default module;
