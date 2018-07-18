import angular from 'angular';
import ColorPaletteService from './color-palette.service';

const module = angular.module('Tellius.services.ColorPalette', []);

module.service('ColorPaletteService', ColorPaletteService);

export default module;
