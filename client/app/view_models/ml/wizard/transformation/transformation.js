import angular from 'angular';
import uiRouter from 'angular-ui-router';
import State from './transformation.state';
import {
  TransformationController,
}
from './transformation.controller';
import template from './transformation.jade';

import './transformation.scss';

import columnOptions from
  './ml-feature-column-options/ml-feature-column-options';

const module = angular.module('Tellius.viewModels.ML.transformation', [
  uiRouter,
  columnOptions.name,
]);

module.config(State);
module.component('mlTransformation', {
  bindings: {
    options: '<',
    formState: '<',
  },
  controller: TransformationController,
  template: template(),
});

export default module;
