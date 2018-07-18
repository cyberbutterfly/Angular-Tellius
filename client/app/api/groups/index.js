import angular from 'angular';
import GroupsModel from './groups.model';

const module = angular.module('Tellius.api.groups', []);
module.service('GroupsModel', GroupsModel);

export default module;
