import angular from 'angular';

import {
  ContextMenuComponent,
}
from './context-menu.component';
import {
  ContextMenuService,
}
from './context-menu.service';

const module = angular.module('Tellius.components.contextMenu', []);

module
  .service('ContextMenuService', ContextMenuService)
  .directive('contextMenu', ($rootScope, $document, $compile,
    ContextMenuService) => { //eslint-disable-line no-shadow
    return new ContextMenuComponent($rootScope, $document, $compile,
      ContextMenuService);
  });

export default module;
