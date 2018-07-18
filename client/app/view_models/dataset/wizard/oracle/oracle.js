import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './oracle.state';
import {
  Controller,
}
from './oracle.controller';
import template from './oracle.jade';

const module = angular.module('Tellius.viewModels.create.oracle', [
  uiRouter,
]);

module.config(State);
module.component('createDatasetOracle', {
  bindings: {
    options: '<',
  },
  controller: Controller,
  template: template(),
});

export default module;
