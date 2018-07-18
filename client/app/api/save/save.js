import angular from 'angular';
import {
  SaveModel,
}
from './save.model';

const module = angular.module('Tellius.api.save', []);
module.service('SaveModel', SaveModel);

export default module;
