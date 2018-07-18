import angular from 'angular';
import {
  PredictAPI,
}
from './predict.service';

const module = angular.module('Tellius.api.predict', []);
module.service('PredictAPI', PredictAPI);

export default module;
