import angular from 'angular';

import { SplitcolumnPopupCtrl } from './splitcolumn-popup.controller';
import template from './splitcolumn-popup.jade';

const module = angular.module('Tellius.viewModels.transform.columnHeader.splitcolumn', []);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      columnName: '=',
      renameColumn: '&',
    };
    this.template         = template;
    this.controller       = SplitcolumnPopupCtrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

module.directive('splitcolumnPopup', () => new Component);

export default module;
