export class MergePopupCtrl {
  /*@ngInject*/
  constructor($scope, ColumnAPI) {
    let vm = this;

    vm.ColumnAPI = ColumnAPI;
    vm.$scope = $scope;

    vm.mergedcolumnname = '';
    vm.mergeColumn = '';

    this.removeCurrentColumn();
  }

  removeCurrentColumn() {
    let vm = this;

    return vm.datasetColumns.splice(vm.datasetColumns.indexOf(vm.columnName), 1);
  }

  onSubmit() {
    let vm = this;

    let columnNames = [
      vm.columnName,
      vm.mergeColumn,
    ].join(',');

    vm.ColumnAPI.mergeColumns(columnNames, vm.mergedcolumnname);

    vm.$scope.$parent.closeThisDialog();
  }
}
