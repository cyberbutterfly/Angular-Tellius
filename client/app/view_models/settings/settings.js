import angular from 'angular';
import uiRouter from 'angular-ui-router';

import State from './settings.state';
import template from './settings.jade';
import './settings.scss';

import User from './user/user';
import Groups from './groups/groups';
import App from './app/app';

const module = angular.module('Tellius.viewModels.settings', [
  uiRouter,
  User.name,
  Groups.name,
  App.name,
]);

module.config(State);
module.component('settingsViewModel', {
  template: template(),
});

export default module;
