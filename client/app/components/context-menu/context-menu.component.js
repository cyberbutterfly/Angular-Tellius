import angular from 'angular';
import './context-menu.scss';

export class ContextMenuComponent {
    /*@ngInject*/
  constructor($rootScope, $document, $compile, ContextMenuService) {
    this.ContextMenuService = ContextMenuService;
    this.$rootScope         = $rootScope;
    this.$document          = $document;
    this.$compile           = $compile;
    this.restrict           = 'AE';
    this.scope              = {
      contextMenuOptions: '=',
    };
    this.controller         = angular.noop;
    this.controllerAs       = 'vm';
    this.bindToController   = true;
    this.link               = (scope, element) => {
      scope.vm.contextMenuOptions.close = this.ContextMenuService.close.bind(this.ContextMenuService);

      element.bind('contextmenu', (event) => {
        this.ContextMenuService.options = scope.vm.contextMenuOptions;
        this.ContextMenuService.onContextMenu.call(this.ContextMenuService, event);
      });

      scope.$on('$destroy', () => {
        element.unbind('contextmenu', this.ContextMenuService.onContextMenu.bind(this.ContextMenuService));
      });
    };
  }
}
