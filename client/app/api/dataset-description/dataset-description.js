import angular from 'angular';
import {
  DatasetDescriptionModel,
}
from './dataset-description.model';

const module = angular.module('Tellius.api.datasetDescription', []);
module.service('DatasetDescriptionModel', DatasetDescriptionModel);

export default module;
