import angular from 'angular';
import uiRouter from 'angular-ui-router';
import State from './list.state';
import  Ctrl from './list.controller';
import template from './list.jade';

import './list.scss';

const module = angular.module('Tellius.viewModels.dataset.list', [
  uiRouter,
]);

module.config(State);
module.component('datasetListViewModel', {
  controller: Ctrl,
  template: template(),
});

export default module;
