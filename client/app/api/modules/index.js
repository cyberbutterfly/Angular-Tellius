import angular from 'angular';
import ModulesModel from './modules.model';

const module = angular.module('Tellius.api.modules', []);
module.service('ModulesModel', ModulesModel);

export default module;
