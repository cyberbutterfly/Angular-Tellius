import angular from 'angular';

import { RenamePopupCtrl } from './rename-popup.controller';
import template from './rename-popup.jade';

const module = angular.module('Tellius.viewModels.transform.columnHeader.rename', []);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {
      columnName: '=',
      initialValue: '=',
    };
    this.template         = template;
    this.controller       = RenamePopupCtrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

module.directive('renamePopup', () => new Component);

export default module;
