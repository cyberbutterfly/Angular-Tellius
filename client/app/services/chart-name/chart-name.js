import angular from 'angular';
import ColorPaletteService from './chart-name.service';

const module = angular.module('Tellius.services.ChartNameService', []);

module.service('ChartNameService', ChartNameService);

export default module;
