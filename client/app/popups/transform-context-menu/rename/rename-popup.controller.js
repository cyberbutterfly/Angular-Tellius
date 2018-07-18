export class RenamePopupCtrl {
  /*@ngInject*/
  constructor($scope, ColumnAPI) {
    let vm = this;

    vm.$scope    = $scope;
    vm.ColumnAPI = ColumnAPI;
  }

  renameColumnName() {
    let vm = this;

    vm.ColumnAPI.renameColumn(vm.initialValue, vm.columnName);
  }

  onSubmit() {
    let vm = this;

    vm.renameColumnName();
    vm.$scope.$parent.closeThisDialog();
  }
}
