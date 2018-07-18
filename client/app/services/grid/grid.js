import angular from 'angular';
import CellModule from './cell/cell';
import GridService from './grid.service';

const module = angular.module('Tellius.services.Grid', [
  CellModule.name,
]);

module.service('GridService', GridService);

export default module;
