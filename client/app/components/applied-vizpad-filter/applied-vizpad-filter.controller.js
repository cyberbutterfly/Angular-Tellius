
class AppliedVizpadFilterCtrl {
  /*@ngInject*/
  constructor($rootScope, $scope) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.vizpadFiltersArr = [];
    var parentThis = this;
    $scope.$watch(() => {
      if (typeof this.vizPadObj != "undefined" && this.vizPadObj.filters != "undefined") {
        return this.vizPadObj.filters
      }
    }, (oldVal, newVal) => {

      this.vizpadFiltersArr = [];
      angular.forEach(this.vizPadObj.filters, (filter) => {
         this.vizpadFiltersArr.push(filter.column + ' ' +filter.operator + ' ' + filter.value);
      });
      this.vizpadFiltersArr = _.uniq(this.vizpadFiltersArr);
    }, true);
  }
  removeFilter(ev, index, filters) {
    let indexOfFilter = 0;
    angular.forEach(this.vizPadObj.filters, (filter, key) => {
       if (_.isEqual(filter, filters)) {
         indexOfFilter = key;
       }
    })

    this.vizPadObj.filters.splice(indexOfFilter, 1);
    this.vizpadFiltersArr = [];
    angular.forEach(this.vizPadObj.filters, (filter) => {
       this.vizpadFiltersArr.push(filter.column + ' ' +filter.operator + ' ' + filter.value);
    });
  }
}

export default AppliedVizpadFilterCtrl;
