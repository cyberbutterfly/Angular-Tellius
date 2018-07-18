import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SettingsGroupsPermissionsController from './permissions.controller';
import State from './permissions.state';
import template from './permissions.jade';

const module = angular.module('Tellius.viewModels.settings.groups.permissions', [
  uiRouter,
]);
module.config(State);
module.component('settingsGroupsPermissionsViewModel', {
  controller: SettingsGroupsPermissionsController,
  template: template(),
});

export default module;
