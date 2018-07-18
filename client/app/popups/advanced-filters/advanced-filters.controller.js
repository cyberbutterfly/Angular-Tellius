export class AdvancedFiltersPopupController {
  /*@ngInject*/
  constructor($scope, ColumnAPI, $state) {
    this.$scope = $scope;
    this.ColumnAPI = ColumnAPI;
    this.$state = $state;
  }

  enterSubmit($event) {
    const ENTER_KEY_CODE = 13;

    if ($event.keyCode === ENTER_KEY_CODE) {
      const listener = this.$scope.$watch('this.advancedCondition', (
        condition) => {
        this._filterHandler(condition);
        listener();
      });
    }
  }

  closeDialog() {
    return this.closeThisDialog()();
  }

  onSubmit() {
    if (this.advancedCondition.length !== 0) {
      if (this.$state.current.name === 'app.vizpad.chartview') {
        this._vizPadFilterHandler(this.advancedCondition);
      } else {
        this._filterHandler(this.advancedCondition);
      }
    }
  }

  _filterHandler(condition) {
    this.ColumnAPI.filter(condition)
      .then(() => {
        this.$scope.$parent.closeThisDialog();
      });
  }
  _vizPadFilterHandler(condition) {
    this.ColumnAPI.emit('advancedConditionAdded', {
      advancedFilter: condition,
    });
  }
}
