import angular from 'angular';
import ThemeColorPaletteService from './theme-color-palette.service';

const module = angular.module('Tellius.services.ThemeColorPalette', []);

module.service('ThemeColorPaletteService', ThemeColorPaletteService);

export default module;
