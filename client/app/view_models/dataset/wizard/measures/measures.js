import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './measures.state';
import {
  DatasetMeasuresController,
}
from './measures.controller';
import template from './measures.jade';

const module = angular.module('Tellius.viewModels.create.upload.measures', [
  uiRouter,
]);

module.config(State);
module.component('datasetMeasuresViewModel', {
  bindings: {
    options: '<',
    columns: '<',
    columnTypes: '<',
  },
  controller: DatasetMeasuresController,
  template: template(),
});

export default module;
