import _ from 'lodash';

const screens = [
  'transformation',
  'selection',
  'evaluation',
];

export default class MLWizard {
  /*@ngInject*/
  constructor() {
    this.reset();
  }

  getState({type}) {
    return _.cloneDeep(this.__states[type]);
  }

  setState({type, data}) {
    this.__invalidate({type});

    this.__states[type] = _.cloneDeep(data);
  }

  isChanged({
    type,
    currentState,
  }) {
    let result = null;

    try {
      result = !_.isEqual(
        this.getState({type}).formState,
        currentState.formState);
    } catch (e) {
      result = true;
    }

    return result;
  }

  reset() {
    this.__states = {
      'transformation': null,
      'selection': null,
      'evaluation': null,
    };
  }

  __invalidate({type}) {
    const types = Object.keys(screens);
    const idx = _.indexOf(types, type);

    if (idx !== -1) {
      for (let i = idx; i < types.length; i++) {
        console.log('invalidate: ', screens[types[i]]);
        // screens[types[i]] = null;
        // this.__states[type];
      }
    }
  }
}
