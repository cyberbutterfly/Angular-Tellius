import angular from 'angular';
import {
  NavSidebarComponent,
}
from './nav-sidebar.component';

const module = angular.module('Tellius.components.navSidebar', []);

module.directive('navSidebar', () => new NavSidebarComponent);

export default module;
