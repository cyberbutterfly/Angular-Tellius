import _ from 'lodash';

export class AdvancedFiltersController {
    /*@ngInject*/
  constructor($scope, FilterService, DatasetStorageService) {
    this.$scope = $scope;
    this.FilterService = FilterService;
    this.DatasetStorageService = DatasetStorageService;

    this.operators = [
      'and',
      'or',
    ];

    this.columns = this.getColumns();
    this.selectedColumns = [];
    this.filters = [{
      columnName: '',
      operator: '',
    }];
  }

  $onInit() {
    const advancedState = this.FilterService.getAdvancedState();
    const states = this.FilterService.getAllStates();

    if (_.isObject(advancedState) && Object.keys(advancedState)
      .length > 0) {
      this.filters = this.columns
        .filter(c => {
          return Object.values(states)
            .filter(s => s.columnName === c.name)
            .length;
        })
        .map(i => {
          const state = _.find(states, s => s.columnName === i.name);
          const operatorState = _.find(advancedState, c => {
            return c.columnName === i.name;
          });

          return {
            ...state,
            ...i,
            column: JSON.stringify(i),
              operator: _.isUndefined(operatorState) ? 'and' :
              operatorState.operator,
          };
        });
    } else {
      this.FilterService.resetAllStates();
    }

    this.$scope.$watch('$ctrl.filters', this.watchHandler.bind(this), true);
  }

  onChangeSelect(filter) {
    if (filter.column) {
      const columnData = JSON.parse(filter.column);

      filter.name = columnData.name;
      filter.type = columnData.type;
    }
  }

  watchHandler(filters) {
    const state = filters.map(i => {
        return {
          columnName: i.name,
          operator: i.operator,
        };
      })
      .filter(i => {
        return !_.isUndefined(i.columnName);
      });

    if (!_.isEmpty(state)) {
      this.FilterService.setAdvancedState(state);
    }

    this.advancedCondition = filters
      .filter(filter => {
        return _.isString(filter.condition);
      })
      .map(filter => {
        let operator = _.isUndefined(filter.operator) ? '' : filter.operator;
        operator = ' ' + operator;

        return operator + ' ' + filter.condition;
      })
      .join('')
      .trim();
  }

  getColumns() {
    return this.DatasetStorageService.getDataset()
      .schema.fields.map((item) => {
        let type = item.dataType.toLowerCase()
          .slice(0, item.dataType.length - 4);

        const result = {
          name: item.name,
          type: type,
        };

        return result;
      });
  }

  addCondition() {
    this.filters.push({
      columnName: '',
      operator: 'and',
    });
  }

  removeCondition(condition) {
    if (condition) {
      this.filters.splice(this.filters.indexOf(condition), 1);
    }
  }

}
