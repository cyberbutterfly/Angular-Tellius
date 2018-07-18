import angular from 'angular';

import { AddColumnPopupCtrl } from './add-column.controller';
import template from './add-column.jade';

const module = angular.module('Tellius.viewModels.transform.columnHeader.addColumn', []);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      columnName: '=',
      columnType: '=',
    };
    this.template         = template;
    this.controller       = AddColumnPopupCtrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

module.directive('addColumnPopup', () => new Component);

export default module;
