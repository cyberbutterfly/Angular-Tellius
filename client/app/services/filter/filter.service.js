import angular from 'angular';
import _ from 'lodash';
import {
  StringActions,
  NumberActions,
  MathActions,
}
from './filter.actions';

export class FilterService {
  /*@ngInject*/
  constructor(DatasetStorageService) {
    this.DatasetStorageService = DatasetStorageService;

    this.actions = [];
    this.__states = [];
    this.__advancedState = [];

    this.DatasetStorageService.on('DATASET_DID_CHANGE', dataset => {
      const cols = [].concat(this.__states, this.__advancedState)
      .filter(i => {
        return dataset.columns.includes(i.columnName) === false;
      });

      if (cols.length !== 0 ) {
        this.resetAllStates();
      }
    });
  }

  getAllStates() {
    return Object.assign({}, this.__states);
  }

  resetAllStates() {
    this.actions = [];
    this.__states = [];
    this.__advancedState = [];

    return this;
  }

  getState({
    columnName,
  }) {
    const filteredStates = this.__states.filter(state => {
      return state.columnName === columnName;
    });

    return _.isUndefined(filteredStates[0]) ? {} : filteredStates[0].state;
  }

  setState({
    columnName, sourceId, state,
  }) {
    let __state = {};

    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        const value = state[key];

        if ((!_.isArray(value) && !_.isNull(value)) ||
          (_.isArray(value) && value.length !== 0)) {
          __state[key] = value;
        }
      }
    }

    this.__states = this.__states
      .filter(i => {
        return i.sourceId === sourceId;
      })
      .filter(i => {
        return i.columnName !== columnName;
      });

    if (Object.keys(__state)
      .length) {
      this.__states.push({
        columnName,
        sourceId,
        state: __state,
      });
    }

    return Object.assign({}, __state);
  }

  hasState({
    columnName,
  }) {
    const state = _.find(this.__states, i => i.columnName === columnName);

    return _.isUndefined(state) ? false : true;
  }

  setAdvancedState(state) {
    const _state = state
      .filter(i => !_.isUndefined(i.columnName));

    this.__advancedState = _state;
  }

  getAdvancedState() {
    return Object.assign({}, this.__advancedState);
  }

  hasAdvancedState() {
    return _.isArray(this.__advancedState) && this.__advancedState.length !== 0;
  }

  resetAdvancedState() {
    this.__advancedState = [];
    return this.__advancedState;
  }

  getActions(type = 'string') { //eslint-disable-line no-unused-vars
    switch (type) {
      case 'string':
        this.actions = StringActions;
        break;
      case 'integer':
        this.actions = NumberActions;
        break;
      default:
        this.actions = StringActions;
    }

    return Object.assign({}, this.actions);
  }

  getMathActions() {
    return MathActions;
  }

  getTemplateByName(name, _actions) {
    const actions = _actions || [].concat(StringActions, NumberActions);

    if (actions.length === 0) {
      return false;
    }

    let result = actions.filter((item) => {
      return item.name === name;
    });

    if (result.length) {
      result = result[0].template;
    } else {
      result = false;
    }

    return result;
  }

  getCondition(columnName, selectedAction, params) {
    if (angular.isUndefined(columnName) || angular.isUndefined(selectedAction)) {
      return false;
    }

    let tmpl = this.getTemplateByName(selectedAction);

    if (params.length !== tmpl.length - 1) {
      return false;
    }

    if (angular.isFunction(tmpl)) {
      tmpl = tmpl.apply(null, [].concat(columnName, params));
    }

    return tmpl;
  }
}
