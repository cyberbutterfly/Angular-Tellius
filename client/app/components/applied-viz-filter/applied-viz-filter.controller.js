class AppliedVizFilterCtrl {
  /*@ngInject*/
  constructor($rootScope, $scope) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.vizFiltersArr = [];
    var parentThis = this;
    $scope.$watch(() => {
      if (typeof this.viz != "undefined") {
        return this.viz.filters
      }
    }, (oldVal, newVal) => {
      angular.forEach(this.viz.filters, (filter) => {
         this.vizFiltersArr.push(filter.column + ' ' +filter.operator + ' ' + filter.value);
      });

      this.vizFiltersArr = _.uniq(this.vizFiltersArr);
    }, true);
  }

  removeFilter(ev, index, filters) {
    let indexOfFilter = 0;
    angular.forEach(this.viz.filters, (filter, key) => {
       if (_.isEqual(filter, filters)) {
         indexOfFilter = key;
       }
    })

    this.viz.filters.splice(indexOfFilter, 1);
    this.vizFiltersArr = [];
    angular.forEach(this.viz.filters, (filter) => {
       this.vizFiltersArr.push(filter.column + ' ' +filter.operator + ' ' + filter.value);
    });

  }
}
export default AppliedVizFilterCtrl;
