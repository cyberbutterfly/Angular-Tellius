import angular from 'angular';
import { AddNodePopupCtrl } from './add-node.controller';
import template from './add-node.jade';

const module = angular.module('Tellius.viewModels.dataflow.addNode', []);

class Component {
  constructor() {
    this.restrict         = 'AE';
    this.scope            = {};
    this.template         = template;
    this.controller       = AddNodePopupCtrl;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}

module.directive('addNodePopup', () => new Component);

export default module;
