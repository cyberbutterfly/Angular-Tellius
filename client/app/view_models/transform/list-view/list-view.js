import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './list-view.state';
import Ctrl from './list-view.controller';
import template from './list-view.jade';
import './list-view.scss';

const module = angular.module('Tellius.viewModels.transform.list', [
  uiRouter,
]);

module.config(State);
module.component('gridListView', {
  bindings: {
    dataset: '=',
  },
  controller: Ctrl,
  template: template(),
});

export default module;
