import angular from 'angular';
import UsersModel from './users.model';

const module = angular.module('Tellius.api.users', []);
module.service('UsersModel', UsersModel);

export default module;
