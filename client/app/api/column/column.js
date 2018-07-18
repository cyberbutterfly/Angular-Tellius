import angular from 'angular';
import columnAPIMock from './column.mock';
import columnAPI from './column.service';

const module = angular.module('Tellius.api.column', []);

module.service('columnAPIMock', columnAPIMock);
module.service('ColumnAPI', columnAPI);

export default module;
