import angular from 'angular';
import {
  UseController,
  }
from './use.controller';
import template from './use.jade';
import State from './use.state';

import './use.scss';

const module = angular.module('Tellius.viewModels.ml.use', []);
module.config(State);
module.component('mlUseViewModel', {
    bindings: {
        models: '<',
    },
    controller: UseController,
    template: template(),
});

export default module;
