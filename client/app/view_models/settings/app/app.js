import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SettingsAppController from './app.controller';
import State from './app.state';
import template from './app.jade';

const module = angular.module('Tellius.viewModels.settings.app', [
  uiRouter,
]);
module.config(State);
module.component('settingsAppViewModel', {
  controller: SettingsAppController,
  template: template(),
});

export default module;
