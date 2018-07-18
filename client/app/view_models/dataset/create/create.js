import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngFileUpload from 'ng-file-upload';

import {
  CreateController,
}
from './create.controller';
import State from './create.state';
import template from './create.jade';

import './create.scss';

const module = angular.module('Tellius.viewModels.create', [
  uiRouter,
  ngFileUpload,
]);

module.config(State);
module.component('createViewModel', {
  controller: CreateController,
  template: template(),
});

export default module;
