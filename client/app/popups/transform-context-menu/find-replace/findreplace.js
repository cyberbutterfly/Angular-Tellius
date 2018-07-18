import angular from 'angular';
import { FindReplaceComponent } from './findreplace.component';

const module = angular.module('Tellius.popups.findReplace', []);

module.directive('findReplacePopup', () => new FindReplaceComponent());

export default module;
