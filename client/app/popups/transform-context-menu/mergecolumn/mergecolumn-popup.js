import angular from 'angular';

import { MergePopupCtrl } from './mergecolumn-popup.controller';
import template from './mergecolumn-popup.jade';

const module = angular.module('Tellius.viewModels.transform.columnHeader.merge', []);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      columnName: '=',
      datasetColumns: '=',
    };
    this.template         = template;
    this.controller       = MergePopupCtrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

module.directive('mergePopup', () => new Component);

export default module;
