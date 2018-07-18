import angular from 'angular';

export class AggregateController {
  /*@ngInject*/
  constructor($q, $filter, FunctionAPI, DatasetStorageService) {
    let vm = this;

    vm.$q                    = $q;
    vm.$filter               = $filter;
    vm.DatasetStorageService = DatasetStorageService;
    vm.FunctionAPI           = FunctionAPI;

    vm.FormData         = {};
    vm.type             = 'standard';
    vm.columns          = vm.DatasetStorageService.getColumns();
    vm.aggregationTypes = vm.FunctionAPI.getAggregationTypes();

    vm.groupBySelectedItem = null;
    vm.groupBySearchText = null;
    vm.FormData.groupBy = [];
    vm.FormData.aggregationColumns = [];
  }

  changeType(type) {
    let vm = this;

    vm.type             = type;
    vm.aggregationTypes = vm.FunctionAPI.getAggregationTypes(type);
  }

  isStandard() {
    let vm = this;

    return vm.type === 'standard';
  }

  isTimeSeries() {
      let vm = this;

      return vm.type === 'time-series';
  }

  validate(data) {
    let vm = this;

    let defer  = this.$q.defer();
    vm.errors = [];

    if (angular.isUndefined(data.groupBy)) {
      vm.errors.push('Group by is not defined');
    }

    if (angular.isUndefined(data.aggregationColumns)) {
      vm.errors.push('Select an aggregation column');
    }

    if (this.isTimeSeries() && !angular.isString(data.dateselector)) {
      vm.errors.push('Select a date');
    }

    if (vm.errors.length !== 0) {
      defer.reject(vm.errors);
    } else {
      defer.resolve(data);
    }

    return defer.promise;
  }

  onSubmit() {
    let vm          = this;
    let requestData = angular.copy(vm.FormData);

    if (this.isTimeSeries()) {
      requestData['aggtype-timeseries'] = angular.copy(requestData.aggregationTypes);
      requestData.dateselector          = vm.$filter('date')(angular.copy(requestData.dateselector), 'yyyy-MM-dd');
      delete requestData.aggregationTypes;
    } else {
      delete requestData.dateselector;
      requestData['aggtype-standard'] = angular.copy(requestData.aggregationTypes);
    }

    this.validate(requestData)
      .then((data) => {
        return vm.FunctionAPI.aggregate(data);
      })
      .then(() => {
        this.closeThisDialog();
      })
      .catch((errors) => {
        vm.errors = errors.join(', ');
      });
  }
}
