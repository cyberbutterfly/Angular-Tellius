import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Models from './models/models';
import State from './selection.state';
import {
  SelectionController,
}
from './selection.controller';
import template from './selection.jade';

import './selection.scss';

const module = angular.module('Tellius.viewModels.MLSelection', [
  Models.name,
  uiRouter,
]);

module.config(State);
module.component('mlSelectionViewModel', {
  controller: SelectionController,
  bindings: {
    options: '<',
    formState: '<',
  },
  template: template(),
});

export default module;
