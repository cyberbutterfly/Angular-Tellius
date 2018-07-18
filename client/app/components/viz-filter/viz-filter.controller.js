import _ from 'lodash';

class VizFilterCtrl {
  /*@ngInject*/
  constructor(VizpadDataService, $rootScope, $scope, $mdDialog, $mdMedia, DatafileService, $timeout) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.xColumns = DatafileService.xColumns;
    this.yColumns = DatafileService.yColumns;

    this.vizFilters = [];
    this.showSecondFilter = false;
    this.vizPadOperators = [];
  }

  filterChanged(searchTextFilter) {
    this.searchTextFilter = searchTextFilter;
    if (this.yColumns.indexOf(this.searchTextFilter) != -1) {
      this.vizPadOperators = [
        {
          name: 'Less Than',
          value: 'Less Than',
        },
        {
          name: 'Less Than or equal to',
          value: 'Less Than or equal to',
        },
        {
          name: 'Equal To',
          value: 'Equal To',
        },
        {
          name: "Between",
          value: "Between",
        },
        {
          name: 'Greater Than',
          value: 'Greater Than',
        },
        {
          name: 'Greater Than or equal to',
          value: 'Greater Than or equal to',
        }
      ];
    } else {
      this.vizPadOperators = [
        {
          name: 'Equals',
          value: 'Equal To'
        },
        {
          name: 'Does not equals',
          value: 'Does not equals'
        },
        {
          name: 'Contains',
          value: 'Contains'
        },
        {
          name: 'Does not contain',
          value: 'Does not contain'
        },
        {
          name: 'Contains but does not contain',
          value: 'Contains but does not contain'
        },
        {
          name: 'Ends with',
          value: 'Ends with'
        },
        {
          name: 'Starts with',
          value: 'Starts with'
        },
        {
          name: 'Does not start with',
          value: 'Does not start with'
        }
      ];
    }
  }

  addFilter() {
    var parentThis = this;
    var filterObj = {
      "column": this.searchTextFilter,
      "operator": this.filterOperator,
      "value": this.filterValue,
      "secondValue": this.secondFilterValue
    };

    this.viz.filters.push(filterObj);

  }

  addFilterValueColumn() {
    if (this.filterOperator === "Contains but does not contain" || this.filterOperator === "Between") {
      this.showSecondFilter = true;
    } else {
      this.showSecondFilter = false;
    }
  }

  clear() {
    this.vizPadOperators = [];
    $('.filter-input-boxes input').val('');
    this.$mdDialog.hide();
  };

  hide() {
    this.$mdDialog.hide();
  };

}

export default VizFilterCtrl;
