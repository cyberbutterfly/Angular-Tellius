export class FilterPopupCtrl {
  /*@ngInject*/
  constructor($scope, FilterService, ColumnAPI) {
    let vm = this;

    vm.$scope = $scope;
    vm.FilterService = FilterService;
    vm.ColumnAPI = ColumnAPI;

    vm.error = '';
    vm.condition = null;
    vm.selectedAction = null;
    vm.actionParam = '';

    vm.actions = vm.FilterService.getActions(vm.columnType);

    vm.fileType = vm.columnType.toLowerCase()
      .substr(0, vm.columnType.length - 4);
  }

  onSubmit() {
    let vm = this;

    if (vm.condition && vm.condition.length !== 0) {
      vm.ColumnAPI.filter(vm.condition);
      vm.$scope.$parent.closeThisDialog();
    }
  }
}
