import angular from 'angular';
import State from './create.state';
import {
  MLCreateController,
}
from './create.controller';
import template from './create.jade';

import './create.scss';

const module = angular.module('Tellius.viewModels.ml.create', []);
module.config(State);
module.component('mlCreateViewModel', {
  bindings: {
    targetVariable: '<',
  },
  template: template(),
  controller: MLCreateController,
});

export default module;
