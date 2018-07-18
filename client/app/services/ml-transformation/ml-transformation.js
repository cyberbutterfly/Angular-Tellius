import angular from 'angular';
import {
  MLTransformation,
}
from './ml-transformation.service';

const module = angular.module('Tellius.services.MLTransformation', []);
module.service('MLTransformation', MLTransformation);

export default module;
