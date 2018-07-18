import _ from 'lodash';

export class ColumnFilterController {
  /*@ngInject*/
  constructor(FilterService, DatasetStorageService) {
    this.FilterService = FilterService;
    this.DatasetStorageService = DatasetStorageService;

    this.condition = null;
    this.selectedAction = null;
    this.selectedMathAction = null;
    this.actionParams = [];
    this.mathActionParams = [];
    this.mathActions = this.FilterService.getMathActions();

    this.__isShowMathActions = false;
  }

  $onInit() {
    if (!_.isUndefined(this.columnName)) {
      this.actions = this.FilterService.getActions(this.columnType);
      this.__setState({
        columnName: this.columnName,
      });
    }
  }

  $onChanges(newProps) {
    if (!_.isUndefined(newProps.columnName.currentValue)) {
      this.__setState({
        columnName: newProps.columnName.currentValue,
      });
    }

    if (!_.isUndefined(newProps.columnType)) {
      this.actions = this.FilterService.getActions(newProps.columnType.currentValue);
    }
  }

  isNumber() {
    return this.columnType === 'NumberType' ||
      this.columnType === 'DoubleType' ||
      this.columnType === 'IntegerType' ||
      this.columnType === 'DateType' ||
      this.columnType === 'integer' ||
      this.columnType === 'double';
  }

  toggleMathActions(event) {
    event.preventDefault();
    this.__isShowMathActions = !this.__isShowMathActions;
  }

  isShowMath() {
    return this.__isShowMathActions;
  }

  onChange() {
    if (_.isNull(this.selectedAction)) {
      return;
    }

    const actionTmpl = this.FilterService.getTemplateByName(this.selectedAction.name);

    this.actionParamsCount = actionTmpl ? new Array(actionTmpl.length - 1) : [];
    if (this.isNumber() && this.selectedMathAction) {
      const mathTmpl = this.getMathTemplate();
      this.mathParamsCount = new Array(mathTmpl.length - 1);
    }

    this.condition = this.FilterService.getCondition(this.renderColumnValue(),
      this.selectedAction.name, this.actionParams);

    this.FilterService.setState({
      columnName: this.columnName,
      sourceId: this.DatasetStorageService.getCurrent(),
      state: {
        actionParams: this.actionParams,
        selectedAction: this.selectedAction,
        selectedMathAction: this.selectedMathAction,
        mathActionParams: this.mathActionParams,
      },
    });
  }

  renderColumnValue() {
    let columnValue = this.columnName;

    if (this.isNumber() && this.selectedMathAction) {
      let mathTmpl = this.getMathTemplate();

      let params = this.mathActionParams.filter((item) => {
        return item !== undefined;
      });

      if (params.length === mathTmpl.length - 1) {
        columnValue = mathTmpl.apply(null, [].concat(this.columnName, this.mathActionParams));
      }
    }

    return columnValue;
  }

  getMathTemplate() {
    return this.FilterService.getTemplateByName(this.selectedMathAction, this
      .mathActions);
  }

  isShowCondition() {
    return this.condition && this.showCondition;
  }

  __setState({
    columnName,
  }) {
    const state = this.FilterService.getState({
      columnName: columnName,
      sourceId: this.DatasetStorageService.getCurrent(),
    });

    for (const i in state) {
      if (state.hasOwnProperty(i)) {
        this[i] = state[i];
      }
    }

    this.onChange();
  }

}
