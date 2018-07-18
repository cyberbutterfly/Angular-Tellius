import angular from 'angular';
import {
  ConfirmService,
} from './confirm.service';

const module = angular.module('Tellius.service.confirm', []);

module.service('ConfirmService', ConfirmService);

export default module;
