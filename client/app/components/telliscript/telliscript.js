import angular from 'angular';
import {
  TelliscriptComponent,
}
from './telliscript.component';

const module = angular.module('Tellius.components.telliscript', []);
module.directive('telliscript', () => new TelliscriptComponent);

export default module;
