export class SplitrowsPopupCtrl {
  /*@ngInject*/
  constructor($scope, ColumnAPI) {
    let vm = this;

    vm.ColumnAPI = ColumnAPI;
    vm.$scope    = $scope;

    vm.delimiter = '';
  }

  onSubmit() {
    let vm = this;

    vm.$scope.$parent.closeThisDialog();
    vm.ColumnAPI.splitrows(vm.columnName, vm.delimiter);
  }
}
