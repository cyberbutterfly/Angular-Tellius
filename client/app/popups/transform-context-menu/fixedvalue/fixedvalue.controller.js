import angular from 'angular';

export class FixedValueController {
  /*@ngInject*/
  constructor($scope, ColumnAPI) {
    let vm = this;

    vm.$scope    = $scope;
    vm.ColumnAPI = ColumnAPI;
    vm.FormData  = {};
  }

  onSubmit() {
    let vm = this;

    if (angular.isString(vm.FormData.value)) {
      vm.ColumnAPI.handleNull(vm.columnName, vm.FormData.value);
      vm.$scope.$parent.closeThisDialog();
    }
  }
}
