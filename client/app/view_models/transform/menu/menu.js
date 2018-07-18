import angular from 'angular';

import {
  MenuCtrl,
}
from './menu.controller';
import template from './menu.jade';
import './menu.scss';

const module = angular.module('Tellius.viewModels.transform.menu', []);

module.component('transformMenu', {
  bindings: {
    metadata: '<',
  },
  controller: MenuCtrl,
  template: template(),
});

export default module;
