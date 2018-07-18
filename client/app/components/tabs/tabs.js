import angular from 'angular';
import PaneModule from './pane/pane';
import { TabsComponent } from './tabs.component';

const module = angular.module('Tellius.components.tabs', [
  PaneModule.name,
]);

module.directive('ngTabs', () => new TabsComponent);

export default module;
