import angular from 'angular';
import { PaneComponent } from './pane.component';

const module = angular.module('Tellius.components.tabs.pane', []);

module.directive('ngPane', () => new PaneComponent);

export default module;
