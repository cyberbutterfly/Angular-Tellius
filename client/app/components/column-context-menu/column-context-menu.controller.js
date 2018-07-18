import angular from 'angular';
import {
  isString,
}
from 'lodash/lang';

export class ColumnContextMenuController {
  /*@ngInject*/
  constructor(
    $rootScope,
    $scope,
    $state,
    ColumnAPI,
    ngDialog,
    ContextMenuService,
    DatasetStorageService,
    MLStorageService,
    ArrayUtils
  ) {
    this.initialValue = angular.copy(this.columnName);

    this.$scope = $scope;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.DatasetStorageService = DatasetStorageService;
    this.ArrayUtils = ArrayUtils;
    this.ContextMenuService = ContextMenuService;
    this.ColumnAPI = ColumnAPI;
    this.ngDialog = ngDialog;

    this.columns = this.DatasetStorageService.getColumns();

    this.ContextMenuService.once('CLOSE_CONTEXT_MENU', () => {
      this.$scope.$destroy();
    });
  }

  isEmpty() {
    
    if(this.columnType !== 'IntegerType') {
      return false;
    }

    const NullValues = [
      '',
    ];

    let isNull = NullValues.indexOf(this.cellValue) !== -1;

    return !!isNull;
  }

  setTargetVariable() {
    if (isString(this.columnName)) {
      const columnName = this.columnName;

      this.$state.go('app.ml.create', {
        targetVariable: columnName,
      });
    }

    this.ContextMenuService.close();
  }

  addColumnPopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
      columnType: this.columnType,
    });

    this.ngDialog.open({
      template: `<add-column-popup
      column-name="columnName"
      column-type="columnType"></add-column-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  findReplacePopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
    });

    this.ngDialog.open({
      template: `<find-replace-popup
      column-name="columnName"></find-replace-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  mergePopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
      columns: this.columns,
    });
    this.ngDialog.open({
      template: `<merge-popup
      column-name="columnName"
      dataset-columns="columns"></merge-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  splitRowsPopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
    });

    this.ngDialog.open({
      template: `<splitrows-popup
      column-name="columnName"></splitrows-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  splitColumnPopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
    });

    this.ngDialog.open({
      template: `<splitcolumn-popup
      column-name="columnName"></splitcolumn-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  delete() {
    this.ColumnAPI.delete(this.columnName)
      .then(() => {
        this.ContextMenuService.close();
      });
  }

  moveColumns(columns) {
    return this.ColumnAPI.moveColumn(columns)
      .then(() => {
        this.ContextMenuService.close();
      });
  }

  moveAfterNextColumn() {
    let result = this.ArrayUtils.moveNext(this.columnName, this.columns);

    return this.moveColumns(result);
  }

  moveBeforePreviousColumn() {
    let result = this.ArrayUtils.moveBefore(this.columnName, this.columns);

    return this.moveColumns(result);
  }

  moveColumnPopup(type) {
    if (angular.isUndefined(type)) {
      return false;
    }

    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
      columns: this.columns,
      type: type,
    });

    this.ngDialog.open({
      template: `<move-column-popup
      type="type"
      column-name="columnName"
      columns="columns"
      ></move-column-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  renamePopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
      columns: this.columns,
      initialValue: this.initialValue,
    });

    this.ngDialog.open({
      template: `<rename-popup
      column-name="columnName"
      initial-value="initialValue"></rename-popup>`,
      plain: true,
      scope: scope,
    });
    this.ContextMenuService.close();
  }

  filterPopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
      cellValue: this.cellValue,
      columnType: this.columnType,
    });

    this.ngDialog.open({
      template: `<filter-popup
      cell-value="cellValue"
      column-type="columnType"
      column-name="columnName"></filter-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  handleNull(type) {
    const TYPES = [
      'zero',
      'mean',
      'ignore',
    ];

    if (TYPES.indexOf(type) !== -1) {
      this.ColumnAPI.handleNull(this.columnName, type);
    }
  }

  fixedValuePopup() {
    let scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
    });

    this.ngDialog.open({
      template: `<cell-popup
      column-name="columnName"></cell-popup>`,
      plain: true,
      scope: scope,
    });

    this.ContextMenuService.close();
  }

  renameColumnName() {
    this.ColumnAPI.renameColumn(this.initialValue, this.columnName);
  }

}
