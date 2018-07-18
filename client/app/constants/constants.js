import angular from 'angular';
import {
  dateFormats,
} from './date-formats';
import {
  columnTypes,
} from './column-types';

const module = angular.module('Tellius.constants', []);

module.constant('DATE_FORMATS', dateFormats);
module.constant('COLUMN_TYPES', columnTypes);

export default module;
