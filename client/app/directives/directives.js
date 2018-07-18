import angular from 'angular';
import Spinner from './spinner/spinner';
import toggleActive from './toggle-active/toggle-active';
import toggleActiveInput from './toggle-active/toggle-active-input';
import resizeHeight from './resize-height/resize-height';
import resizeElementWidth from './resize-element-width/resize-element-width';
import tooltip from './tooltip/tooltip';
import top from './top/top';
import randomBgColor from './random-bg-color/random-bg-color';

const module = angular.module('Tellius.directives', [
  Spinner.name,
  toggleActive.name,
  toggleActiveInput.name,
  resizeHeight.name,
  resizeElementWidth.name,
  tooltip.name,
  top.name,
  randomBgColor.name,
]);

export default module;
