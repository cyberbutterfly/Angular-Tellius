import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './cassandra.state';
import {
  Controller,
}
from './cassandra.controller';
import template from './cassandra.jade';

const module = angular.module('Tellius.viewModels.create.cassandra', [
  uiRouter,
]);

module.config(State);
module.component('createDatasetCassandra', {
  bindings: {
    options: '<',
  },
  controller: Controller,
  template: template(),
});

export default module;
