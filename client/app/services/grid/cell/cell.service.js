import template from './cell.context-menu.jade';

export class CellService {
  /*@ngInject*/
  constructor($rootScope, ContextMenuService, ColumnAPI, ngDialog) {
    this.$rootScope = $rootScope;

    this.ContextMenuService = ContextMenuService;
    this.ColumnAPI          = ColumnAPI;
    this.ngDialog           = ngDialog;
    this.scope              = this.$rootScope.$new(true);

    this.scope.columnName = null;
    this.scope.columnType   = null;
    this.scope.cellValue  = null;

    this.scope.process         = this.process.bind(this);
  }

  process(type) {
    this.ColumnAPI.handleNull(this.scope.selectedColumn, type);
  }

  onCellContextMenu(process) {
    process.event.preventDefault();
    this.scope.cellValue = process.value;
    this.scope.columnType  = process.colDef.dataType;

    //if (process.value === 0 || process.value.length === 0) {
    this.scope.columnName = process.colDef.field;

    this.ContextMenuService.onContextMenu(process.event, {
      template: template(),
      scope: this.scope,
    });
    //}
  }
}
