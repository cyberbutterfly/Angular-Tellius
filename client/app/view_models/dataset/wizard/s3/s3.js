import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './s3.state';
import {
  CreateDatasetController,
}
from './s3.controller';
import template from './s3.jade';

const module = angular.module('Tellius.viewModels.create.s3', [
  uiRouter,
]);

module.config(State);
module.component('createDatasetS3', {
  bindings: {
    options: '<',
  },
  controller: CreateDatasetController,
  template: template(),
});

export default module;
