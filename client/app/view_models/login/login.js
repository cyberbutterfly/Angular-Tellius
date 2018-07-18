import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './login.state';
import Ctrl from './login.controller';
import template from './login.jade';
import './login.scss';

const module = angular.module('Tellius.viewModels.login', [
  uiRouter,
]);

module.config(State);
module.component('loginViewModel', {
  controller: Ctrl,
  template: template(),
});

export default module;
