import angular from 'angular';
import { CellService } from './cell.service';


const module = angular.module('Tellius.services.Grid.cell', []);

module.service('CellService', CellService);

export default module;
