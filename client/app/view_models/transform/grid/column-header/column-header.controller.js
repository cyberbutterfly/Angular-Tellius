import angular from 'angular';
import template from './column-header-contextmenu.jade';

class ColumnHeaderCtrl {
  /*@ngInject*/
  constructor($scope, $rootScope, ColumnAPI, ngDialog, FilterService) {
    let vm = this;

    vm.ColumnAPI = ColumnAPI;
    vm.ngDialog = ngDialog;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    this.FilterService = FilterService;

    vm.columnName = vm.colDef.field;
    vm.fileType = vm.colDef.dataType;
    vm.initialValue = angular.copy(vm.colDef);

    vm.contextMenuOptions = {
      template: template(),
      scope: $scope,
    };
  }

  onKeydown($event) {
    if ($event.keyCode === 13) {
      this.renameColumnName();
      $event.preventDefault();
      $event.stopPropagation();
      return false;
    }
  }

  renameColumnName() {
    let vm = this;

    vm.ColumnAPI.renameColumn(vm.initialValue.field, vm.columnName);
  }

  sort(type) {
    let vm = this;

    vm.ColumnAPI.sort(vm.columnName, type);
  }

  isHandleNull() {
    const {
      mainType,
      mainTypePercentage,
    } = this.colDef.typeStats;
    return mainType === 'string' && mainTypePercentage < 50;
  }

  handleColumnsPopup() {
    const scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
      cellValue: this.cellValue,
      columnType: this.fileType,
    });

    this.ngDialog.open({
      template: `<handle-columns-popup
      close-this-dialog="closeThisDialog()"
      column-type="columnType"
      column-name="columnName"></handle-columns-popup>`,
      plain: true,
      scope: scope,
    });
  }

  filterPopup() {
    const scope = this.$rootScope.$new();

    Object.assign(scope, {
      columnName: this.columnName,
      cellValue: this.cellValue,
      columnType: this.fileType,
    });

    this.ngDialog.open({
      template: `<filter-popup
      cell-value="cellValue"
      column-type="columnType"
      column-name="columnName"></filter-popup>`,
      plain: true,
      scope: scope,
    });
  }

}

export default ColumnHeaderCtrl;
