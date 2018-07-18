import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './name.state';
import {
  DatasetNameController,
}
from './name.controller';
import template from './name.jade';

const module = angular.module('Tellius.viewModels.create.upload.name', [
  uiRouter,
]);

module.config(State);
module.component('datasetNameViewModel', {
  bindings: {
    options: '<',
  },
  controller: DatasetNameController,
  template: template(),
});

export default module;
