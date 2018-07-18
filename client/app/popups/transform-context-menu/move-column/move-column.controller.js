import angular from 'angular';

export class MoveColumnController {
  /*@ngInject*/
  constructor($scope, ColumnAPI, ArrayUtils) {
    let vm = this;

    vm.$scope                = $scope;
    vm.ColumnAPI             = ColumnAPI;
    vm.ArrayUtils            = ArrayUtils;
    vm.FormData              = {};

    vm.cols = angular.copy(vm.columns);
    vm.cols.splice(vm.cols.indexOf(vm.columnName), 1);
  }

  onSubmit() {
    let vm = this;

    let result  = null;

    switch (vm.type) {
    case 'before':
      result = vm.ArrayUtils.moveBeforeColumn(vm.columnName, vm.FormData.selectedColumn, vm.columns);
      break;
    case 'after':
      result = vm.ArrayUtils.moveAfterColumn(vm.columnName, vm.FormData.selectedColumn, vm.columns);
      break;
    default:
      result = vm.columns;
      break;
    }

    vm.ColumnAPI.moveColumn(result);
    vm.$scope.$parent.closeThisDialog();
  }
}
