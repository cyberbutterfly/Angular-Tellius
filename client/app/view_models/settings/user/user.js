import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SettingsUserController from './user.controller';
import State from './user.state';
import template from './user.jade';

const module = angular.module('Tellius.viewModels.settings.user', [
  uiRouter,
]);
module.config(State);
module.component('settingsUserViewModel', {
  controller: SettingsUserController,
  bindings: {
    profile: '<',
  },
  template: template(),
});

export default module;
