import angular from 'angular';

import Controller from './settings-groups-add-members.controller';
import template from './settings-groups-add-members.jade';
import State from './settings-groups-add-members.state';
import './settings-groups-add-members.scss';

const module = angular.module('Tellius.popups.settingsGroupsAddMembers', []);

module.config(State);
module.component('settingsGroupsAddMembersPopup', {
  bindings: {
    candidateMembers: '<',
    submitSelectedMembers: '&',
  },
  controller: Controller,
  template: template(),
});

export default module;
