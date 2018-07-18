import angular from 'angular';

import { SplitrowsPopupCtrl } from './splitrows-popup.controller';
import template from './splitrows-popup.jade';

const module = angular.module('Tellius.viewModels.transform.columnHeader.splitrows', []);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      columnName: '=',
      renameColumn: '&',
    };
    this.template         = template;
    this.controller       = SplitrowsPopupCtrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

module.directive('splitrowsPopup', () => new Component);

export default module;
