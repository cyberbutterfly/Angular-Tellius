import angular from 'angular';
import uiRouter from 'angular-ui-router';

import {
  createDatasetCSVController,
}
from './csv.controller';
import template from './csv.jade';
import State from './csv.state';

const module = angular.module('Tellius.viewModel.create.csv', [
  uiRouter,
]);

module.config(State);
module.component('createDatasetCsv', {
  bindings: {
    options: '<',
  },
  controller: createDatasetCSVController,
  template: template(),
});

export default module;
