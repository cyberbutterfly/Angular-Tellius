import angular from 'angular';
import uiRouter from 'angular-ui-router';

import SettingsGroupsController from './groups.controller';
import State from './groups.state';
import template from './groups.jade';

import Members from './members/members';
import Datasets from './datasets/datasets';
import Modules from './modules/modules';
import Permissions from './permissions/permissions';

const module = angular.module('Tellius.viewModels.settings.groups', [
  uiRouter,
  Members.name,
  Datasets.name,
  Modules.name,
  Permissions.name,
]);

module.config(State);
module.component('settingsGroupsViewModel', {
  controller: SettingsGroupsController,
  bindings: {
    groups: '<',
  },
  template: template(),
});

export default module;
