import angular from 'angular';
import uiRouter from 'angular-ui-router';

import {
  createDatasetJSONController,
}
from './json.controller';
import template from './json.jade';
import State from './json.state';

const module = angular.module('Tellius.viewModel.create.json', [
  uiRouter,
]);

module.config(State);
module.component('createDatasetJson', {
  bindings: {
    options: '<',
  },
  controller: createDatasetJSONController,
  template: template(),
});

export default module;
