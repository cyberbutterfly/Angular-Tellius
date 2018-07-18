import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SettingsGroupsModulesController from './modules.controller';
import State from './modules.state';
import template from './modules.jade';

const module = angular.module('Tellius.viewModels.settings.groups.modules', [
  uiRouter,
]);
module.config(State);
module.component('settingsGroupsModulesViewModel', {
  controller: SettingsGroupsModulesController,
  bindings: {
    modules: '<',
  },
  template: template(),
});

export default module;
