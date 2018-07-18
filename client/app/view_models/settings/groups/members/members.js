import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SettingsGroupsMembersController from './members.controller';
import State from './members.state';
import template from './members.jade';

const module = angular.module('Tellius.viewModels.settings.groups.members', [
  uiRouter,
]);
module.config(State);
module.component('settingsGroupsMembersViewModel', {
  controller: SettingsGroupsMembersController,
  template: template(),
});

export default module;
