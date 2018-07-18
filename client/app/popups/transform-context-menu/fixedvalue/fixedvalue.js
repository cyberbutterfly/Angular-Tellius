import angular from 'angular';
import { FixedValueComponent } from './fixedvalue.component';

export default angular
  .module('Tellius.popup.fixedvalue', [])
  .directive('cellPopup', () => new FixedValueComponent);
