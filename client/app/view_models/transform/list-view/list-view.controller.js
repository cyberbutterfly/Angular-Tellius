class GridListCtrl {
  /*@ngInject*/
  constructor($scope, $filter, ColumnAPI, DatasetStorageService) {
    let vm = this;

    vm.selectedColumns = [];

    vm.$scope = $scope;
    vm.$filter = $filter;
    vm.ColumnAPI = ColumnAPI;
    vm.DatasetStorageService = DatasetStorageService;

    vm.data = vm.dataset.schema.fields;
  }

  order(predicate) {
    let vm = this;
    let orderBy = vm.$filter('orderBy');
    vm.predicate = predicate;
    vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
    vm.data = orderBy(vm.data, predicate, vm.reverse);
  }

}

export default GridListCtrl;
